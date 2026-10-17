/**
 * The single file-extension to syntax-highlighting language table shared by every
 * code surface: the Client's document Code preview and diff review, and the Host
 * read tool's persisted `lang` hint. Language ids are the grammar ids the Client
 * highlighter's alias table resolves, so a language returned here reaches
 * `highlightLines`/`highlightToHtml` unchanged; a filename outside the table, or
 * one naming a language the highlighter does not register, renders as plain text.
 * The read tool persists a short `lang` id, so {@link readLangHintForPath}
 * projects short ids over this table: a suffix keeps the value a recorded session
 * already holds, and every other suffix persists the language's short name —
 * which for `kotlin`, `swift`, `yaml`, `json`, and similar equals that
 * language's grammar id.
 * @module @deepseek-ai/dsh-util-code-language
 */
/** Every recognized filename suffix, one entry each; a document-preview registry uses it to claim Code-rendered bodies. */
export declare const CODE_HIGHLIGHT_EXTENSIONS: readonly string[];
/**
 * Derive the syntax-highlighting language from a filename or path, case
 * insensitively. The extension is the text after the last dot of the final path
 * segment; a leading dot is still the separator, so `.env` resolves to `dotenv`
 * while an unlisted dotfile (`.gitignore`) and an extensionless name return
 * `undefined`. Both path separators are recognized, so
 * `C:\\dir\\main.PS1` resolves like `dir/main.ps1`.
 * @param path - decoded filename or path.
 * @returns the canonical language id, or `undefined` for an unrecognized or absent suffix.
 */
export declare function languageForPath(path: string): string | undefined;
/**
 * Derive the Host read card's persisted `lang` hint from a read path's
 * extension. The value is the language's short name; for some languages that name
 * is also the grammar id (`kotlin`, `swift`, `java`, `yaml`, `json`), and
 * {@link READ_LANG_BY_EXTENSION} overrides it where the suffix names itself
 * better (`tsx`, `tf`, `gradle`). A suffix a recorded session already holds keeps
 * its persisted value. An unrecognized suffix stays `undefined`, so the card
 * renders as plain text.
 * @param path - the model-facing path the read reported.
 * @returns the persisted language hint, or `undefined` when the extension maps to none.
 */
export declare function readLangHintForPath(path: string): string | undefined;
//# sourceMappingURL=index.d.ts.map