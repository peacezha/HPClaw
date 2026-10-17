import type { UserTextNodeProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { NS } from './locales.ts';
type SecretTextProps = UserTextNodeProps<'secret'> & PropsLocale<typeof NS>;
/**
 * Draw one credential masked; interactive text adds a control that reveals or hides this value.
 * Every mount, and every different original value at the same position, starts masked.
 * @param props - masked node, original spelling, interaction mode, and locale seat.
 * @returns an inline masked run with an optional reveal control.
 */
export declare function SecretText({ node, raw, interactive, t }: SecretTextProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=SecretText.d.ts.map