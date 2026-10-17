/**
 * Prefix-pruned, linear credential scanning that allocates nothing until it
 * returns a node. A literal-only alternation finds each place a format can
 * begin and resumes inside a literal that can overlap the next one. Format
 * checks are bounded character comparisons and sticky `[class]*` runs, which
 * end at the first character outside the class and leave nothing to backtrack
 * into. Run ends, the next digit, and the next key-block `END` line are
 * memoized per text across queries, so each is measured once per text.
 */
import type { UserTextNode } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { FormatTables } from './format-tables.ts';
/**
 * One matcher's scanning state: the tables, its own patterns, and a memo of the
 * last queried text, which it keeps until a query for another text. Queries are
 * synchronous and never re-enter, so the patterns' cursors are never shared.
 */
export declare class CredentialScanner {
    private readonly classes;
    private readonly literals;
    private readonly literalLength;
    private readonly literalKind;
    private readonly literalShape;
    private readonly literalMin;
    private readonly literalMax;
    private readonly literalOverlap;
    private readonly ending;
    private readonly sharedEndings;
    /** Memo slot of each prefixed format's run class; 0 for `[A-Za-z0-9_-]`, which has four. */
    private readonly literalSlot;
    private readonly literalPattern;
    private readonly prefixes;
    private readonly keyRun;
    private readonly userRun;
    private readonly passwordRun;
    private readonly nonDigits;
    private readonly masks;
    private readonly memo;
    private text;
    constructor(tables: FormatTables);
    /**
     * The nearest credential at or after `from`. Overlapping candidates of any format join the earliest
     * one and take its mask, so no credential is drawn half masked. Candidates arrive in start order;
     * an address password waits until the scan passes its start, and no other `://` can occur before
     * then, because a user name and a password exclude `/`. A password that starts inside a range also
     * ends inside it: the range holds the `:` before the password, so it is a key block, whose `END`
     * line has spaces, or one that runs to the end of the text.
     * @param text - the complete original text.
     * @param from - the query offset.
     * @returns the `secret` node, or undefined when no credential starts at or after `from`.
     */
    match(text: string, from: number): UserTextNode<'secret'> | undefined;
    /** Memo entry at `index`; the layout keeps every index inside the array. */
    private slot;
    /** `\w` at `index`; out of range is not a word character. */
    private isWordAt;
    /** `[^\s/:@?#]` for one UTF-16 code unit; NaN, read out of range, is not one. */
    private isUserCode;
    /** Index of the literal the prefix scan matched ending at `end`; one literal sharing the ending matches, so the last needs no check. */
    private literalEndingAt;
    /** End of the `[A-Za-z0-9_-]*` run at `start`, through four memo pairs replaced in turn. */
    private keyRunEnd;
    /** End of the run `pattern` matches at `start`, through the memo pair at `slot`. */
    private memoRunEnd;
    /** Offset of the first digit at or after `start`, or the text length. */
    private nextDigit;
    /** Offset after `[A-Z0-9 ]{0,40}PRIVATE KEY-----` at `start`, or -1; reads at most 52 characters. */
    private labelEnd;
    /**
     * End of the `-----BEGIN [A-Z0-9 ]{0,40}PRIVATE KEY-----` block at `at`: after its first complete
     * `END` line, or the end of the text; -1 for an invalid header.
     */
    private keyBlockEnd;
    /** Whether `\b[a-z][a-z0-9+.-]{1,15}` ends at `at`; reads at most 17 characters back. */
    private schemeBefore;
    /**
     * The password in `\b[a-z][a-z0-9+.-]{1,15}://[^\s/:@?#]{0,256}:[^\s/@?#]+@` for the `://` at
     * `at`; neither part crosses `?` or `#`, where the authority ends. Callers pass a `://` at or after
     * the query offset, or one whose user name reaches it, so the password never starts before it.
     * @returns the password end with its start in the memo, or -1.
     */
    private addressPassword;
    /**
     * The address password at or after `from` whose `://` starts before `from`, as `addressPassword`
     * returns it. The walk back over the user name runs only when a `:`, a password, and `@` follow.
     */
    private addressBefore;
    /** End of the prefixed credential whose literal starts at `at`, or -1. */
    private prefixedEnd;
}
//# sourceMappingURL=credential-scanner.d.ts.map