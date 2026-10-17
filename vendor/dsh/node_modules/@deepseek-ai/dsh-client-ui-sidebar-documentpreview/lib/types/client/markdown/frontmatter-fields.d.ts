/**
 * Field list for a Markdown document's leading YAML frontmatter. The Markdown
 * body loads this module lazily so the YAML parser stays out of the startup
 * chunk.
 */
import { type ReactNode } from 'react';
/** Owner inputs for the lazily loaded field list. */
export interface FrontmatterFieldsProps {
    /** YAML between the frontmatter delimiters. */
    source: string;
    /** Verbatim block shown for invalid YAML and non-mapping documents. */
    fallback: ReactNode;
}
/**
 * Render frontmatter fields, or the owner's verbatim block when the YAML is not a mapping.
 * @param props - frontmatter source and its verbatim fallback.
 * @returns the field list, the fallback, or nothing for a document without content.
 */
export declare function FrontmatterFields({ source, fallback }: FrontmatterFieldsProps): ReactNode;
//# sourceMappingURL=frontmatter-fields.d.ts.map