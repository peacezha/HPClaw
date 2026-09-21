#!/usr/bin/env python3
"""Read-only HPC module audit and deterministic modulefile rendering.

This script intentionally does not install software. Installation is site-specific
and must follow the workflow and policy shipped with the skill.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import platform
import posixpath
import re
import signal
import shlex
import shutil
import socket
import subprocess
import sys
import tempfile
import threading
from pathlib import Path, PurePosixPath
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


SCHEMA_VERSION = 1
EXIT_OK = 0
EXIT_USAGE = 2
EXIT_MANIFEST = 3
EXIT_MODULE_UNAVAILABLE = 4
EXIT_UNSATISFIED = 10
EXIT_BROKEN = 11
EXIT_INTERNAL = 70

MAX_COMMAND_OUTPUT = 65536
SAFE_NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._+-]{0,127}$")
SAFE_EXECUTABLE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._+-]{0,127}$")
SAFE_MODULE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._+/@:-]{0,255}$")
SAFE_ENV_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]{0,127}$")
CONSTRAINT_RE = re.compile(r"^\s*(==|>=|<=|>|<)?\s*([0-9A-Za-z][0-9A-Za-z._+-]*)\s*$")
VERSION_TOKEN_RE = re.compile(
    r"(?<![0-9A-Za-z])v?([0-9]+(?:\.[0-9A-Za-z]+)+(?:[-+._][0-9A-Za-z]+)*)"
)
SAFE_VERSION_PROBE_FLAGS = {"--version", "--version-only", "-version", "-V"}
SHELL_WRAPPERS = {
    "bash",
    "builtin",
    "command",
    "sh",
    "dash",
    "doas",
    "eval",
    "exec",
    "zsh",
    "ksh",
    "csh",
    "tcsh",
    "env",
    "nice",
    "nohup",
    "source",
    "sudo",
    "time",
    "xargs",
}
FLOATING_VERSION_LABELS = {
    "latest",
    "current",
    "stable",
    "head",
    "master",
    "main",
    "develop",
    "development",
    "nightly",
}
ALLOWED_PATH_VARIABLES = {
    "PATH",
    "MANPATH",
    "LD_LIBRARY_PATH",
    "LIBRARY_PATH",
    "CPATH",
    "CMAKE_PREFIX_PATH",
    "PKG_CONFIG_PATH",
    "PYTHONPATH",
    "PERL5LIB",
    "R_LIBS",
    "R_LIBS_SITE",
    "CLASSPATH",
    "XDG_DATA_DIRS",
}
FORBIDDEN_SETENV_VARIABLES = ALLOWED_PATH_VARIABLES | {
    "BASHOPTS",
    "BASH_ENV",
    "ENV",
    "GCONV_PATH",
    "HOME",
    "IFS",
    "JAVA_TOOL_OPTIONS",
    "JDK_JAVA_OPTIONS",
    "KSH_ENV",
    "LD_AUDIT",
    "LD_PRELOAD",
    "LMOD_CMD",
    "LOGNAME",
    "LOADEDMODULES",
    "MODULEPATH",
    "MODULESHOME",
    "MODULES_CMD",
    "NODE_OPTIONS",
    "OLDPWD",
    "PERL5OPT",
    "PERL5SHELL",
    "PROMPT_COMMAND",
    "PWD",
    "PYTHONHOME",
    "PYTHONINSPECT",
    "PYTHONSTARTUP",
    "R_ENVIRON",
    "R_ENVIRON_USER",
    "R_PROFILE",
    "R_PROFILE_USER",
    "RUBYOPT",
    "SHELL",
    "SHELLOPTS",
    "USER",
    "ZDOTDIR",
    "_JAVA_OPTIONS",
    "_LMFILES_",
}
DANGEROUS_INHERITED_ENV_VARIABLES = {
    "BASH_ENV",
    "ENV",
    "GCONV_PATH",
    "JAVA_TOOL_OPTIONS",
    "JDK_JAVA_OPTIONS",
    "KSH_ENV",
    "LD_AUDIT",
    "LD_PRELOAD",
    "NODE_OPTIONS",
    "PERL5OPT",
    "PERL5SHELL",
    "PROMPT_COMMAND",
    "PYTHONHOME",
    "PYTHONINSPECT",
    "PYTHONSTARTUP",
    "R_ENVIRON",
    "R_ENVIRON_USER",
    "R_PROFILE",
    "R_PROFILE_USER",
    "RUBYOPT",
    "ZDOTDIR",
    "_JAVA_OPTIONS",
}
UNSAFE_STARTUP_ENV_RE = re.compile(r"^(?:LUA_INIT(?:_.*)?|KSH_ENV|ZDOTDIR)$")
UNSAFE_INHERITED_ENV_NAME_RE = re.compile(
    r"^(?:BASH_FUNC_.*|LMOD_.*|MODULEPATH|MODULESHOME|MODULES_CMD|LOADEDMODULES|_LMFILES_)$"
)
FORBIDDEN_POSIX_PREFIXES = (
    "/bin",
    "/boot",
    "/dev",
    "/etc",
    "/lib",
    "/lib64",
    "/opt",
    "/proc",
    "/root",
    "/run",
    "/sbin",
    "/sys",
    "/usr",
    "/var",
)
FORBIDDEN_POSIX_EXACT = {"/home"}
SENSITIVE_ENV_NAME_RE = re.compile(
    r"(?:^|_)(?:PASSWORD|PASSWD|TOKEN|SECRET|PRIVATE_KEY|LICENSE_KEY|API_KEY|ACCESS_KEY)(?:_|$)",
    re.IGNORECASE,
)


class UserInputError(Exception):
    """Raised for invalid manifests, records, or command arguments."""


class ModuleSystemError(Exception):
    """Raised when Environment Modules/Lmod cannot be initialized."""


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def strip_ansi(value: str) -> str:
    return re.sub(r"\x1b\[[0-?]*[ -/]*[@-~]", "", value)


def clipped(value: str, limit: int = MAX_COMMAND_OUTPUT) -> str:
    value = strip_ansi(value)
    if len(value) <= limit:
        return value
    return value[:limit] + "\n...[output truncated]"


def require_text(value: Any, field: str, *, max_length: int = 4096) -> str:
    if not isinstance(value, str) or not value.strip():
        raise UserInputError(f"{field} must be a non-empty string")
    if "\x00" in value or "\n" in value or "\r" in value:
        raise UserInputError(f"{field} must not contain NUL or newline characters")
    if len(value) > max_length:
        raise UserInputError(f"{field} exceeds {max_length} characters")
    return value


def require_safe_name(value: Any, field: str) -> str:
    text = require_text(value, field, max_length=128)
    if not SAFE_NAME_RE.fullmatch(text):
        raise UserInputError(f"{field} contains unsupported characters: {text!r}")
    return text


def require_executable(value: Any, field: str) -> str:
    text = require_text(value, field, max_length=128)
    if not SAFE_EXECUTABLE_RE.fullmatch(text):
        raise UserInputError(f"{field} must be a bare executable name: {text!r}")
    return text


def require_module_name(value: Any, field: str) -> str:
    text = require_text(value, field, max_length=256)
    if not SAFE_MODULE_RE.fullmatch(text) or ".." in text or text.startswith("/"):
        raise UserInputError(f"{field} is not a safe module name: {text!r}")
    return text


def require_string_list(value: Any, field: str, *, allow_empty: bool = False) -> List[str]:
    if not isinstance(value, list) or (not value and not allow_empty):
        qualifier = "a list" if allow_empty else "a non-empty list"
        raise UserInputError(f"{field} must be {qualifier}")
    result: List[str] = []
    for index, item in enumerate(value):
        result.append(require_text(item, f"{field}[{index}]"))
    return result


def natural_version(value: str) -> Tuple[Tuple[int, Any], ...]:
    tokens = re.findall(r"[0-9]+|[A-Za-z]+", value)
    if not tokens:
        raise UserInputError(f"cannot compare version {value!r}")
    parsed: List[Tuple[int, Any]] = []
    for token in tokens:
        if token.isdigit():
            parsed.append((0, int(token)))
        else:
            parsed.append((1, token.lower()))
    while parsed and parsed[-1] == (0, 0):
        parsed.pop()
    return tuple(parsed)


def compare_versions(left: str, right: str) -> int:
    left_value = natural_version(left)
    right_value = natural_version(right)
    if left_value < right_value:
        return -1
    if left_value > right_value:
        return 1
    return 0


def parse_constraint(value: str) -> List[Tuple[str, str]]:
    text = require_text(value, "version", max_length=256)
    result: List[Tuple[str, str]] = []
    for raw_part in text.split(","):
        match = CONSTRAINT_RE.fullmatch(raw_part)
        if not match:
            raise UserInputError(f"unsupported version constraint: {raw_part!r}")
        operator = match.group(1) or "=="
        version = match.group(2)
        if version.lower() in FLOATING_VERSION_LABELS:
            raise UserInputError(f"floating version labels are not allowed: {version!r}")
        natural_version(version)
        result.append((operator, version))
    return result


def version_satisfies(detected: str, constraint: str) -> bool:
    for operator, expected in parse_constraint(constraint):
        comparison = compare_versions(detected, expected)
        if operator == "==" and comparison != 0:
            return False
        if operator == ">=" and comparison < 0:
            return False
        if operator == "<=" and comparison > 0:
            return False
        if operator == ">" and comparison <= 0:
            return False
        if operator == "<" and comparison >= 0:
            return False
    return True


def extract_version(output: str, marker: str) -> Optional[str]:
    marker_folded = marker.casefold()
    for line in output.splitlines():
        if marker_folded not in line.casefold():
            continue
        match = VERSION_TOKEN_RE.search(line)
        if match:
            return match.group(1)
    return None


def load_json(path: Path) -> Dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(handle)
    except FileNotFoundError as exc:
        raise UserInputError(f"file does not exist: {path}") from exc
    except json.JSONDecodeError as exc:
        raise UserInputError(f"invalid JSON in {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise UserInputError(f"top-level JSON value in {path} must be an object")
    return value


def validate_probe(
    probe: Any,
    executables: Sequence[str],
    default_marker: str,
    field: str,
) -> Dict[str, Any]:
    if probe is None:
        return {
            "argv": [executables[0], "--version"],
            "marker": default_marker,
        }
    if not isinstance(probe, dict):
        raise UserInputError(f"{field} must be an object")
    argv = require_string_list(probe.get("argv"), f"{field}.argv")
    if len(argv) != 2:
        raise UserInputError(
            f"{field}.argv must contain exactly an executable and one approved version flag"
        )
    for index, argument in enumerate(argv):
        require_text(argument, f"{field}.argv[{index}]", max_length=2048)
    command = require_executable(argv[0], f"{field}.argv[0]")
    if command in SHELL_WRAPPERS:
        raise UserInputError(f"{field}.argv[0] may not be a shell or command wrapper")
    if command not in executables:
        raise UserInputError(f"{field}.argv[0] must be listed in executables")
    if argv[1] not in SAFE_VERSION_PROBE_FLAGS:
        raise UserInputError(
            f"{field}.argv[1] must be one of {sorted(SAFE_VERSION_PROBE_FLAGS)}"
        )
    if "regex" in probe:
        raise UserInputError(
            f"{field}.regex is not supported; use a literal marker to avoid regex DoS"
        )
    marker = require_text(
        probe.get("marker", default_marker),
        f"{field}.marker",
        max_length=256,
    )
    return {"argv": argv, "marker": marker}


def validate_manifest(value: Dict[str, Any]) -> Dict[str, Any]:
    if value.get("schema_version") != SCHEMA_VERSION:
        raise UserInputError(f"schema_version must be {SCHEMA_VERSION}")
    tools = value.get("tools")
    if not isinstance(tools, list) or not tools:
        raise UserInputError("tools must be a non-empty list")

    validated_tools: List[Dict[str, Any]] = []
    seen_names = set()
    for index, raw_tool in enumerate(tools):
        field = f"tools[{index}]"
        if not isinstance(raw_tool, dict):
            raise UserInputError(f"{field} must be an object")
        name = require_safe_name(raw_tool.get("name"), f"{field}.name")
        key = name.lower()
        if key in seen_names:
            raise UserInputError(f"duplicate tool name: {name}")
        seen_names.add(key)
        version = require_text(raw_tool.get("version"), f"{field}.version", max_length=256)
        parse_constraint(version)
        raw_executables = require_string_list(raw_tool.get("executables"), f"{field}.executables")
        executables = [
            require_executable(item, f"{field}.executables[{item_index}]")
            for item_index, item in enumerate(raw_executables)
        ]
        if len(set(executables)) != len(executables):
            raise UserInputError(f"{field}.executables contains duplicates")

        raw_candidates = raw_tool.get("module_candidates")
        if raw_candidates is None:
            raise UserInputError(
                f"{field}.module_candidates is required; discover exact site module names first"
            )
        candidates = [
            require_module_name(item, f"{field}.module_candidates[{item_index}]")
            for item_index, item in enumerate(
                require_string_list(raw_candidates, f"{field}.module_candidates")
            )
        ]
        candidates = list(dict.fromkeys(candidates))

        raw_prerequisites = raw_tool.get("prerequisite_modules", [])
        prerequisites = [
            require_module_name(item, f"{field}.prerequisite_modules[{item_index}]")
            for item_index, item in enumerate(
                require_string_list(
                    raw_prerequisites,
                    f"{field}.prerequisite_modules",
                    allow_empty=True,
                )
            )
        ]
        prerequisites = list(dict.fromkeys(prerequisites))

        probe = validate_probe(
            raw_tool.get("version_probe"),
            executables,
            name,
            f"{field}.version_probe",
        )
        if "smoke_test" in raw_tool:
            raise UserInputError(
                f"{field}.smoke_test is not allowed in the untrusted audit manifest; "
                "place reviewed smoke tests in the deployment plan"
            )

        validated = dict(raw_tool)
        validated.update(
            {
                "name": name,
                "version": version,
                "executables": executables,
                "module_candidates": candidates,
                "prerequisite_modules": prerequisites,
                "version_probe": probe,
            }
        )
        validated_tools.append(validated)

    validated_manifest = dict(value)
    validated_manifest["tools"] = validated_tools
    return validated_manifest


def find_bash() -> str:
    bash = shutil.which("bash")
    if not bash and Path("/bin/bash").exists():
        bash = "/bin/bash"
    if not bash:
        raise ModuleSystemError("bash is required to initialize shell-based module systems")
    return bash


def validate_module_init(path_text: Optional[str]) -> Optional[Path]:
    if not path_text:
        return None
    path = Path(path_text)
    if not path.is_absolute():
        raise UserInputError("--module-init must be an absolute path")
    try:
        resolved = path.resolve(strict=True)
    except FileNotFoundError as exc:
        raise UserInputError(f"--module-init does not exist: {path}") from exc
    if not resolved.is_file():
        raise UserInputError(f"--module-init is not a regular file: {resolved}")
    return resolved


def shell_init_lines(module_init: Optional[Path]) -> List[str]:
    lines = ["set +u"]
    if module_init is not None:
        lines.append(f". {shlex.quote(str(module_init))}")
    else:
        lines.extend(
            [
                'if [ -r /etc/profile ]; then . /etc/profile >/dev/null 2>&1 || true; fi',
                'if ! type module >/dev/null 2>&1 && [ -r /etc/profile.d/lmod.sh ]; then . /etc/profile.d/lmod.sh; fi',
                'if ! type module >/dev/null 2>&1 && [ -r /etc/profile.d/modules.sh ]; then . /etc/profile.d/modules.sh; fi',
                'if ! type module >/dev/null 2>&1 && [ -r /usr/share/lmod/lmod/init/bash ]; then . /usr/share/lmod/lmod/init/bash; fi',
            ]
        )
    return lines


def sanitized_child_environment(
    source: Optional[Dict[str, str]] = None,
) -> Dict[str, str]:
    environment = os.environ if source is None else source
    return {
        key: value
        for key, value in environment.items()
        if not SENSITIVE_ENV_NAME_RE.search(key)
        and key not in DANGEROUS_INHERITED_ENV_VARIABLES
        and not UNSAFE_STARTUP_ENV_RE.fullmatch(key)
        and not UNSAFE_INHERITED_ENV_NAME_RE.fullmatch(key)
    }


def run_bash(
    body: str,
    module_init: Optional[Path],
    *,
    timeout: int = 60,
) -> subprocess.CompletedProcess[str]:
    script = "\n".join(shell_init_lines(module_init) + [body])
    child_environment = sanitized_child_environment()
    command = [find_bash(), "--noprofile", "--norc", "-c", script]
    process = subprocess.Popen(
        command,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=child_environment,
        start_new_session=(os.name == "posix"),
    )
    stdout_chunks: List[bytes] = []
    stderr_chunks: List[bytes] = []
    stdout_state = {"size": 0, "truncated": False}
    stderr_state = {"size": 0, "truncated": False}

    def drain(
        stream: Any,
        chunks: List[bytes],
        state: Dict[str, Any],
    ) -> None:
        try:
            while True:
                chunk = stream.read(8192)
                if not chunk:
                    break
                remaining = MAX_COMMAND_OUTPUT - state["size"]
                if remaining > 0:
                    kept = chunk[:remaining]
                    chunks.append(kept)
                    state["size"] += len(kept)
                if len(chunk) > max(remaining, 0):
                    state["truncated"] = True
        except (OSError, ValueError):
            pass
        finally:
            try:
                stream.close()
            except (OSError, ValueError):
                pass

    assert process.stdout is not None
    assert process.stderr is not None
    stdout_thread = threading.Thread(
        target=drain,
        args=(process.stdout, stdout_chunks, stdout_state),
        daemon=True,
    )
    stderr_thread = threading.Thread(
        target=drain,
        args=(process.stderr, stderr_chunks, stderr_state),
        daemon=True,
    )
    stdout_thread.start()
    stderr_thread.start()
    timed_out = False
    try:
        return_code = process.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        timed_out = True
        if os.name == "posix":
            try:
                os.killpg(process.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
        else:
            process.terminate()
        try:
            return_code = process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            if os.name == "posix":
                try:
                    os.killpg(process.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
            else:
                process.kill()
            return_code = process.wait()
    stdout_thread.join(timeout=1)
    stderr_thread.join(timeout=1)
    if stdout_thread.is_alive() or stderr_thread.is_alive():
        if os.name == "posix":
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
        else:
            try:
                process.kill()
            except OSError:
                pass
        stdout_thread.join(timeout=5)
        stderr_thread.join(timeout=5)
    if stdout_thread.is_alive() or stderr_thread.is_alive():
        try:
            process.stdout.close()
        except OSError:
            pass
        try:
            process.stderr.close()
        except OSError:
            pass
        stdout_thread.join(timeout=1)
        stderr_thread.join(timeout=1)

    def decode(chunks: List[bytes], state: Dict[str, Any]) -> str:
        value = b"".join(chunks).decode("utf-8", errors="replace")
        if state["truncated"]:
            value += "\n...[output truncated while streaming]"
        return value

    stdout = decode(stdout_chunks, stdout_state)
    stderr = decode(stderr_chunks, stderr_state)
    if timed_out:
        stderr += "\ncommand timed out"
        return_code = 124
    return subprocess.CompletedProcess(command, return_code, stdout, stderr)


def module_info(module_init: Optional[Path]) -> Dict[str, Any]:
    result = run_bash(
        """
if ! type module >/dev/null 2>&1; then
  exit 4
fi
printf '__TYPE__%s\\n' "$(type -t module 2>/dev/null || true)"
printf '__MODULEPATH__%s\\n' "${MODULEPATH-}"
module --version 2>&1 || true
""".strip(),
        module_init,
    )
    if result.returncode == 4:
        return {
            "available": False,
            "implementation": None,
            "version_output": "",
            "modulepath": [],
        }
    combined = clipped(result.stdout + ("\n" + result.stderr if result.stderr else ""))
    type_match = re.search(r"^__TYPE__(.*)$", combined, re.MULTILINE)
    path_match = re.search(r"^__MODULEPATH__(.*)$", combined, re.MULTILINE)
    cleaned = re.sub(r"^__(?:TYPE|MODULEPATH)__.*$\n?", "", combined, flags=re.MULTILINE).strip()
    lower = cleaned.lower()
    if "lmod" in lower:
        implementation = "lmod"
    elif "modules release" in lower or "environment modules" in lower:
        implementation = "environment-modules"
    else:
        implementation = "unknown"
    modulepath = []
    if path_match and path_match.group(1):
        modulepath = [entry for entry in path_match.group(1).split(":") if entry]
    return {
        "available": result.returncode == 0,
        "implementation": implementation,
        "shell_type": type_match.group(1).strip() if type_match else None,
        "version_output": cleaned,
        "modulepath": modulepath,
    }


def command_locations(
    commands: Iterable[str],
    module_init: Optional[Path],
) -> Dict[str, Optional[str]]:
    locations: Dict[str, Optional[str]] = {}
    for command in commands:
        quoted = shlex.quote(command)
        result = run_bash(
            f"command -v -- {quoted} 2>/dev/null || true",
            module_init,
            timeout=15,
        )
        location = result.stdout.strip().splitlines()
        locations[command] = location[0] if location else None
    return locations


def read_os_release() -> Dict[str, str]:
    path = Path("/etc/os-release")
    if not path.is_file():
        return {}
    result: Dict[str, str] = {}
    try:
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, raw_value = line.split("=", 1)
            value = raw_value.strip().strip('"').strip("'")
            if key in {"ID", "VERSION_ID", "PRETTY_NAME"}:
                result[key.lower()] = value
    except OSError:
        return {}
    return result


def build_preflight(module_init: Optional[Path]) -> Dict[str, Any]:
    module = module_info(module_init)
    schedulers = command_locations(["sbatch", "squeue", "qsub", "qstat"], module_init)
    backends = command_locations(
        [
            "eb",
            "spack",
            "micromamba",
            "mamba",
            "conda",
            "apptainer",
            "singularity",
        ],
        module_init,
    )
    backend_module_queries = {
        "easybuild": ("EasyBuild", "easybuild"),
        "spack": ("Spack", "spack"),
        "micromamba": ("micromamba", "Mamba"),
        "conda": ("Anaconda", "Miniconda", "conda"),
        "apptainer": ("Apptainer", "Singularity"),
    }
    backend_modules: Dict[str, List[str]] = {}
    if module["available"]:
        for backend, queries in backend_module_queries.items():
            discovered: List[str] = []
            for query in queries:
                output = discovery_output(query, module_init)
                if discovery_mentions(query, output):
                    discovered.append(query)
            backend_modules[backend] = discovered
    uid = os.getuid() if hasattr(os, "getuid") else None
    return {
        "schema_version": SCHEMA_VERSION,
        "command": "preflight",
        "generated_at": utc_now(),
        "host": {
            "hostname": socket.getfqdn(),
            "uid": uid,
        },
        "platform": {
            "system": platform.system(),
            "release": platform.release(),
            "machine": platform.machine(),
            "os_release": read_os_release(),
        },
        "module_system": module,
        "scheduler_commands": schedulers,
        "backend_commands": backends,
        "backend_module_candidates": backend_modules,
    }


def discovery_output(candidate: str, module_init: Optional[Path]) -> str:
    quoted = shlex.quote(candidate)
    body = f"""
if ! type module >/dev/null 2>&1; then exit 4; fi
module --terse avail {quoted} 2>&1 || true
if [ -n "${{LMOD_CMD-}}" ]; then
  module spider {quoted} 2>&1 || true
fi
""".strip()
    result = run_bash(body, module_init, timeout=45)
    return clipped(result.stdout + ("\n" + result.stderr if result.stderr else ""), 16384)


def discovery_mentions(candidate: str, output: str) -> bool:
    normalized_output = re.sub(r"\s+", " ", output).lower()
    negative_phrases = (
        "unable to find",
        "no module(s) or extension(s) found",
        "no module named",
        "unknown module",
        "module not found",
    )
    if any(phrase in normalized_output for phrase in negative_phrases):
        return False
    candidate_lower = candidate.lower()
    base = candidate_lower.split("/", 1)[0]
    return candidate_lower in normalized_output or re.search(
        rf"(?<![A-Za-z0-9._+-]){re.escape(base)}(?:/|\\s|$)",
        normalized_output,
    ) is not None


def probe_candidate(
    candidate: str,
    prerequisites: Sequence[str],
    executables: Sequence[str],
    probe: Dict[str, Any],
    module_init: Optional[Path],
) -> Dict[str, Any]:
    modules = list(prerequisites) + [candidate]
    load_args = " ".join(shlex.quote(name) for name in modules)
    baseline_lines: List[str] = []
    executable_lines: List[str] = []
    for executable in executables:
        quoted = shlex.quote(executable)
        baseline_lines.extend(
            [
                f"__bio_baseline=$(command -v -- {quoted} 2>/dev/null || true)",
                f'printf "__BIO_BASELINE__{executable}\\t%s\\n" "$__bio_baseline"',
            ]
        )
        executable_lines.extend(
            [
                f"__bio_path=$(command -v -- {quoted} 2>/dev/null || true)",
                f'printf "__BIO_PATH__{executable}\\t%s\\n" "$__bio_path"',
                'case "$__bio_path" in',
                '  /*) [ -x "$__bio_path" ] || __bio_invalid=1 ;;',
                "  *) __bio_invalid=1 ;;",
                "esac",
            ]
        )
    probe_command = " ".join(shlex.quote(argument) for argument in probe["argv"])
    body = "\n".join(
        [
            "if ! type module >/dev/null 2>&1; then exit 4; fi",
            "module purge >/dev/null 2>&1 || true",
            *baseline_lines,
            f"if ! module load {load_args}; then exit 20; fi",
            'printf "__BIO_LOADED__\\n"',
            "__bio_invalid=0",
            *executable_lines,
            'printf "__BIO_VERSION_BEGIN__\\n"',
            'if [ "$__bio_invalid" -ne 0 ]; then',
            '  printf "\\n__BIO_VERSION_RC__126\\n"',
            "  exit 0",
            "fi",
            f"{probe_command} 2>&1",
            "__bio_rc=$?",
            'printf "\\n__BIO_VERSION_RC__%s\\n" "$__bio_rc"',
            "exit 0",
        ]
    )
    result = run_bash(body, module_init, timeout=90)
    stdout = clipped(result.stdout)
    stderr = clipped(result.stderr)
    loaded = "__BIO_LOADED__" in stdout
    baseline_paths: Dict[str, Optional[str]] = {}
    paths: Dict[str, Optional[str]] = {}
    for executable in executables:
        baseline_match = re.search(
            rf"^__BIO_BASELINE__{re.escape(executable)}\t(.*)$",
            stdout,
            re.MULTILINE,
        )
        baseline_paths[executable] = (
            baseline_match.group(1).strip()
            if baseline_match and baseline_match.group(1).strip()
            else None
        )
        match = re.search(
            rf"^__BIO_PATH__{re.escape(executable)}\t(.*)$",
            stdout,
            re.MULTILINE,
        )
        paths[executable] = match.group(1).strip() if match and match.group(1).strip() else None
    version_output = ""
    version_rc: Optional[int] = None
    if "__BIO_VERSION_BEGIN__\n" in stdout:
        version_output = stdout.split("__BIO_VERSION_BEGIN__\n", 1)[1]
        rc_match = re.search(r"\n__BIO_VERSION_RC__(\d+)\s*$", version_output)
        if rc_match:
            version_rc = int(rc_match.group(1))
            version_output = version_output[: rc_match.start()]
    return {
        "module": candidate,
        "loaded": loaded,
        "shell_exit": result.returncode,
        "baseline_executable_paths": baseline_paths,
        "executable_paths": paths,
        "version_probe_exit": version_rc,
        "version_output": clipped(version_output.strip(), 16384),
        "stderr": clipped(stderr, 16384),
    }


def audit_tool(
    tool: Dict[str, Any],
    module_init: Optional[Path],
) -> Dict[str, Any]:
    attempts: List[Dict[str, Any]] = []
    saw_discoverable = False
    saw_loaded = False
    saw_wrong_version = False
    saw_path_only = False
    path_only_version: Optional[str] = None
    path_only_paths: Dict[str, Optional[str]] = {}

    for candidate in tool["module_candidates"]:
        discovery = discovery_output(candidate, module_init)
        discoverable = discovery_mentions(candidate, discovery)
        saw_discoverable = saw_discoverable or discoverable
        attempt = probe_candidate(
            candidate,
            tool["prerequisite_modules"],
            tool["executables"],
            tool["version_probe"],
            module_init,
        )
        attempt["discoverable"] = discoverable
        attempt["discovery_output"] = discovery
        attempts.append(attempt)

        if not attempt["loaded"]:
            continue
        saw_loaded = True
        missing_executables = [
            name for name, path in attempt["executable_paths"].items() if not path
        ]
        if missing_executables or attempt["version_probe_exit"] != 0:
            continue
        detected_version = extract_version(
            attempt["version_output"],
            tool["version_probe"]["marker"],
        )
        if detected_version is None:
            continue
        attempt["detected_version"] = detected_version
        try:
            satisfied = version_satisfies(detected_version, tool["version"])
        except UserInputError:
            satisfied = False
        if satisfied:
            baseline_paths = attempt.get("baseline_executable_paths", {})
            unchanged_from_baseline = all(
                baseline_paths.get(executable)
                and baseline_paths.get(executable) == attempt["executable_paths"].get(executable)
                for executable in tool["executables"]
            )
            if unchanged_from_baseline:
                saw_path_only = True
                path_only_version = detected_version
                path_only_paths = attempt["executable_paths"]
                attempt["path_origin"] = "preexisting_after_module_purge"
                continue
            return {
                "name": tool["name"],
                "requested_version": tool["version"],
                "status": "satisfied",
                "selected_module": candidate,
                "detected_version": detected_version,
                "executable_paths": attempt["executable_paths"],
                "attempts": attempts,
            }
        saw_wrong_version = True

    if saw_path_only:
        status = "path_only"
    elif saw_wrong_version:
        status = "wrong_version"
    elif saw_loaded or saw_discoverable:
        status = "broken"
    else:
        status = "missing"
    return {
        "name": tool["name"],
        "requested_version": tool["version"],
        "status": status,
        "selected_module": None,
        "detected_version": path_only_version,
        "executable_paths": path_only_paths,
        "attempts": attempts,
    }


def build_audit(
    manifest: Dict[str, Any],
    module_init: Optional[Path],
) -> Tuple[Dict[str, Any], int]:
    module = module_info(module_init)
    if not module["available"]:
        report = {
            "schema_version": SCHEMA_VERSION,
            "command": "audit",
            "generated_at": utc_now(),
            "ok": False,
            "changed": False,
            "error_code": "MODULE_SYSTEM_UNAVAILABLE",
            "module_system": module,
            "summary": {
                "requested": len(manifest["tools"]),
                "satisfied": 0,
                "missing": 0,
                "wrong_version": 0,
                "broken": 0,
                "path_only": 0,
                "module_system_unavailable": len(manifest["tools"]),
            },
            "items": [
                {
                    "name": tool["name"],
                    "requested_version": tool["version"],
                    "status": "module_system_unavailable",
                }
                for tool in manifest["tools"]
            ],
        }
        return report, EXIT_MODULE_UNAVAILABLE

    items = [audit_tool(tool, module_init) for tool in manifest["tools"]]
    counts = {
        "requested": len(items),
        "satisfied": sum(item["status"] == "satisfied" for item in items),
        "missing": sum(item["status"] == "missing" for item in items),
        "wrong_version": sum(item["status"] == "wrong_version" for item in items),
        "broken": sum(item["status"] == "broken" for item in items),
        "path_only": sum(item["status"] == "path_only" for item in items),
        "module_system_unavailable": 0,
    }
    ok = counts["satisfied"] == counts["requested"]
    if counts["broken"] or counts["path_only"]:
        exit_code = EXIT_BROKEN
        error_code = "MODULE_BROKEN"
    elif not ok:
        exit_code = EXIT_UNSATISFIED
        error_code = "SOFTWARE_UNSATISFIED"
    else:
        exit_code = EXIT_OK
        error_code = None
    report = {
        "schema_version": SCHEMA_VERSION,
        "command": "audit",
        "generated_at": utc_now(),
        "ok": ok,
        "changed": False,
        "exit_code": exit_code,
        "error_code": error_code,
        "module_system": module,
        "summary": counts,
        "items": items,
    }
    return report, exit_code


def validate_relative_posix_path(value: Any, field: str) -> str:
    text = require_text(value, field, max_length=1024)
    path = PurePosixPath(text)
    if path.is_absolute() or ".." in path.parts or "." == text:
        raise UserInputError(f"{field} must be a relative path below prefix")
    return str(path)


def forbidden_posix_target(value: str) -> bool:
    normalized = posixpath.normpath("/" + value.lstrip("/"))
    return any(
        normalized == prefix or normalized.startswith(prefix + "/")
        for prefix in FORBIDDEN_POSIX_PREFIXES
    ) or normalized in FORBIDDEN_POSIX_EXACT


def validate_install_record(value: Dict[str, Any]) -> Dict[str, Any]:
    name = require_safe_name(value.get("name"), "name")
    raw_version = require_text(value.get("version"), "version", max_length=256)
    constraints = parse_constraint(raw_version)
    if len(constraints) != 1 or constraints[0][0] != "==":
        raise UserInputError("install record version must be one exact immutable version")
    version = constraints[0][1]
    prefix = require_text(value.get("prefix"), "prefix", max_length=4096)
    raw_prefix_path = PurePosixPath(prefix)
    if (
        not raw_prefix_path.is_absolute()
        or prefix == "/"
        or prefix.startswith("//")
        or ".." in raw_prefix_path.parts
    ):
        raise UserInputError("prefix must be a non-root absolute POSIX path")
    normalized_prefix = posixpath.normpath("/" + prefix.lstrip("/"))
    prefix_path = PurePosixPath(normalized_prefix)
    if normalized_prefix == "/" or forbidden_posix_target(normalized_prefix):
        raise UserInputError(
            "prefix is under a protected system root; use a site-approved shared or user root"
        )
    if os.name == "posix":
        resolved_prefix = Path(normalized_prefix).resolve(strict=False)
        if forbidden_posix_target(str(resolved_prefix)):
            raise UserInputError("prefix resolves under a protected system root")
        try:
            current_home = Path.home().resolve(strict=True)
        except OSError:
            current_home = Path.home().resolve(strict=False)
        if resolved_prefix == current_home:
            raise UserInputError("prefix may not be the home-directory root")

    description = value.get("description", f"{name} {version}")
    description = require_text(description, "description", max_length=4096)
    homepage = value.get("homepage")
    if homepage is not None:
        homepage = require_text(homepage, "homepage", max_length=2048)
    license_name = value.get("license")
    if license_name is not None:
        license_name = require_text(license_name, "license", max_length=256)

    dependencies = [
        require_module_name(item, f"dependencies[{index}]")
        for index, item in enumerate(
            require_string_list(value.get("dependencies", []), "dependencies", allow_empty=True)
        )
    ]
    conflicts = [
        require_module_name(item, f"conflicts[{index}]")
        for index, item in enumerate(
            require_string_list(value.get("conflicts", [name]), "conflicts", allow_empty=True)
        )
    ]

    raw_paths = value.get("paths", {"PATH": ["bin"]})
    if not isinstance(raw_paths, dict):
        raise UserInputError("paths must be an object mapping environment variables to lists")
    paths: Dict[str, List[str]] = {}
    for variable, entries in raw_paths.items():
        variable_text = require_text(variable, "paths variable", max_length=128)
        if not SAFE_ENV_RE.fullmatch(variable_text):
            raise UserInputError(f"invalid paths environment variable: {variable_text!r}")
        if variable_text not in ALLOWED_PATH_VARIABLES:
            raise UserInputError(
                f"paths variable is not in the approved path-variable set: {variable_text!r}"
            )
        raw_entries = require_string_list(entries, f"paths.{variable_text}", allow_empty=True)
        paths[variable_text] = [
            validate_relative_posix_path(entry, f"paths.{variable_text}[{index}]")
            for index, entry in enumerate(raw_entries)
        ]

    raw_environment = value.get("environment", {})
    if not isinstance(raw_environment, dict):
        raise UserInputError("environment must be an object")
    environment: Dict[str, str] = {}
    for variable, raw_value in raw_environment.items():
        variable_text = require_text(variable, "environment variable", max_length=128)
        if not SAFE_ENV_RE.fullmatch(variable_text):
            raise UserInputError(f"invalid environment variable: {variable_text!r}")
        if variable_text in paths:
            raise UserInputError(
                f"environment.{variable_text} conflicts with paths.{variable_text}"
            )
        if SENSITIVE_ENV_NAME_RE.search(variable_text):
            raise UserInputError(
                f"environment variable appears to contain secret material: {variable_text!r}"
            )
        if variable_text in FORBIDDEN_SETENV_VARIABLES:
            raise UserInputError(
                f"environment variable is unsafe for a modulefile: {variable_text!r}"
            )
        if UNSAFE_STARTUP_ENV_RE.fullmatch(variable_text):
            raise UserInputError(
                f"environment variable can inject interpreter startup code: {variable_text!r}"
            )
        environment[variable_text] = require_text(
            raw_value,
            f"environment.{variable_text}",
            max_length=4096,
        )

    root_variable = value.get("root_variable")
    if root_variable is None:
        root_variable = re.sub(r"[^A-Za-z0-9_]", "_", name).upper() + "_ROOT"
    root_variable = require_text(root_variable, "root_variable", max_length=128)
    if not SAFE_ENV_RE.fullmatch(root_variable):
        raise UserInputError("root_variable must be a valid environment variable name")
    if root_variable in FORBIDDEN_SETENV_VARIABLES:
        raise UserInputError("root_variable is unsafe for a modulefile")
    if UNSAFE_STARTUP_ENV_RE.fullmatch(root_variable):
        raise UserInputError("root_variable can affect interpreter startup")
    if root_variable in environment or root_variable in paths:
        raise UserInputError("root_variable conflicts with environment or paths")

    metadata = value.get("metadata", {})
    if not isinstance(metadata, dict):
        raise UserInputError("metadata must be an object")
    safe_metadata: Dict[str, str] = {}
    for key in ("backend", "build_id", "source", "sha256"):
        if key in metadata and metadata[key] is not None:
            safe_metadata[key] = require_text(metadata[key], f"metadata.{key}", max_length=4096)
    if "sha256" in safe_metadata and not re.fullmatch(
        r"[0-9a-fA-F]{64}",
        safe_metadata["sha256"],
    ):
        raise UserInputError("metadata.sha256 must be exactly 64 hexadecimal characters")

    return {
        "name": name,
        "version": version,
        "prefix": str(prefix_path),
        "description": description,
        "homepage": homepage,
        "license": license_name,
        "dependencies": list(dict.fromkeys(dependencies)),
        "conflicts": list(dict.fromkeys(conflicts)),
        "paths": paths,
        "environment": environment,
        "root_variable": root_variable,
        "metadata": safe_metadata,
    }


def lua_quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def lua_long_string(value: str) -> str:
    for equals_count in range(0, 8):
        equals = "=" * equals_count
        close = f"]{equals}]"
        if close not in value:
            return f"[{equals}[{value}]{equals}]"
    return lua_quote(value)


def tcl_quote(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("$", "\\$")
        .replace("[", "\\[")
        .replace("]", "\\]")
    )
    return f'"{escaped}"'


def render_lua_module(record: Dict[str, Any]) -> str:
    lines = [
        "-- -*- lua -*-",
        "-- Generated by provision-bioinformatics-software; do not edit in place.",
        f"help({lua_long_string(record['description'])})",
        f"whatis({lua_quote('Name: ' + record['name'])})",
        f"whatis({lua_quote('Version: ' + record['version'])})",
    ]
    if record["homepage"]:
        lines.append(f"whatis({lua_quote('Homepage: ' + record['homepage'])})")
    if record["license"]:
        lines.append(f"whatis({lua_quote('License: ' + record['license'])})")
    for key in ("backend", "build_id", "source", "sha256"):
        if key in record["metadata"]:
            label = key.replace("_", " ").title()
            lines.append(f"whatis({lua_quote(label + ': ' + record['metadata'][key])})")
    lines.extend(
        [
            "",
            f"local root = {lua_quote(record['prefix'])}",
        ]
    )
    for conflict in record["conflicts"]:
        lines.append(f"conflict({lua_quote(conflict)})")
    for dependency in record["dependencies"]:
        lines.append(f"depends_on({lua_quote(dependency)})")
    lines.append(f"setenv({lua_quote(record['root_variable'])}, root)")
    for variable, raw_value in record["environment"].items():
        lines.append(f"setenv({lua_quote(variable)}, {lua_quote(raw_value)})")
    for variable, entries in record["paths"].items():
        for entry in entries:
            lines.append(
                f"prepend_path({lua_quote(variable)}, pathJoin(root, {lua_quote(entry)}))"
            )
    lines.append("")
    return "\n".join(lines)


def render_tcl_module(record: Dict[str, Any]) -> str:
    lines = [
        "#%Module1.0",
        "# Generated by provision-bioinformatics-software; do not edit in place.",
        "proc ModulesHelp { } {",
        f"    puts stderr {tcl_quote(record['description'])}",
        "}",
        f"module-whatis {tcl_quote('Name: ' + record['name'])}",
        f"module-whatis {tcl_quote('Version: ' + record['version'])}",
    ]
    if record["homepage"]:
        lines.append(f"module-whatis {tcl_quote('Homepage: ' + record['homepage'])}")
    if record["license"]:
        lines.append(f"module-whatis {tcl_quote('License: ' + record['license'])}")
    for key in ("backend", "build_id", "source", "sha256"):
        if key in record["metadata"]:
            label = key.replace("_", " ").title()
            lines.append(
                f"module-whatis {tcl_quote(label + ': ' + record['metadata'][key])}"
            )
    lines.extend(["", f"set root {tcl_quote(record['prefix'])}"])
    for conflict in record["conflicts"]:
        lines.append(f"conflict {tcl_quote(conflict)}")
    for dependency in record["dependencies"]:
        lines.append(f"prereq {tcl_quote(dependency)}")
    lines.append(f"setenv {record['root_variable']} $root")
    for variable, raw_value in record["environment"].items():
        lines.append(f"setenv {variable} {tcl_quote(raw_value)}")
    for variable, entries in record["paths"].items():
        for entry in entries:
            lines.append(f"prepend-path {variable} [file join $root {tcl_quote(entry)}]")
    lines.append("")
    return "\n".join(lines)


def atomic_write(path: Path, content: str, *, replace: bool) -> None:
    if not path.is_absolute():
        raise UserInputError(f"output path must be absolute: {path}")
    parent = path.parent
    try:
        resolved_parent = parent.resolve(strict=True)
    except FileNotFoundError as exc:
        raise UserInputError(f"output parent directory does not exist: {parent}") from exc
    if not resolved_parent.is_dir():
        raise UserInputError(f"output parent is not a directory: {resolved_parent}")
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=str(resolved_parent),
        text=True,
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temporary_path, 0o644)
        if replace:
            os.replace(temporary_path, path)
        else:
            try:
                os.link(temporary_path, path)
            except FileExistsError as exc:
                raise UserInputError(f"output already exists: {path}") from exc
            temporary_path.unlink()
    except Exception:
        try:
            temporary_path.unlink()
        except OSError:
            pass
        raise


def emit_json(value: Dict[str, Any], output: Optional[Path], replace: bool) -> None:
    content = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if output is None:
        sys.stdout.write(content)
    else:
        resolved_output = output if output.is_absolute() else output.resolve()
        atomic_write(resolved_output, content, replace=replace)


def command_validate(args: argparse.Namespace) -> int:
    manifest = validate_manifest(load_json(args.manifest))
    result = {
        "schema_version": SCHEMA_VERSION,
        "command": "validate",
        "ok": True,
        "tool_count": len(manifest["tools"]),
        "tools": [tool["name"] for tool in manifest["tools"]],
    }
    emit_json(result, args.output, args.replace_output)
    return EXIT_OK


def command_preflight(args: argparse.Namespace) -> int:
    module_init = validate_module_init(args.module_init)
    result = build_preflight(module_init)
    result["ok"] = bool(result["module_system"]["available"])
    result["changed"] = False
    exit_code = EXIT_OK if result["ok"] else EXIT_MODULE_UNAVAILABLE
    result["exit_code"] = exit_code
    emit_json(result, args.output, args.replace_output)
    return exit_code


def command_audit(args: argparse.Namespace) -> int:
    manifest = validate_manifest(load_json(args.manifest))
    module_init = validate_module_init(args.module_init)
    result, exit_code = build_audit(manifest, module_init)
    emit_json(result, args.output, args.replace_output)
    return exit_code


def command_render_module(args: argparse.Namespace) -> int:
    record = validate_install_record(load_json(args.record))
    if os.name == "posix":
        output_text = str(args.output)
        if output_text.startswith("//"):
            raise UserInputError("modulefile output may not use a double-slash POSIX path")
        normalized_output = posixpath.normpath("/" + output_text.lstrip("/"))
        resolved_output = Path(normalized_output).resolve(strict=False)
        if forbidden_posix_target(normalized_output) or forbidden_posix_target(
            str(resolved_output)
        ):
            raise UserInputError(
                "modulefile output is under a protected system root; "
                "use a site-approved module root"
            )
        try:
            current_home = Path.home().resolve(strict=True)
        except OSError:
            current_home = Path.home().resolve(strict=False)
        if resolved_output == current_home:
            raise UserInputError("modulefile output may not be the home-directory root")
    if args.format == "lua":
        content = render_lua_module(record)
    else:
        content = render_tcl_module(record)
    atomic_write(args.output, content, replace=False)
    result = {
        "schema_version": SCHEMA_VERSION,
        "command": "render-module",
        "ok": True,
        "changed": True,
        "format": args.format,
        "name": record["name"],
        "version": record["version"],
        "output": str(args.output),
    }
    sys.stdout.write(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    return EXIT_OK


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Audit HPC modules and render deterministic bioinformatics modulefiles."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    validate_parser = subparsers.add_parser("validate", help="validate requirements JSON")
    validate_parser.add_argument("--manifest", type=Path, required=True)
    validate_parser.add_argument("--output", type=Path)
    validate_parser.add_argument("--replace-output", action="store_true")
    validate_parser.set_defaults(handler=command_validate)

    preflight_parser = subparsers.add_parser(
        "preflight",
        help="inspect module, scheduler, and deployment backend availability",
    )
    preflight_parser.add_argument("--module-init")
    preflight_parser.add_argument("--output", type=Path)
    preflight_parser.add_argument("--replace-output", action="store_true")
    preflight_parser.set_defaults(handler=command_preflight)

    audit_parser = subparsers.add_parser(
        "audit",
        help="load candidate modules and verify commands and versions",
    )
    audit_parser.add_argument("--manifest", type=Path, required=True)
    audit_parser.add_argument("--module-init")
    audit_parser.add_argument("--output", type=Path)
    audit_parser.add_argument("--replace-output", action="store_true")
    audit_parser.set_defaults(handler=command_audit)

    render_parser = subparsers.add_parser(
        "render-module",
        help="render a Lua or Tcl modulefile from an install record",
    )
    render_parser.add_argument("--record", type=Path, required=True)
    render_parser.add_argument("--format", choices=("lua", "tcl"), default="lua")
    render_parser.add_argument("--output", type=Path, required=True)
    render_parser.set_defaults(handler=command_render_module)
    return parser


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return int(args.handler(args))
    except UserInputError as exc:
        sys.stderr.write(f"input error: {exc}\n")
        return EXIT_MANIFEST
    except ModuleSystemError as exc:
        sys.stderr.write(f"module system error: {exc}\n")
        return EXIT_MODULE_UNAVAILABLE
    except KeyboardInterrupt:
        sys.stderr.write("interrupted\n")
        return 130
    except Exception as exc:
        sys.stderr.write(f"internal error: {exc.__class__.__name__}: {exc}\n")
        return EXIT_INTERNAL


if __name__ == "__main__":
    raise SystemExit(main())
