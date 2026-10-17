/** Historical child identity reduced to the fields required by a parent's catalog. */
import type { SessionFormatArtifact, SessionFormatJsonObject, SessionFormatJsonValue } from '@deepseek-ai/dsh-session-format';
/**
 * Collect a child's own descriptor without requiring one before its parent catalog is read.
 * @param artifact - validated historical child artifact with its exact inherited cut.
 * @returns compact child identity and descriptor evidence with validated discovery fields for catalog completion.
 * @throws SessionFormatError when a supported own descriptor has invalid discovery fields.
 */
export declare function historicalChildCatalogSource(artifact: SessionFormatArtifact): SessionFormatJsonObject;
/**
 * Validate supplemental child evidence supplied across the migration JSON interface.
 * @param value - collected child identity and optional descriptor.
 * @returns validated evidence; descriptor interpretation is deferred until parent membership is known.
 */
export declare function childCatalogSource(value: SessionFormatJsonValue): SessionFormatJsonObject;
/**
 * Interpret only the discovery fields of known historical descriptors.
 * @param source - validated child evidence.
 * @returns a catalog fact, or undefined without exactly one supported own descriptor.
 */
export declare function childCatalogFact(source: SessionFormatJsonObject): SessionFormatJsonObject | undefined;
/**
 * Validate the historical fields used for catalog membership without interpreting extensions.
 * @param value - catalog payload or prepared historical discovery fact.
 * @param subject - event type or child identity used in rejection diagnostics.
 * @returns validated catalog payload.
 */
export declare function catalogFact(value: SessionFormatJsonValue, subject?: string): SessionFormatJsonObject;
/**
 * Name the child and its optional storage-owned location in a migration diagnostic.
 * @param source - validated supplemental child evidence.
 * @returns a child identity with its source path when persistence supplied one.
 */
export declare function childCatalogSubject(source: SessionFormatJsonObject): string;
//# sourceMappingURL=facts.d.ts.map