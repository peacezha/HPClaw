/** One accepted preference drives every developer-tool consumer. */
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { DeveloperToolsSettings } from '../developer-tools-settings.ts';
import type { ConfigForm } from './config-form-types.ts';
/** Shared preference; Host-backed features stay disabled until an accepted value arrives. */
export declare class DeveloperToolsPreference {
    private readonly scope;
    /** Accepted enablement, observable through renderer-bound hooks. */
    readonly enabled: ObservableSnapshot<boolean>;
    /**
     * @param scope - settings-owned namespace controller.
     */
    constructor(scope: ConfigForm<DeveloperToolsSettings>);
    /**
     * Persist the choice on the Host with ordered writes.
     * @param enabled - requested developer-tool mode.
     * @returns settlement after Host acceptance; rejects after a refused write recovers.
     */
    setEnabled(enabled: boolean): Promise<void>;
}
//# sourceMappingURL=developer-tools.d.ts.map