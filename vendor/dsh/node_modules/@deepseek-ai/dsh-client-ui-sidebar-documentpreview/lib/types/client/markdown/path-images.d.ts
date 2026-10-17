/**
 * Build a file URL, resolving relative destinations beside the previewed file.
 * @param base - document base URI, including any deployment prefix.
 * @param documentPath - absolute source path reported by the Host, when available.
 * @param destination - authored Markdown image URL; query and fragment are not filename components.
 * @returns a Web or Desktop file URL, or undefined for unsupported or malformed destinations.
 */
export declare function markdownImageUrl(base: string, documentPath: string | undefined, destination: string): string | undefined;
//# sourceMappingURL=path-images.d.ts.map