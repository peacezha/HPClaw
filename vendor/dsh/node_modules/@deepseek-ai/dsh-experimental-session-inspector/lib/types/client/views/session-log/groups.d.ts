/** Turn and Step start/end ranges add ancestry without inventing or reordering log records. */
import type { SessionEventLike } from '@deepseek-ai/dsh-api-session-controller/client';
import type { InspectorRow } from '../table-model.ts';
/** One ordered pass over the loaded log; missing starts do not create synthetic headers. */
export declare class SessionLogGroups {
    private turn;
    private step;
    /**
     * Place a record inside its open Step or Turn, retaining end records as the final children.
     * Turn and Step headers remain expanded after their end; manual folding stays table-local.
     * @param row - Ungrouped event row.
     * @param event - Original event.
     * @returns The same row identity with range ancestry and depth.
     */
    append(row: InspectorRow, event: SessionEventLike): InspectorRow;
    private child;
}
//# sourceMappingURL=groups.d.ts.map