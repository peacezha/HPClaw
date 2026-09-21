interface TransferIdentityInput {
  activeProfileId?: string | null;
  profileId?: string | null;
  sessionId?: string | null;
}

export function resolveTransferProfileId({
  activeProfileId,
  profileId,
  sessionId,
}: TransferIdentityInput): string {
  const explicitProfile = activeProfileId?.trim() || profileId?.trim();
  if (explicitProfile) return explicitProfile;
  const activeSession = sessionId?.trim();
  return activeSession ? `session:${activeSession}` : '';
}
