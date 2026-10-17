/**
 * Registers the bundled Windows sandbox ACL diagnosis skill.
 *
 * The provider owns a private filesystem copy of its resources so external
 * PowerShell can execute them even when the package lives inside ASAR or SEA.
 * Disposing the registration removes both the provider and its resource copy.
 *
 * @module @deepseek-ai/dsh-sandbox-windows-acl
 */
import type { Context } from '@deepseek-ai/cordis';
/** Bundled skill that diagnoses Windows sandbox ACL failures. */
export declare const ACL_DIAGNOSIS_SKILL = "diagnose-windows-sandbox-acl";
/**
 * Register the bundled diagnosis skill with a private resource directory owned by this fiber.
 * Missing or invalid packaged assets fail registration; disposal removes the directory.
 * @param ctx - Context carrying the skill registry.
 */
export declare function registerAclDiagnosisSkill(ctx: Context): void;
//# sourceMappingURL=acl-skill.d.ts.map