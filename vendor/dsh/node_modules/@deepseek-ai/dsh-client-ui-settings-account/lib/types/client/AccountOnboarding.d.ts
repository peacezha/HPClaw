import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AccountSectionInjected } from './AccountSection.tsx';
/** @param props - onboarding completion, account state and actions. @returns account dialog while signed out. */
export declare function AccountOnboarding({ complete, useApiKey, useAccount, useTheme, setOnboarding, showLogin, start, cancel, t }: PropsRuntime<'settings.models.sign-in'> & PropsLocale<'settings.account'> & InjectFace<AccountSectionInjected>): import("react").JSX.Element | null;
//# sourceMappingURL=AccountOnboarding.d.ts.map