; 某些 Windows 环境的 32 位 PowerShell/.NET CLR 会在 Get-CimInstance
; 编译阶段触发 0xc0000005。安装、升级和卸载均使用 nsProcess 原生插件
; 检测 HPClaw，避免启动 PowerShell。
!include "StrFunc.nsh"
!include "nsProcess.nsh"
!ifdef BUILD_UNINSTALLER
  ${UnStrRep}
!else
  ${StrRep}
!endif

!macro hpclawStopBundledProcessesAt ROOT_VAR LABEL_SUFFIX
  ; dsh 使用 shell + node-pty，退出异常时可能残留 node.exe、OpenConsole.exe
  ; 或 rg.exe。只清理已登记安装目录下 app.asar.unpacked\vendor 子树中的
  ; 可执行文件，不会影响系统 Node、其他 OpenConsole 或其他软件的 rg。
  StrCmp "${ROOT_VAR}" "" hpclaw_vendor_cleanup_done_${LABEL_SUFFIX}
  StrCpy $R9 "${ROOT_VAR}\resources\app.asar.unpacked\vendor\%"
  !ifdef BUILD_UNINSTALLER
    ${UnStrRep} $R9 "$R9" "\" "\\"
  !else
    ${StrRep} $R9 "$R9" "\" "\\"
  !endif
  IfFileExists "$SYSDIR\wbem\WMIC.exe" 0 hpclaw_vendor_cleanup_done_${LABEL_SUFFIX}
  DetailPrint "Closing bundled HPClaw tool processes under ${ROOT_VAR}..."
  nsExec::Exec `"$SYSDIR\wbem\WMIC.exe" process where "ExecutablePath like '$R9'" call terminate`
  Pop $R0
  Sleep 1000
  hpclaw_vendor_cleanup_done_${LABEL_SUFFIX}:
!macroend

!macro hpclawStopAllBundledProcesses
  ; 同时读取当前用户、所有用户和本次目标目录。这样旧版安装在另一种
  ; 安装模式/目录时也能先释放文件锁，再进入旧版卸载或覆盖复制。
  ReadRegStr $R8 HKEY_LOCAL_MACHINE "${INSTALL_REGISTRY_KEY}" "InstallLocation"
  !insertmacro hpclawStopBundledProcessesAt $R8 machine
  ReadRegStr $R8 HKEY_CURRENT_USER "${INSTALL_REGISTRY_KEY}" "InstallLocation"
  !insertmacro hpclawStopBundledProcessesAt $R8 user
  !insertmacro hpclawStopBundledProcessesAt $INSTDIR target
!macroend

!macro hpclawDisableUpgradeUninstaller ROOT_KEY REGISTRY_KEY
  ; electron-builder 的 --updated 旧卸载器会把整个安装目录原子 Rename 到
  ; $PLUGINSDIR。安装目录与系统临时目录跨盘时该操作必然返回 2；进程刚退出、
  ; 安全软件仍短暂持有文件时也会失败。升级不再调用任意旧版本卸载器：先由
  ; 本安装器精确释放 HPClaw 自有进程，再覆盖应用文件。用户显式卸载不受影响。
  ClearErrors
  ReadRegStr $R8 ${ROOT_KEY} "${REGISTRY_KEY}" "UninstallString"
  ${If} $R8 != ""
    DeleteRegValue ${ROOT_KEY} "${REGISTRY_KEY}" "UninstallString"
    DeleteRegValue ${ROOT_KEY} "${REGISTRY_KEY}" "QuietUninstallString"
  ${EndIf}
  ClearErrors
!macroend

; “所有用户安装”的旧卸载记录在管理员区域。electron-builder 的提权后
; 安装阶段不会再次执行 customCheckAppRunning，因此要在内层初始化时移除
; 旧卸载入口，避免升级流程启动旧版卸载器中的 PowerShell。
!macro customInit
  !ifndef BUILD_UNINSTALLER
    ${If} ${UAC_IsInnerInstance}
      !insertmacro hpclawDisableUpgradeUninstaller HKEY_LOCAL_MACHINE "${UNINSTALL_REGISTRY_KEY}"
      !ifdef UNINSTALL_REGISTRY_KEY_2
        !insertmacro hpclawDisableUpgradeUninstaller HKEY_LOCAL_MACHINE "${UNINSTALL_REGISTRY_KEY_2}"
      !endif
    ${EndIf}
  !endif
!macroend

!macro customCheckAppRunning
  ; HPClaw may be running without a visible/login window because Electron keeps
  ; the backend and renderer as HPClaw.exe child processes. Use the native
  ; process plugin instead of localized command output, close gracefully first,
  ; then terminate exact-name leftovers so a hidden old version cannot block
  ; the upgrade forever. The setup executable has a different name and is safe.
  StrCpy $R1 0
  hpclaw_process_check:
    ${nsProcess::FindProcess} "${APP_EXECUTABLE_FILENAME}" $R0
    ${If} $R0 != 0
      Goto hpclaw_process_closed
    ${EndIf}

    DetailPrint "Closing background HPClaw processes..."
    ${nsProcess::CloseProcess} "${APP_EXECUTABLE_FILENAME}" $R0
    Sleep 1200
    ${nsProcess::FindProcess} "${APP_EXECUTABLE_FILENAME}" $R0
    ${If} $R0 == 0
      ${nsProcess::KillProcess} "${APP_EXECUTABLE_FILENAME}" $R0
      Sleep 800
    ${EndIf}

    ${nsProcess::FindProcess} "${APP_EXECUTABLE_FILENAME}" $R0
    ${If} $R0 == 0
      IntOp $R1 $R1 + 1
      ${If} $R1 < 3
        Goto hpclaw_process_check
      ${EndIf}
      ${If} ${Silent}
        ${nsProcess::Unload}
        Quit
      ${EndIf}
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "$(appCannotBeClosed)" /SD IDCANCEL IDRETRY hpclaw_process_check
      ${nsProcess::Unload}
      Quit
    ${EndIf}

  hpclaw_process_closed:
    ${nsProcess::Unload}

    !insertmacro hpclawStopAllBundledProcesses

    ; 0.2.12 及更早版本可能有卸载/退出不完整或 CRC 半安装状态。升级到本版时
    ; 保留安装目录，暂时移除旧卸载命令，让新文件直接覆盖；本次安装末尾
    ; 会重新写入完整的新版卸载记录。
    !ifndef BUILD_UNINSTALLER
      !insertmacro hpclawDisableUpgradeUninstaller HKEY_CURRENT_USER "${UNINSTALL_REGISTRY_KEY}"
      !insertmacro hpclawDisableUpgradeUninstaller HKEY_LOCAL_MACHINE "${UNINSTALL_REGISTRY_KEY}"
      !ifdef UNINSTALL_REGISTRY_KEY_2
        !insertmacro hpclawDisableUpgradeUninstaller HKEY_CURRENT_USER "${UNINSTALL_REGISTRY_KEY_2}"
        !insertmacro hpclawDisableUpgradeUninstaller HKEY_LOCAL_MACHINE "${UNINSTALL_REGISTRY_KEY_2}"
      !endif
    !endif
!macroend
