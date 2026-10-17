/** Worker Thread entry that parses one fetched index body and posts the result to its parent. */
import { parentPort, workerData } from 'node:worker_threads';
import { parseIndexBody } from "./parse.js";
const request = workerData;
if (!(request?.body instanceof Uint8Array) || typeof request.url !== 'string')
    throw new Error('index parser request is malformed');
parentPort?.postMessage(parseIndexBody(request.body, request.url));
//# sourceMappingURL=worker.js.map