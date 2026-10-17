/** First-party Host inspect providers registered by the Cordis tool package. */
import { EVENT_API, queryEventApi, queryServiceApi } from "./api-catalog.js";
import { queryLiveConfig } from "./config.js";
const EMPTY_INPUT = { type: 'object', properties: {}, additionalProperties: false };
const ANY_OUTPUT = { description: 'JSON data owned by this inspect provider.' };
const SERVICE_INPUT = exactInput('service', 'Exact Service key. Omit it for the compact Service and method-signature directory.');
const EVENT_INPUT = exactInput('event', 'Exact Event name. Omit it for the compact Event and listener-signature directory.');
const SERVICE_OUTPUT = {
    description: 'Compact Service directory, or one exact Service contract with only its referenced type declarations.',
};
const EVENT_OUTPUT = {
    description: 'Compact Event directory, or one exact Event contract with only its referenced type declarations.',
};
const CONFIG_INPUT = {
    type: 'object',
    properties: {
        entry: { type: 'string', description: 'Exact Loader entry id from the directory; returns that entry\'s projected Config schema.' },
        name: { type: 'string', description: 'Exact plugin package name; limits the directory to its entries.' },
        offset: { type: 'number', description: 'Zero-based directory offset; defaults to 0.' },
        limit: { type: 'number', description: 'Directory page size, from 1 to 100; defaults to 25.' },
    },
    additionalProperties: false,
};
const CONFIG_OUTPUT = {
    description: 'One directory page of live entries with patch ids, Config status, total, and nextOffset, or one entry\'s projected JSON Schema with shared definitions, omission acceptance, and projection limitations.',
};
const HOST_EVENTS = EVENT_API.filter(event => !event.name.startsWith('cordis/'));
/**
 * Construct Host providers over generated Catalogs, evaluator declarations, and live Tool scope.
 * @param ctx - Host context used for live Loader Config and Agent-scoped Tool queries.
 * @returns registrations for static catalogs and live Host capabilities.
 */
export function hostInspectProviders(ctx) {
    return [
        registration('Service', 'Progressive Host Service discovery: compact capability/signature directory, then one exact coding contract.', 'listService', input => queryServiceApi(readExact(input, 'service')), SERVICE_INPUT, SERVICE_OUTPUT),
        registration('Event', 'Progressive Host Event discovery: compact listener directory, then one exact event contract.', 'listEvents', input => queryEventApi(readExact(input, 'event'), HOST_EVENTS), EVENT_INPUT, EVENT_OUTPUT),
        registration('Config', 'Progressive live plugin Config discovery: paged entry directory with schema status, then one entry\'s exact JSON Schema.', 'listConfigs', input => queryLiveConfig(ctx, input), CONFIG_INPUT, CONFIG_OUTPUT),
        {
            manifest: {
                id: 'Tool',
                description: 'Tools visible to the requesting Agent, including scoped and dynamic registrations.',
                methods: [{
                        name: 'listTools',
                        description: 'Return every Tool schema currently callable by this Agent.',
                        inputSchema: EMPTY_INPUT,
                        outputSchema: ANY_OUTPUT,
                    }],
            },
            query(method, _input, context) {
                if (method !== 'listTools')
                    throw new Error(`unknown Tool inspect method "${method}"`);
                return Promise.resolve({ tools: ctx.tools.schemas(context.agent) });
            },
        },
    ];
}
function registration(id, description, method, query, inputSchema = EMPTY_INPUT, outputSchema = ANY_OUTPUT) {
    return {
        manifest: {
            id,
            description,
            methods: [{
                    name: method,
                    description,
                    inputSchema,
                    outputSchema,
                }],
        },
        async query(requested, input) {
            if (requested !== method)
                throw new Error(`unknown ${id} inspect method "${requested}"`);
            return await query(input);
        },
    };
}
function exactInput(field, description) {
    return { type: 'object', properties: { [field]: { type: 'string', description } }, additionalProperties: false };
}
function readExact(input, field) {
    if (input === undefined || input === null || Array.isArray(input) || typeof input !== 'object')
        return undefined;
    const value = input[field];
    return typeof value === 'string' ? value : undefined;
}
//# sourceMappingURL=providers.js.map