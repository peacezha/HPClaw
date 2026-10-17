/** `open-in-app` namespace dictionaries: the workspace split button and the document-preview path controls. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "open-in-app";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'app.finder': "访达";
    readonly 'app.explorer': "文件资源管理器";
    readonly 'app.filemanager': "文件管理器";
    readonly 'app.terminal': "终端";
    readonly 'app.cursor': "Cursor";
    readonly 'app.vscode': "VS Code";
    readonly 'app.vscodeinsiders': "VS Code Insiders";
    readonly 'app.windsurf': "Windsurf";
    readonly 'app.zed': "Zed";
    readonly 'app.sublimetext': "Sublime Text";
    readonly 'app.xcode': "Xcode";
    readonly 'app.androidstudio': "Android Studio";
    readonly 'app.intellij': "IntelliJ IDEA";
    readonly 'app.pycharm': "PyCharm";
    readonly 'app.webstorm': "WebStorm";
    readonly 'app.phpstorm': "PhpStorm";
    readonly 'app.goland': "GoLand";
    readonly 'app.rider': "Rider";
    readonly 'app.rustrover': "RustRover";
    readonly 'app.fork': "Fork";
    readonly 'app.sourcetree': "Sourcetree";
    readonly 'app.github': "GitHub Desktop";
    readonly 'app.tower': "Tower";
    readonly 'app.gitkraken': "GitKraken";
    readonly 'app.smartgit': "SmartGit";
    readonly 'app.sublimemerge': "Sublime Merge";
    readonly 'app.ghostty': "Ghostty";
    readonly 'app.warp': "Warp";
    readonly 'app.iterm': "iTerm2";
    readonly 'app.kitty': "kitty";
    readonly 'app.windowsterminal': "Windows Terminal";
    readonly 'app.gitbash': "Git Bash";
    readonly 'app.gnometerminal': "GNOME Terminal";
    readonly 'app.konsole': "Konsole";
    readonly 'open.title': "用 {app} 打开";
    readonly 'path.appDefault': "{app}（默认）";
    readonly 'path.appsError': "无法获取应用列表";
    readonly 'shortcut.busy': "正在打开工作区";
    readonly 'shortcut.unavailable': "当前工作区或本地应用不可用";
    readonly 'open.tooltip': "在本地打开";
    readonly 'path.open': "打开";
    readonly 'path.more': "更多打开方式";
    readonly 'path.reveal': "显示文件位置";
    readonly 'path.openError': "打开失败，请重试";
    readonly 'path.revealError': "无法显示文件位置，请重试";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<OpenInAppKey, string>;
/** Key domain of the `open-in-app` namespace (zh is the source of truth). */
export type OpenInAppKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map