/** Package directories whose manifests are read from disk instead of Node's native cache. */
export declare class PackageManifests {
    private readonly directories;
    private readonly configurations;
    /** Real directory of each directory a lookup reached; linked consumers name a package by its link path. */
    private readonly realDirectories;
    private native;
    private rawBinding;
    private rawReader;
    private rawCommonJs;
    private readonly restorers;
    /**
     * Expire cached configuration for one package directory. Loaded modules stay evaluated; later resolutions and
     * format checks read the manifest on disk.
     * @param manifest - absolute path of the changed `package.json`.
     */
    invalidate(manifest: string): void;
    /** Restore every replaced Node method this instance installed. */
    dispose(): void;
    private isPathWithinDirectory;
    private isPathInInvalidatedDirectory;
    private isUrlInInvalidatedDirectory;
    private installPackageHooks;
    private hookCommonJsLoad;
    private hookBindingReadPackageJSON;
    private hookBindingGetPackageScopeConfig;
    private hookBindingGetPackageType;
    private hookReaderGetNearestParentPackageJSON;
    private readCachedPackageConfig;
    /** A string names the first manifest outside the invalidated directories; Node answers for it. */
    private findNearestPackageConfig;
    /** @param context - optional ESM import details used only when reporting invalid package configuration. */
    private readPackageConfigFromDisk;
}
//# sourceMappingURL=package-manifest.d.ts.map