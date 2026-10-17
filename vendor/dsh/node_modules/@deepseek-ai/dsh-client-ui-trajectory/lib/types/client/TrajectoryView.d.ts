/** Trajectory view: compact summary over a turn-aware event ledger. */
import type { ConvViewProps, MessageImageLoader } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { InjectFace, PropsLocale, PropsRenderSlots } from '@deepseek-ai/dsh-client-ui-slots';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { JsonTreeProps } from '@deepseek-ai/dsh-client-ui-primitives';
/** Session-bound controls not already supplied by the conversation view slot. */
export interface TrajectoryViewInjected {
    /** Shared wrapping preference read by expansion handlers. */
    jsonStringWrapping?: Omit<NonNullable<JsonTreeProps['stringWrapping']>, 'label'>;
    hooks: {
        duration: SnapshotStore<boolean>;
    };
    loadOlder: () => Promise<boolean>;
    loadImage: MessageImageLoader;
    setActualDuration: (actualDuration: boolean) => void;
}
export declare function TrajectoryView({ useSession, useTrajectory, useDuration, loadOlder, loadImage, setActualDuration, viewRequest, completeViewRequest, renderSlot, t, jsonStringWrapping, }: ConvViewProps & Pick<PropsRenderSlots<'conversation.trajectory.images'>, 'renderSlot'> & InjectFace<TrajectoryViewInjected> & PropsLocale<'trajectory'>): import("react").JSX.Element;
//# sourceMappingURL=TrajectoryView.d.ts.map