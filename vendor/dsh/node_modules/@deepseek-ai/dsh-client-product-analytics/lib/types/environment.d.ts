import { type MissingReason, type QueryOptions } from './environment-query.ts';
/** Approved scalar attributes; missing fields carry fixed reasons. */
export interface EnvironmentAttributes {
    /** Platform name: windows, macos, or the unsupported Node platform. */
    os_name: string;
    /** Legacy platform and kernel release string. */
    os_version?: string;
    /** Windows major.minor.build.revision or macOS product version. */
    os_version_full?: string;
    /** Windows build or macOS product build. */
    os_build?: string;
    /** Native system architecture, independent of process emulation. */
    os_arch?: string;
    /** Architecture of the running application binary. */
    app_arch: string;
    /** Model reported by the first logical processor. */
    cpu_model?: string;
    /** System-reported logical processor count, not available parallelism. */
    cpu_logical_count?: number;
    /** Total physical cores across CPU sockets; never inferred from logical processors. */
    cpu_physical_core_count?: number;
    /** Total physical memory in bytes. */
    memory_total_bytes?: number;
    /** Only failed fields, with no raw commands, output, or errors. */
    missing_fields: Partial<Record<EnvironmentField, MissingReason>>;
}
type EnvironmentField = Exclude<keyof EnvironmentAttributes, 'missing_fields' | 'os_name' | 'app_arch'>;
/**
 * Collect only approved metadata; a failed source leaves its dependent fields missing.
 * @param options - per-command bounds and analytics disposal signal.
 * @returns a snapshot for reuse throughout this analytics instance, including failed fields.
 */
export declare function collectEnvironment(options: QueryOptions): Promise<EnvironmentAttributes>;
export {};
//# sourceMappingURL=environment.d.ts.map