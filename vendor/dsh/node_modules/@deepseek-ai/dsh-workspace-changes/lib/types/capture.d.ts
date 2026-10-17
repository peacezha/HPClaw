/** One captured side of a path. */
export type Capture = 
/** No file at the path. */
{
    kind: 'absent';
}
/** A regular file larger than the configured cap; its content is not stored. */
 | {
    kind: 'oversized';
}
/** A stored copy, named by the SHA-1 of its bytes. */
 | {
    kind: 'file';
    file: string;
    binary: boolean;
};
/**
 * Store the current content of one path. At most `maxBytes + 1` bytes are
 * read, so a file that grows past the cap while it is read costs no more
 * memory than the cap.
 * @param absolute - canonical absolute path of the file.
 * @param directory - directory holding content-addressed copies; created when missing.
 * @param maxBytes - inclusive byte cap on a stored copy.
 * @returns the capture, or undefined for a path that is neither absent nor a regular file.
 * @throws when the path cannot be opened or read for a reason other than absence, or the copy cannot be written.
 */
export declare function captureFile(absolute: string, directory: string, maxBytes: number): Promise<Capture | undefined>;
/**
 * Whether two captures are known to hold the same content. Two absent sides
 * are the same; two stored copies are the same when their bytes hash alike;
 * an oversized side is never known to match anything, since its content was
 * not read.
 * @param a - one side.
 * @param b - the other side.
 * @returns true only when both sides are known to match.
 */
export declare function sameCapture(a: Capture, b: Capture): boolean;
//# sourceMappingURL=capture.d.ts.map