import { execFile } from "node:child_process";
import { homedir, release, tmpdir } from "node:os";
import { dirname, extname, isAbsolute, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
//#region lib/types/runner.js
/**
* Shared no-shell `execFile` runner for host-native OS integrations.
* @module @deepseek-ai/dsh-native-command/runner
*/
/**
* Run a host command with utf8 stdio, abort propagation, and explicit GUI visibility.
* @param command - executable path or PATH name.
* @param args - argv (never a shell string).
* @param signal - caller/connection lifetime; abort terminates the child.
* @param window - Windows startup visibility: `hidden` for background commands,
* `visible` for GUI launchers. Ignored on other platforms.
* @returns captured stdout/stderr on exit 0.
*/
const runNativeCommand = (command, args, signal, window) => new Promise((resolve, reject) => {
	execFile(command, [...args], {
		encoding: "utf8",
		signal,
		windowsHide: window === "hidden"
	}, (error, stdout, stderr) => {
		if (error !== null) {
			reject(Object.assign(new Error(error.message, { cause: error }), {
				code: error.code,
				stdout,
				stderr
			}));
			return;
		}
		resolve({
			stdout,
			stderr
		});
	});
});
//#endregion
//#region lib/types/path-opener.js
/**
* Cross-platform native path and text-document openers for Host UI
* integrations.
*
* The default intent prefers the default browser for documents it renders when
* the platform can name one, then falls back to the default application. WSL
* translates every path for the Windows desktop instead of assuming a Linux
* GUI. The text-editor intent never consults the browser. Windows hands every
* intent to Explorer: the shell's own default-application resolution, the one
* a double-click uses, selects the application, while a process that resolves
* the association itself reads a narrower record and reports none.
* @module @deepseek-ai/dsh-native-command/path-opener
*/
/** Documents a browser renders, as opposed to ones an editor merely edits. */
const BROWSER_DOCUMENTS = new Set([
	".html",
	".htm",
	".xhtml",
	".svg"
]);
/**
* The macOS bundle registered for `https` — the default browser, as
* LaunchServices records it. The nested version dict is stripped first
* because it carries its own `LSHandlerRoleAll`.
*/
function macBundleForHttps(plist) {
	const stripped = plist.replace(/LSHandlerPreferredVersions\s*=\s*\{[^}]*\};/g, "");
	const block = /\{[^{}]*LSHandlerURLScheme\s*=\s*"?https"?;[^{}]*\}/.exec(stripped)?.[0];
	if (block === void 0) return void 0;
	return /LSHandlerRoleAll\s*=\s*"?([\w.-]+)"?;/.exec(block)?.[1];
}
/**
* Open one browser-renderable document with the default browser.
* @returns true when a browser took it; false when this platform cannot name
* one, or naming it failed — the caller then uses the default application.
*/
async function openInBrowser(path, signal, platform, run, env) {
	if (platform === "darwin") {
		let bundle;
		try {
			const { stdout } = await run("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure"], signal, "hidden");
			bundle = macBundleForHttps(stdout);
		} catch {
			return false;
		}
		if (bundle === void 0) return false;
		await run("open", [
			"-b",
			bundle,
			path
		], signal, "hidden");
		return true;
	}
	if (platform === "linux") {
		const browser = env.BROWSER;
		if (browser === void 0 || browser === "") return false;
		await run(browser, [path], signal, "hidden");
		return true;
	}
	return false;
}
/** Whether one environment marker is set to a non-empty value. */
function present(value) {
	return value !== void 0 && value !== "";
}
/** Distinguish WSL from desktop Linux using its process and kernel markers. */
function isWsl(internals) {
	const env = internals.env ?? process.env;
	if (present(env.WSL_DISTRO_NAME) || present(env.WSL_INTEROP)) return true;
	return (internals.osRelease ?? release()).toLowerCase().includes("microsoft");
}
/**
* Encode one Windows path as the target Explorer can receive intact.
*
* Explorer parses its own command line and splits fields at commas and equals
* signs, so a raw path loses everything after the first separator and the shell
* opens a different target without reporting it; both separators are escaped.
* Nothing else is: Explorer rejects percent-encoded non-ASCII in a file URI and
* opens the user's Documents folder instead, while it resolves the literal
* characters, so Node's non-ASCII escapes are decoded back and its ASCII escapes
* stand. Node resolves the path before encoding it, so a verbatim `\\?\` or
* `\\?\UNC\` prefix reaches Explorer as the ordinary drive or UNC URI; a `\\.\`
* device path keeps that same UNC handling and names a device rather than a
* shell item, which this opener does not open.
* @param windowsPath - path already translated for the Windows desktop.
* @returns the target for an open, or the object of a `/select,` reveal.
*/
function explorerTarget(windowsPath) {
	return pathToFileURL(windowsPath, { windows: true }).href.replace(/(?:%[89A-F][0-9A-F])+/gi, (escaped) => decodeURIComponent(escaped)).replaceAll(",", "%2C").replaceAll("=", "%3D");
}
/**
* Hand one target to Explorer, accepting its delegated-handoff exit code.
*
* Explorer exits 1 after handing the request to the desktop process already
* running, so exit 1 means the shell took it. Every other failure still
* rejects, and cancellation wins over a delegate's exit 1.
* @param args - Explorer argv: the encoded target alone to open it, or `/select,<encoded target>` to reveal it.
* @param signal - caller lifetime; abort terminates the command.
* @param run - shell-free command runner.
* @throws The runner's failure unless it is Explorer's delegate exit 1.
*/
async function runExplorer(args, signal, run) {
	try {
		await run("explorer.exe", args, signal, "visible");
	} catch (error) {
		signal.throwIfAborted();
		if (!(error instanceof Error) || !("code" in error) || error.code !== 1) throw error;
	}
}
/**
* Open one Windows-resolvable path through Explorer, the shell that owns the
* default-application resolution a double-click uses.
* @param path - Windows-resolvable path; Explorer receives its encoded file URI as one argv element, never a command string.
* @param signal - caller lifetime; abort terminates the command.
* @param run - shell-free command runner.
*/
async function openWindowsPath(path, signal, run) {
	await runExplorer([explorerTarget(path)], signal, run);
}
/** Translate a WSL path before handing it to the Windows desktop. */
async function openWslPath(path, signal, run) {
	const translated = await run("wslpath", ["-w", path], signal, "hidden");
	signal.throwIfAborted();
	const windowsPath = translated.stdout.replace(/[\r\n]+$/, "");
	if (windowsPath === "") throw new Error("wslpath returned no Windows path");
	await openWindowsPath(windowsPath, signal, run);
}
/** Dispatch one shell-free platform command for the requested open intent. */
async function openNativePathWithIntent(path, signal, intent, internals = {}) {
	const platform = internals.platform ?? process.platform;
	const run = internals.run ?? runNativeCommand;
	const env = internals.env ?? process.env;
	const wsl = platform === "linux" && isWsl(internals);
	if (!wsl && intent === "default" && BROWSER_DOCUMENTS.has(extname(path).toLowerCase()) && await openInBrowser(path, signal, platform, run, env)) return;
	if (platform === "darwin") {
		await run("open", intent === "text-editor" ? ["-t", path] : [path], signal, "hidden");
		return;
	}
	if (platform === "win32") {
		await openWindowsPath(path, signal, run);
		return;
	}
	if (platform === "linux") {
		if (wsl) {
			await openWslPath(path, signal, run);
			return;
		}
		await run("xdg-open", [path], signal, "hidden");
		return;
	}
	throw new Error(`native path opener is unsupported on ${platform}`);
}
/**
* Whether {@link openNativePath} plausibly reaches a desktop on this host.
*
* macOS and Windows always carry a desktop opener; Linux does when it is WSL
* (the Windows desktop takes the path) or a display server is announced.
* A headless or containerised Linux host answers false, which is what lets a
* surface show a path as text instead of offering a button that would spawn
* `xdg-open` into nothing.
* @param internals - platform and environment seam for deterministic tests.
* @returns true when handing a path to the native opener can work at all.
*/
function canOpenNativePath(internals = {}) {
	const platform = internals.platform ?? process.platform;
	if (platform === "darwin" || platform === "win32") return true;
	if (platform !== "linux") return false;
	const env = internals.env ?? process.env;
	return isWsl(internals) || present(env.DISPLAY) || present(env.WAYLAND_DISPLAY);
}
/**
* Open a filesystem path with the operating system's default application, or
* with the default browser when the path names a document a browser renders.
* @param path - absolute or host-resolvable path (caller owns resolution).
* @param signal - caller/connection lifetime; abort terminates the native command.
* @param internals - Platform, environment, and runner hooks for deterministic tests.
*/
function openNativePath(path, signal, internals = {}) {
	return openNativePathWithIntent(path, signal, "default", internals);
}
/**
* Open a filesystem path through its file-type association, including HTML and SVG.
* @param path - absolute or host-resolvable path; the caller verifies local access.
* @param signal - caller lifetime; abort terminates the native command.
* @param internals - platform, environment, and runner facts for adapter tests.
* @returns after the associated application accepts the path.
*/
function openNativeAssociatedPath(path, signal, internals = {}) {
	return openNativePathWithIntent(path, signal, "association", internals);
}
/**
* Open a text document for editing; macOS bypasses the file-type association
* so a YAML association with a browser cannot consume the gesture.
* @param path - absolute or host-resolvable text-document path.
* @param signal - caller/connection lifetime; abort terminates the native command.
* @param internals - Platform and runner hooks for deterministic tests.
*/
function openNativeTextFile(path, signal, internals = {}) {
	return openNativePathWithIntent(path, signal, "text-editor", internals);
}
/**
* Identify the native file-manager action without inspecting the browser's platform.
* @param internals - platform and WSL facts.
* @returns the supported file-manager action, or null on unsupported platforms.
*/
function nativeFileManager(internals = {}) {
	const platform = internals.platform ?? process.platform;
	if (platform === "darwin") return "finder";
	if (platform === "win32" || platform === "linux" && isWsl(internals)) return "explorer";
	return platform === "linux" ? "directory" : null;
}
/**
* Reveal a file in Finder or Explorer, or open its parent in the Linux default file manager.
* @param path - absolute file path already authorized by the caller.
* @param signal - caller lifetime; abort terminates the native command.
* @param internals - platform, environment, and command runner for adapter tests.
* @returns after command completion; Explorer exit 1 is accepted as a delegated handoff, not proof of selection.
*/
async function revealNativePath(path, signal, internals = {}) {
	signal.throwIfAborted();
	const platform = internals.platform ?? process.platform;
	const run = internals.run ?? runNativeCommand;
	const manager = nativeFileManager({
		...internals,
		platform
	});
	if (manager === "finder") {
		await run("open", ["-R", path], signal, "hidden");
		return;
	}
	if (manager === "explorer") {
		let windowsPath = path;
		if (platform === "linux") {
			const translated = await run("wslpath", ["-w", path], signal, "hidden");
			signal.throwIfAborted();
			windowsPath = translated.stdout.replace(/[\r\n]+$/, "");
			if (windowsPath === "") throw new Error("wslpath returned no Windows path");
		}
		await runExplorer(["/select,", explorerTarget(windowsPath)], signal, run);
		return;
	}
	if (manager === "directory") {
		await run("xdg-open", [dirname(path)], signal, "hidden");
		return;
	}
	throw new Error(`native file manager is unsupported on ${platform}`);
}
//#endregion
//#region lib/types/desktop-entry.js
/** Shared XDG desktop-entry fields and icon lookup for directory and file application catalogs. */
/**
* Read the main desktop-entry section without interpreting executable commands.
* @param text - installed desktop-entry text.
* @returns its literal field values; action sections are excluded.
*/
function desktopEntryFields(text) {
	let main = false;
	const fields = /* @__PURE__ */ new Map();
	for (const line of text.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (trimmed.startsWith("[")) {
			main = trimmed === "[Desktop Entry]";
			continue;
		}
		if (!main || trimmed.startsWith("#")) continue;
		const separator = trimmed.indexOf("=");
		if (separator > 0) fields.set(trimmed.slice(0, separator).trim(), trimmed.slice(separator + 1).trim());
	}
	return Object.fromEntries(fields);
}
/**
* Resolve XDG application and icon roots in desktop precedence order.
* @param home - user's home directory.
* @param env - desktop environment values.
* @returns data-home followed by system data directories.
*/
function desktopDataDirectories(home, env) {
	return [env.XDG_DATA_HOME ?? join(home, ".local", "share"), ...(env.XDG_DATA_DIRS ?? "/usr/local/share:/usr/share").split(":").filter(Boolean)];
}
/** Read an installed PNG or SVG icon; absent paths and directories have no pixels. */
async function readIcon(path) {
	const contentType = path.endsWith(".png") ? "image/png" : path.endsWith(".svg") ? "image/svg+xml" : null;
	if (contentType === null) return null;
	try {
		if (!(await stat(path)).isFile()) return null;
		return {
			bytes: await readFile(path),
			contentType
		};
	} catch (_error) {
		return null;
	}
}
/**
* Resolve an absolute icon path or an installed hicolor/pixmaps icon name.
* @param name - desktop-entry Icon field.
* @param directories - XDG data roots in precedence order.
* @returns image bytes and media type, or null when artwork is unavailable.
*/
async function desktopApplicationIcon(name, directories) {
	if (isAbsolute(name)) return readIcon(name);
	for (const directory of directories) {
		for (const size of [
			"512x512",
			"256x256",
			"128x128",
			"64x64",
			"48x48",
			"32x32"
		]) for (const extension of ["png", "svg"]) {
			const icon = await readIcon(join(directory, "icons", "hicolor", size, "apps", `${name}.${extension}`));
			if (icon !== null) return icon;
		}
		const scalable = await readIcon(join(directory, "icons", "hicolor", "scalable", "apps", `${name}.svg`));
		if (scalable !== null) return scalable;
		for (const extension of ["png", "svg"]) {
			const icon = await readIcon(join(directory, "pixmaps", `${name}.${extension}`));
			if (icon !== null) return icon;
		}
	}
	return null;
}
//#endregion
//#region lib/types/file-applications-linux.js
/** Linux file associations from GIO, with shared XDG metadata and artwork lookup. */
/** Find a desktop id, including ids derived from nested application directories. */
async function desktopFile(root, id, directory = root) {
	let entries;
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (_error) {
		return null;
	}
	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (!entry.isDirectory() && relative(root, path).split(sep).join("-") === id) return path;
	}
	for (const entry of entries) if (entry.isDirectory()) {
		const found = await desktopFile(root, id, join(directory, entry.name));
		if (found !== null) return found;
	}
	return null;
}
/**
* Query all registered file handlers from GIO without executing desktop-entry command text.
* @param path - verified local file path.
* @param signal - caller cancellation.
* @param run - native command runner.
* @param env - XDG and locale settings.
* @returns registered applications with the desktop's default marked.
*/
async function linuxFileApplications(path, signal, run, env) {
	const info = await run("gio", [
		"info",
		"-a",
		"standard::content-type",
		path
	], signal, "hidden");
	const mime = /standard::content-type:\s*(\S+)/.exec(info.stdout)?.[1];
	if (mime === void 0) throw new Error("GIO did not identify the file content type");
	const result = await run("env", [
		"LC_ALL=C",
		"gio",
		"mime",
		mime
	], signal, "hidden");
	const preferred = /^Default application.*:\s*(.+\.desktop)\s*$/m.exec(result.stdout)?.[1];
	const ids = [...new Set([...preferred === void 0 ? [] : [preferred], ...result.stdout.split(/\r?\n/).filter((line) => /^\s+.*\.desktop\s*$/.test(line)).map((line) => line.trim())])];
	const directories = desktopDataDirectories(env.HOME ?? homedir(), env);
	const locale = (env.LC_ALL ?? env.LC_MESSAGES ?? env.LANG ?? "").replace(/\..*$/, "");
	const applications = [];
	for (const id of ids) {
		signal.throwIfAborted();
		let entryPath = null;
		for (const directory of directories) {
			entryPath = await desktopFile(join(directory, "applications"), id);
			if (entryPath !== null) break;
		}
		if (entryPath === null) continue;
		const fields = desktopEntryFields(await readFile(entryPath, "utf8"));
		const name = fields[`Name[${locale}]`] ?? fields[`Name[${locale.replace(/_.*/, "")}]`] ?? fields.Name;
		if (name === void 0 || fields.Hidden === "true") continue;
		const icon = fields.Icon === void 0 ? null : await desktopApplicationIcon(fields.Icon, directories);
		applications.push({
			id: entryPath,
			name,
			default: id === preferred,
			icon: icon === null ? null : `data:${icon.contentType};base64,${icon.bytes.toString("base64")}`
		});
	}
	return applications;
}
//#endregion
//#region lib/types/file-applications-windows.js
/** Windows Shell association queries and invocation; paths are encoded data, never PowerShell expressions. */
/** Shell interfaces are declared in their native vtable order; Invoke preserves packaged-app and DDE handling. */
const WINDOWS_ASSOCIATIONS = String.raw`
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using System.Text;

public static class DshFileAssociations {
  [ComImport, Guid("973810ae-9599-4b88-9e4d-6ee98c9552da"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IEnumHandlers {
    [PreserveSig] int Next(uint count, out IHandler handler, out uint fetched);
  }
  [ComImport, Guid("f04061ac-1659-4a3f-a954-775aa57fc083"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IHandler {
    void GetName([MarshalAs(UnmanagedType.LPWStr)] out string name);
    void GetUIName([MarshalAs(UnmanagedType.LPWStr)] out string name);
    void GetIconLocation([MarshalAs(UnmanagedType.LPWStr)] out string path, out int index);
    [PreserveSig] int IsRecommended();
    void MakeDefault([MarshalAs(UnmanagedType.LPWStr)] string description);
    void Invoke(IDataObject data);
    void CreateInvoker(IDataObject data, [MarshalAs(UnmanagedType.Interface)] out object invoker);
  }
  [ComImport, Guid("43826d1e-e718-42ee-bc55-a1e261c37bfe"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IShellItem {
    void BindToHandler(IntPtr context, ref Guid handler, ref Guid iid, [MarshalAs(UnmanagedType.Interface)] out IDataObject data);
  }
  [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
  static extern void SHAssocEnumHandlers(string extension, uint filter, out IEnumHandlers handlers);
  [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
  static extern void SHCreateItemFromParsingName(string path, IntPtr context, ref Guid iid, out IShellItem item);
  [DllImport("shlwapi.dll", CharSet = CharSet.Unicode)]
  static extern int AssocQueryString(uint flags, uint kind, string association, string extra, StringBuilder output, ref uint size);
  [DllImport("shell32.dll", CharSet = CharSet.Unicode)]
  static extern int SHDefExtractIcon(string path, int index, uint flags, out IntPtr large, out IntPtr small, uint size);
  [DllImport("user32.dll")]
  static extern bool DestroyIcon(IntPtr icon);
  [DllImport("shlwapi.dll", CharSet = CharSet.Unicode)]
  static extern int SHLoadIndirectString(string source, StringBuilder output, uint size, IntPtr reserved);

  [DllImport("shlwapi.dll", PreserveSig = false)]
  static extern void SHCreateThreadRef(IntPtr count, out IntPtr reference);
  [DllImport("shlwapi.dll", PreserveSig = false)]
  static extern void SHSetThreadRef(IntPtr reference);
  [DllImport("shell32.dll")]
  static extern void SHSetInstanceExplorer(IntPtr reference);
  [StructLayout(LayoutKind.Sequential)]
  struct Message {
    public IntPtr window;
    public uint message;
    public UIntPtr wParam;
    public IntPtr lParam;
    public uint time;
    public int x, y;
    public uint reserved;
  }
  [DllImport("user32.dll", SetLastError = true)]
  static extern UIntPtr SetTimer(IntPtr window, UIntPtr id, uint milliseconds, IntPtr callback);
  [DllImport("user32.dll")]
  static extern bool KillTimer(IntPtr window, UIntPtr id);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)]
  static extern int GetMessage(out Message message, IntPtr window, uint min, uint max);
  [DllImport("user32.dll")]
  static extern bool TranslateMessage(ref Message message);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)]
  static extern IntPtr DispatchMessage(ref Message message);

  // Shell handlers may return before their asynchronous launch work releases the host.
  // The shared Shell reference, rather than an arbitrary delay, owns that lifetime.
  static void WithShellLifetime(Action action) {
    IntPtr count = Marshal.AllocHGlobal(sizeof(int));
    IntPtr reference = IntPtr.Zero;
    try {
      Marshal.WriteInt32(count, 0);
      SHCreateThreadRef(count, out reference);
      SHSetThreadRef(reference);
      SHSetInstanceExplorer(reference);
      int owned = Marshal.ReadInt32(count);
      try { action(); }
      finally {
        if (Marshal.ReadInt32(count) > owned) {
          // USER_TIMER_MINIMUM wakes the STA to inspect the reference count while dispatching COM work.
          UIntPtr timer = SetTimer(IntPtr.Zero, UIntPtr.Zero, 10, IntPtr.Zero);
          if (timer == UIntPtr.Zero) throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
          try {
            while (Marshal.ReadInt32(count) > owned) {
              Message message;
              if (GetMessage(out message, IntPtr.Zero, 0, 0) <= 0) throw new InvalidOperationException("Shell handoff message loop ended");
              TranslateMessage(ref message);
              DispatchMessage(ref message);
            }
          } finally { KillTimer(IntPtr.Zero, timer); }
        }
      }
    } finally {
      SHSetInstanceExplorer(IntPtr.Zero);
      SHSetThreadRef(IntPtr.Zero);
      int remaining = reference == IntPtr.Zero ? 0 : Marshal.Release(reference);
      // An interrupted drain leaves its counter owned by the terminating helper process.
      if (remaining == 0) Marshal.FreeHGlobal(count);
    }
  }

  public sealed class Application {
    public string id;
    public string name;
    public string icon;
    public bool @default;
  }
  static string Associated(string extension, uint kind) {
    uint size = 0;
    AssocQueryString(0, kind, extension, null, null, ref size);
    if (size == 0) return null;
    var text = new StringBuilder((int)size);
    return AssocQueryString(0, kind, extension, null, text, ref size) == 0 ? text.ToString() : null;
  }
  // Resolve a packaged application's indirect icon reference, for example
  // @{Microsoft.WindowsNotepad_...?ms-resource://.../NotepadAppList.png}, to
  // the resource file the Shell would draw; an unresolved reference is null.
  static string ResolveIndirectIcon(string source) {
    var output = new StringBuilder(1024);
    return SHLoadIndirectString(source, output, (uint)output.Capacity, IntPtr.Zero) == 0 ? output.ToString() : null;
  }
  // Read one icon source into a 32px PNG: an image file directly, otherwise the
  // resource the Shell extracts at the given index. A missing resource is null.
  static string PngFromIconSource(string source, int index) {
    IntPtr large = IntPtr.Zero, small = IntPtr.Zero;
    try {
      if (Path.GetExtension(source).Equals(".png", StringComparison.OrdinalIgnoreCase)) {
        using (var original = Image.FromFile(source))
        using (var resized = new Bitmap(original, new Size(32, 32)))
        using (var stream = new MemoryStream()) {
          resized.Save(stream, ImageFormat.Png);
          return "data:image/png;base64," + Convert.ToBase64String(stream.ToArray());
        }
      }
      if (SHDefExtractIcon(source, index, 0, out large, out small, 32) != 0 || large == IntPtr.Zero) return null;
      using (var image = Icon.FromHandle(large))
      using (var bitmap = image.ToBitmap())
      using (var stream = new MemoryStream()) {
        bitmap.Save(stream, ImageFormat.Png);
        return "data:image/png;base64," + Convert.ToBase64String(stream.ToArray());
      }
    } catch (Exception) {
      // Missing icon resources do not make the application unusable.
      return null;
    } finally {
      if (large != IntPtr.Zero) DestroyIcon(large);
      if (small != IntPtr.Zero) DestroyIcon(small);
    }
  }
  // Best-effort fallback: some handlers return their executable path from GetName, but a
  // packaged handler's name may be an AUMID or family name, which extracts no icon.
  static string IconData(IHandler handler, string id) {
    string source = null; int index = 0;
    try { handler.GetIconLocation(out source, out index); } catch (Exception) {
      // A handler without a drawable icon location falls back to its name.
    }
    if (!String.IsNullOrEmpty(source)) {
      source = Environment.ExpandEnvironmentVariables(source);
      if (source.StartsWith("@{", StringComparison.Ordinal) && source.EndsWith("}", StringComparison.Ordinal)) {
        var resolved = ResolveIndirectIcon(source);
        if (!String.IsNullOrEmpty(resolved)) source = resolved;
      }
      var icon = PngFromIconSource(source, index);
      if (icon != null) return icon;
    }
    return String.IsNullOrEmpty(id) || String.Equals(id, source, StringComparison.OrdinalIgnoreCase)
      ? null
      : PngFromIconSource(id, 0);
  }
  static void Visit(string path, Action<IHandler> visit) {
    var extension = Path.GetExtension(path);
    if (extension.Length == 0) return;
    IEnumHandlers handlers;
    SHAssocEnumHandlers(extension, 0, out handlers);
    try {
      while (true) {
        IHandler handler; uint fetched;
        int result = handlers.Next(1, out handler, out fetched);
        Marshal.ThrowExceptionForHR(result);
        if (result != 0 || fetched == 0) break;
        try { visit(handler); } finally { Marshal.FinalReleaseComObject(handler); }
      }
    } finally { Marshal.FinalReleaseComObject(handlers); }
  }
  public static Application[] List(string path) {
    var extension = Path.GetExtension(path);
    var executable = extension.Length == 0 ? null : Associated(extension, 2);
    var appId = extension.Length == 0 ? null : Associated(extension, 21);
    var apps = new List<Application>();
    var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    Visit(path, delegate(IHandler handler) {
      string id, name;
      handler.GetName(out id); handler.GetUIName(out name);
      if (!seen.Add(id)) return;
      apps.Add(new Application { id = id, name = name, icon = IconData(handler, id),
        @default = String.Equals(id, executable, StringComparison.OrdinalIgnoreCase) || String.Equals(id, appId, StringComparison.OrdinalIgnoreCase) });
    });
    return apps.ToArray();
  }
  public static void Open(string path, string application) {
    WithShellLifetime(delegate { OpenRegistered(path, application); });
  }
  static void OpenRegistered(string path, string application) {
    bool opened = false;
    Visit(path, delegate(IHandler handler) {
      string id; handler.GetName(out id);
      if (opened || !String.Equals(id, application, StringComparison.OrdinalIgnoreCase)) return;
      var iid = typeof(IShellItem).GUID;
      IShellItem item;
      SHCreateItemFromParsingName(path, IntPtr.Zero, ref iid, out item);
      IDataObject data = null;
      try {
        var bhid = new Guid("b8c0bd9f-ed24-455c-83e6-d5390c4fe8c4");
        var dataIid = typeof(IDataObject).GUID;
        item.BindToHandler(IntPtr.Zero, ref bhid, ref dataIid, out data);
        handler.Invoke(data);
        opened = true;
      } finally {
        if (data != null) Marshal.FinalReleaseComObject(data);
        Marshal.FinalReleaseComObject(item);
      }
    });
    if (!opened) throw new InvalidOperationException("Application is not registered for this file");
  }
}`;
/**
* Execute the Windows Shell adapter in a Unicode STA PowerShell process; the adapter
* source is a private temporary script file, removed once the call settles.
* @param path - Windows file path, translated by the caller for WSL.
* @param application - registered handler to invoke; null requests the application list.
* @param signal - caller cancellation.
* @param run - native command runner.
* @returns adapter output; query mode emits a JSON array.
*/
async function windowsFileApplications(path, application, signal, run) {
	const script = `$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Add-Type -ReferencedAssemblies System,System.Core,System.Drawing -TypeDefinition @'
${WINDOWS_ASSOCIATIONS}
'@
$path = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(path).toString("base64")}'))
$application = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(application ?? "").toString("base64")}'))
${application === null ? "ConvertTo-Json -InputObject @([DshFileAssociations]::List($path)) -Depth 4 -Compress" : "[DshFileAssociations]::Open($path, $application)"}
`;
	const directory = await mkdtemp(join(tmpdir(), "dsh-native-command-"));
	const scriptPath = join(directory, "associations.ps1");
	try {
		await writeFile(scriptPath, `\uFEFF${script}`, "utf8");
		return (await run("powershell.exe", [
			"-NoProfile",
			"-NonInteractive",
			"-STA",
			"-ExecutionPolicy",
			"Bypass",
			"-File",
			scriptPath
		], signal, "hidden")).stdout;
	} finally {
		await rm(directory, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
//#region lib/types/types.js
/** Browser-safe metadata for native file associations. */
/**
* Validate file association metadata received from a native process or authenticated Host.
* @param value - decoded application list.
* @returns validated application metadata.
* @throws Error for malformed entries or unsupported icon URLs.
*/
function parseNativeFileApplications(value) {
	if (!Array.isArray(value)) throw new Error("Invalid native application list");
	const applications = [];
	const entries = value;
	for (const entry of entries) {
		if (typeof entry !== "object" || entry === null || !("id" in entry) || !("name" in entry) || !("default" in entry) || !("icon" in entry) || typeof entry.id !== "string" || entry.id.length === 0 || typeof entry.name !== "string" || typeof entry.default !== "boolean" || !(entry.icon === null || typeof entry.icon === "string" && /^data:image\/(?:png|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(entry.icon))) throw new Error("Invalid native application entry");
		applications.push({
			id: entry.id,
			name: entry.name,
			default: entry.default,
			icon: entry.icon
		});
	}
	return applications;
}
//#endregion
//#region lib/types/file-applications.js
/** Native file associations queried from the desktop that owns the path. */
/** AppKit runs inside the system JXA host; paths arrive as argv, never executable source. */
const MAC_APPLICATIONS = `
ObjC.import('AppKit');
function run(argv) {
  var workspace = $.NSWorkspace.sharedWorkspace;
  var file = $.NSURL.fileURLWithPath(argv[0]);
  var preferred = workspace.URLForApplicationToOpenURL(file);
  var preferredPath = preferred.isNil() ? null : ObjC.unwrap(preferred.path);
  var urls = workspace.URLsForApplicationsToOpenURL(file);
  var apps = [];
  for (var i = 0; i < urls.count; i++) {
    var url = urls.objectAtIndex(i);
    var path = ObjC.unwrap(url.path);
    var image = null;
    if (argv[1] === 'icons') {
      var icon = workspace.iconForFile(path);
      var thumbnail = $.NSImage.alloc.initWithSize($.NSMakeSize(32, 32));
      thumbnail.lockFocus;
      icon.drawInRectFromRectOperationFraction($.NSMakeRect(0, 0, 32, 32), $.NSZeroRect, $.NSCompositingOperationSourceOver, 1);
      thumbnail.unlockFocus;
      var bitmap = $.NSBitmapImageRep.imageRepWithData(thumbnail.TIFFRepresentation);
      var png = bitmap.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $({}));
      image = png.isNil() ? null : 'data:image/png;base64,' + ObjC.unwrap(png.base64EncodedStringWithOptions(0));
    }
    var bundle = $.NSBundle.bundleWithURL(url);
    var bundleId = bundle.isNil() || bundle.bundleIdentifier.isNil() ? null : ObjC.unwrap(bundle.bundleIdentifier);
    var version = bundle.isNil() ? null : bundle.objectForInfoDictionaryKey('CFBundleShortVersionString');
    apps.push({
      id: path,
      name: ObjC.unwrap($.NSFileManager.defaultManager.displayNameAtPath(path)),
      default: path === preferredPath,
      icon: image,
      bundle: bundleId,
      version: version === null || version.isNil() ? null : String(ObjC.unwrap(version))
    });
  }
  return JSON.stringify(apps);
}`;
/**
* List registered handlers in OS preference order, including the current default and application icons.
* @param path - verified absolute local file path.
* @param signal - caller lifetime, propagated to the OS query.
* @param internals - platform and command adapter for deterministic tests.
* @returns current file handlers; on macOS, copies sharing a bundle identifier and display name collapse
* to one entry; an empty list when the platform has no association query.
*/
async function nativeFileApplications(path, signal, internals = {}) {
	return queryFileApplications(path, signal, internals, true);
}
/**
* Query handler metadata; display queries render macOS icons and collapse duplicate copies,
* launch validation keeps every registered copy.
*/
async function queryFileApplications(path, signal, internals, display) {
	signal.throwIfAborted();
	const target = await desktopTarget(path, signal, internals);
	const run = internals.run ?? runNativeCommand;
	if (target.platform === "linux") return linuxFileApplications(path, signal, run, internals.env ?? process.env);
	if (target.platform === "darwin") {
		const { stdout } = await run("osascript", [
			"-l",
			"JavaScript",
			"-e",
			MAC_APPLICATIONS,
			target.path,
			display ? "icons" : "handlers"
		], signal, "hidden");
		const applications = parseMacApplications(JSON.parse(stdout));
		return display ? dedupeMacApplications(applications) : applications;
	}
	if (target.platform !== "win32") return [];
	const stdout = await windowsFileApplications(target.path, null, signal, run);
	return parseNativeFileApplications(JSON.parse(stdout));
}
/**
* Validate every entry of the decoded macOS query output, base fields and grouping metadata alike.
* @param value - decoded application list from the macOS query.
* @returns validated handlers in OS preference order.
* @throws Error when any entry is malformed, matching the other platform parsers.
*/
function parseMacApplications(value) {
	if (!Array.isArray(value)) throw new Error("Invalid native application list");
	return value.map((entry) => {
		if (typeof entry !== "object" || entry === null) throw new Error("Invalid native application entry");
		const bundle = macField("bundle" in entry ? entry.bundle : null);
		const version = macField("version" in entry ? entry.version : null);
		const [base] = parseNativeFileApplications([entry]);
		return {
			...base,
			bundle,
			version
		};
	});
}
/** Validate one optional string field value of a macOS entry; missing fields, null, and empty strings read as null. */
function macField(field) {
	if (field === null) return null;
	if (typeof field !== "string") throw new Error("Invalid native application entry");
	return field.length === 0 ? null : field;
}
/**
* Collapse duplicate registrations of the same application for display. Self-updating
* apps leave extra copies on disk (an update staged under Application Support,
* per-version installs) and LaunchServices registers every one, so the raw handler
* list repeats the app. Finder shows one entry per app and splits only deliberate
* side-by-side installs, which carry distinct display names; matching that, copies
* sharing a bundle identifier and display name collapse to the system default, else
* the highest version, at the group's first position. Launch validation bypasses
* this collapse, so every registered copy stays openable.
* @param applications - validated handlers in OS preference order.
* @returns application metadata with one entry per application and no grouping metadata.
*/
function dedupeMacApplications(applications) {
	const order = [];
	const groups = /* @__PURE__ */ new Map();
	for (const app of applications) {
		if (app.bundle === null) {
			order.push(app);
			continue;
		}
		const key = `${app.bundle}\u0000${app.name}`;
		const index = groups.get(key);
		if (index === void 0) {
			groups.set(key, order.length);
			order.push(app);
			continue;
		}
		const held = order[index];
		if (held.default) continue;
		if (app.default || compareVersions(app.version, held.version) > 0) order[index] = app;
	}
	return order.map(({ id, name, default: preferred, icon }) => ({
		id,
		name,
		default: preferred,
		icon
	}));
}
/** Order two dotted version strings numerically; non-numeric segments count as 0, and a missing version sorts lowest. */
function compareVersions(left, right) {
	if (left === null || right === null) return left === right ? 0 : left === null ? -1 : 1;
	const a = left.split(".");
	const b = right.split(".");
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const difference = (Number(a[i]) || 0) - (Number(b[i]) || 0);
		if (difference !== 0) return difference;
	}
	return 0;
}
/**
* Open a file in a currently registered handler; stale or arbitrary application identifiers are rejected.
* Validation checks the complete registered list, so macOS copies collapsed out of the display list stay openable.
* @param path - verified absolute local file path.
* @param application - identifier returned by the file association query.
* @param signal - caller lifetime, propagated to query and launch.
* @param internals - platform and command adapter for deterministic tests.
* @returns after the system launcher accepts the file.
*/
async function openNativeFileApplication(path, application, signal, internals = {}) {
	const target = await desktopTarget(path, signal, internals);
	const run = internals.run ?? runNativeCommand;
	if (target.platform === "win32") {
		await windowsFileApplications(target.path, application, signal, run);
		return;
	}
	if (!(await queryFileApplications(path, signal, internals, false)).some((app) => app.id === application)) throw new Error("Application is not registered for this file");
	if (target.platform === "linux") await run("gio", [
		"launch",
		application,
		path
	], signal, "hidden");
	else await run("open", [
		"-a",
		application,
		path
	], signal, "hidden");
}
/** Resolve the desktop that owns the file, including Windows applications reached from WSL. */
async function desktopTarget(path, signal, internals) {
	signal.throwIfAborted();
	const platform = internals.platform ?? process.platform;
	if (platform === "linux" && nativeFileManager(internals) === "explorer") {
		const translated = await (internals.run ?? runNativeCommand)("wslpath", ["-w", path], signal, "hidden");
		signal.throwIfAborted();
		const windowsPath = translated.stdout.replace(/[\r\n]+$/, "");
		if (windowsPath === "") throw new Error("wslpath returned no Windows path");
		return {
			platform: "win32",
			path: windowsPath
		};
	}
	return {
		platform,
		path
	};
}
//#endregion
export { canOpenNativePath, desktopApplicationIcon, desktopDataDirectories, desktopEntryFields, nativeFileApplications, nativeFileManager, openNativeAssociatedPath, openNativeFileApplication, openNativePath, openNativeTextFile, revealNativePath, runNativeCommand };
