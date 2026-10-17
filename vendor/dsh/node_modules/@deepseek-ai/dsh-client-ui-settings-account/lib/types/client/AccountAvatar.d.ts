import type { AccountAvatarSnapshot } from './account-avatar.ts';
/**
 * Render a decorative avatar next to the account identity.
 * @param props - shared browser load outcome and rendered-image failure reporter; absent data uses the default icon.
 * @returns picture or the default account icon.
 */
export declare function AccountAvatar({ avatar, avatarFailed }: {
    avatar: AccountAvatarSnapshot | undefined;
    avatarFailed: (snapshot: AccountAvatarSnapshot) => void;
}): import("react").JSX.Element;
//# sourceMappingURL=AccountAvatar.d.ts.map