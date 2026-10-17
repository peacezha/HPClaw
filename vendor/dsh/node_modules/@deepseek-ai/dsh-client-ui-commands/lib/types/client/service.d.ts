/**
 * CommandUiRuntime (`ctx.commandUi`): the '/' command source over the
 * session-keyed directory, the client-contribution registry, and the
 * per-session popupSelect controllers. Candidate synthesis merges the host
 * catalog with contributions by availability, gives built-in Host rows their
 * localized face (presentation.ts), then position-filters; an empty query
 * lists the Add and Commands sections in usage order, a typed query ranks
 * every row by the `/` menu's shared name-and-label ranking (ui-primitives
 * `rankByName`). A host/contribution name collision fails loud. Every
 * execute addresses the session's agent by sessionId — sessions are always
 * agent-backed.
 * Catalog RPCs retain an existing Client Session through completion and
 * wait for its initial history open to succeed before contacting the Host.
 */
import { Service } from '@deepseek-ai/cordis';
import type { Context } from '@deepseek-ai/cordis';
import type { CommandResult } from '@deepseek-ai/dsh-commands/types';
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { ClientSessionContext } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { CommandContribution, CommandDecoration, CommandUiContract } from './contract.ts';
import { PopupSelectController } from './popup.ts';
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        /** A command-catalog fetch waiting for initial history and its RPC result. */
        commandCatalog: unknown;
    }
}
declare module '@deepseek-ai/cordis' {
    interface Events {
        /**
         * This browser client completed one admitted Host command execution.
         * Other clients receive the durable command nodes but never this local
         * submission acknowledgment.
         * @param sessionId - Session addressed by the local submission.
         * @param name - Executed command name without the leading slash.
         * @param result - Host command result returned to this browser.
         * @mode emit
         */
        'command/executed'(sessionId: SessionId, name: string, result: CommandResult): void;
    }
}
/** Command surface: session-keyed directory + '/' source + contribution registry + per-session popups. */
export declare class CommandUiRuntime extends Service implements CommandUiContract {
    static inject: string[];
    private readonly directory;
    private readonly live;
    /** `command`-namespace translator (composer refusal notices). */
    private readonly t;
    /**
     * @param ctx - owning root context (plugin fiber; the service registers
     * itself as `command` and follows that fiber's lifetime).
     */
    constructor(ctx: Context);
    /**
     * Register one client command contribution; effect disposer (rides the
     * caller's fiber). Duplicate names throw.
     * @param contribution - the contribution (descriptor + availability + popup spec).
     * @returns the disposer removing the registration.
     */
    register(contribution: CommandContribution): () => void;
    /**
     * Hang a bare-invocation decoration on one host command; effect disposer
     * (rides the caller's fiber). Duplicate names throw.
     * @param decoration - host command name + availability + popup spec.
     * @returns the disposer removing the registration.
     */
    decorate(decoration: CommandDecoration): () => void;
    /**
     * Close every open popup for a command whose options have become stale.
     * Pending loads and confirmations lose their binding; drafts stay intact.
     * @param name - command name without the leading slash.
     */
    dismiss(name: string): void;
    /**
     * Resolve the per-session popup controller (lazy; dies with the session
     * scope). The controller's consume callback dispatches the scoped
     * consume-token event back to this session; focusComposer reaches the
     * session's composer through the conversation input face.
     * @param actx - session-scope ctx.
     * @returns the resident controller.
     * @throws when the Context no longer belongs to a retained Session generation.
     */
    popupFor(actx: ClientContext): PopupSelectController<ClientSessionContext>;
    /**
     * Menu candidates: host catalog + contribution availability, built-in rows
     * localized, then position filtering; sections for an empty query, the
     * shared name-and-label ranking for a typed one.
     */
    private candidates;
    /** Decision table, menu column: contribution/decorated-host → popup or action; host input → claim; host bare → detached execute. */
    private dispatch;
    /** Decision table, space column: hot-key sync check; only host leadingInput claims. */
    private matchSpace;
    /**
     * Restore column: the space column's answer once the session's catalog is
     * ready (a warmup failure rejects). It only resolves; nothing is invoked or
     * executed.
     */
    private matchClaim;
    /** The host leadingInput claim a token names in the hot catalog; popup and action kinds never claim. */
    private claimOf;
    /**
     * Decision table, enter column. Strong-waits the session's catalog (a
     * warmup failure rejects — never a silent downgrade). Contributions and
     * bare host commands act on the bare token only; leadingInput claims
     * args-tolerant.
     *
     * Envelope policy: an enter submission carrying attachments resolves only
     * through a command declaring attachment acceptance. Every other submitting
     * route — popup, non-accepting claim, bare detached execute — throws the
     * refusal so the machine surfaces one composer notice and the draft and
     * attachments stay in place; nothing executes and nothing is dropped. An
     * action submits nothing and runs regardless.
     *
     * A typed token is resolved through the localized claim tokens, so a line
     * written as `/计划` reaches the `plan` descriptor and executes as `/plan`.
     */
    private matchEnter;
    /**
     * Invoke one contribution or decoration (menu pick / bare enter): open the
     * session's popup, or consume the token and run the action.
     */
    private invoke;
    /**
     * Build the leadingInput claim. The composer keeps the claimed token in
     * the draft and reads the arguments after it, so the token is the spelling
     * the draft will carry: the locale's token for a menu pick, the typed
     * spelling for Space and Enter. The command.execute submit transaction
     * always sends the catalog name.
     */
    private leadingClaim;
    /**
     * The command.execute transaction, addressed to the session's agent — pure
     * admission semantics. An unmatched line reports an error outcome (the
     * composer's immediate admission feedback); an admitted command reports
     * plain success regardless of its handler outcome, because the host
     * executor durably logged the lifecycle (`command/run`/`command/done`) and
     * the outcome renders as a persistent flow node — the composer never
     * echoes it. A handler error result reports an error outcome so the
     * composer keeps the draft and attachments for correction.
     * A refused call throws.
     */
    private execute;
    /** Publish the local acknowledgment without letting an observer change command admission. */
    private notifyExecuted;
    /** Log one contained `command/executed` observer failure. */
    private warnExecutedListenerFailure;
    /**
     * Fire-and-forget execute for the internal ('handled') paths. Outcomes are
     * NOT surfaced here: the host executor durably logs the command lifecycle
     * (`command/run`/`command/done`), and the mux-broadcast events render as a
     * persistent flow node on every tab. Only an admission failure — which never
     * entered a handler and therefore never logged — falls back to the composer
     * notice as immediate feedback.
     */
    private runDetached;
    /** Dispatch a consume-token event to one session (menu-pick / bare-enter execute paths). */
    private consumeVia;
    /** Route an admission failure to the session's composer notice channel (scope gone = attempt died with it). */
    private noticeFor;
    /** id → actx interchange (registered exchange point: this service coordinates for projection-only sources). */
    private scopeFor;
    private sessions;
}
//# sourceMappingURL=service.d.ts.map