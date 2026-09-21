import { useCallback, useEffect, useState } from 'react';
import { AIProfile, isAIProfileConfigured, loadAIProfile, saveAIProfile } from '../services/aiProfile';

export function useAiProfile() {
  const [profile, setProfileState] = useState<AIProfile>(() => loadAIProfile());

  useEffect(() => {
    const sync = () => setProfileState(loadAIProfile());
    window.addEventListener('storage', sync);
    window.addEventListener('hpclaw-ai-profile-change', sync as EventListener);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('hpclaw-ai-profile-change', sync as EventListener);
    };
  }, []);

  const setProfile = useCallback((next: Partial<AIProfile> & { provider?: string }) => {
    setProfileState(saveAIProfile(next));
  }, []);

  return {
    profile,
    setProfile,
    isConfigured: isAIProfileConfigured(profile),
  };
}
