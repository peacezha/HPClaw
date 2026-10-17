/** Startup variables required by native executables before model evaluation. */
/** Native executable search, Windows system paths, and sandbox temporary paths retained in the OS environment. */
export declare const STARTUP_ENVIRONMENT_NAMES: ReadonlySet<string>;
/**
 * Clear inherited credentials while preserving native child-process startup paths.
 * @param state - Child process environment, replaced with an empty program-visible object.
 */
export declare function clearProgramEnvironment(state: {
    env: NodeJS.ProcessEnv;
}): void;
//# sourceMappingURL=environment.d.ts.map