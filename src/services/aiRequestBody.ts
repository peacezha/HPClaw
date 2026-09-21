export const AI_REQUEST_GZIP_THRESHOLD_BYTES = 64 * 1024;

export interface PreparedAiRequestBody {
  body: Uint8Array;
  headers: Record<string, string>;
  compressed: boolean;
}

type CompressionStreamCtor = new (format: CompressionFormat) => CompressionStream;

function getCompressionStreamCtor(): CompressionStreamCtor | undefined {
  return (globalThis as typeof globalThis & {
    CompressionStream?: CompressionStreamCtor;
  }).CompressionStream;
}

export async function prepareAiRequestBody(data: unknown): Promise<PreparedAiRequestBody> {
  const json = JSON.stringify(data);
  const plainBody = new TextEncoder().encode(json);
  const plainHeaders = { 'Content-Type': 'application/json' };

  const CompressionStreamImpl = getCompressionStreamCtor();
  if (!CompressionStreamImpl || plainBody.byteLength < AI_REQUEST_GZIP_THRESHOLD_BYTES) {
    return { body: plainBody, headers: plainHeaders, compressed: false };
  }

  try {
    const blob = new Blob([json]);
    const stream = blob.stream().pipeThrough(new CompressionStreamImpl('gzip'));
    const buf = await new Response(stream).arrayBuffer();
    return {
      body: new Uint8Array(buf),
      headers: { ...plainHeaders, 'Content-Encoding': 'gzip' },
      compressed: true,
    };
  } catch {
    return { body: plainBody, headers: plainHeaders, compressed: false };
  }
}
