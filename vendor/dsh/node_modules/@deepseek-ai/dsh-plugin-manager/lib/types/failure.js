/** Expected management rejection; presentation belongs to the caller's locale. */
export class ManagementFailure extends Error {
    /** Code rendered by the caller's locale dictionary. */
    code;
    /** The packages an `incompatible-version` rejection names. */
    incompatible;
    /**
     * @param code Localizable management rejection.
     * @param incompatible Packages the running DSH version rejects, for `incompatible-version`.
     */
    constructor(code, incompatible) {
        super(code);
        this.code = code;
        this.incompatible = incompatible;
    }
}
/**
 * Drop the exemption status from an unexempted compatibility result.
 * @param issue Result whose exemption is not active.
 * @returns The package, runtime, and unmet DSH requirements.
 */
export function incompatiblePlugin(issue) {
    return { name: issue.name, version: issue.version, runtimeVersion: issue.runtimeVersion, requirements: issue.requirements };
}
//# sourceMappingURL=failure.js.map