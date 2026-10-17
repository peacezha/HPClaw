/** Leading YAML frontmatter split from a Markdown document before Markdown parsing. */
/** Frontmatter source between its delimiters and the Markdown body after the closing delimiter. */
export interface FrontmatterSplit {
    source: string;
    body: string;
}
/**
 * Split a leading YAML frontmatter block from Markdown text without parsing its YAML.
 * @param text - Markdown source; an unterminated block is not frontmatter.
 * @returns frontmatter source and the remaining body, or `undefined` when the text has none.
 */
export declare function splitFrontmatter(text: string): FrontmatterSplit | undefined;
//# sourceMappingURL=frontmatter.d.ts.map