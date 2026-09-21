import { useState, useEffect } from 'react';
import type { ConnectionState, HostProfileMetadata } from '@/shared/fileTransfer';

interface HostManagerProps {
  onConnect: (profileId: string) => void;
  connectionState: ConnectionState;
}

const isDesktop =
  typeof window !== 'undefined' && window.hpclawDesktop !== undefined;

export default function HostManager({
  onConnect,
  connectionState,
}: HostManagerProps) {
  const [profiles, setProfiles] = useState<HostProfileMetadata[]>([]);

  useEffect(() => {
    if (isDesktop) {
      window.hpclawDesktop!.profiles.list().then(setProfiles);
    }
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-scholar-400 px-8">
        <p className="text-sm">桌面应用模式下可用</p>
        <p className="text-xs text-scholar-500 mt-1">Available in desktop app mode</p>
      </div>
    );
  }

  if (connectionState === 'connecting') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-scholar-400">
        <p className="text-sm">连接中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-sm font-semibold text-scholar-100 mb-3">主机配置</h3>
      {profiles.length === 0 ? (
        <p className="text-xs text-scholar-500">暂无已保存的主机配置</p>
      ) : (
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <button
                type="button"
                onClick={() => onConnect(profile.id)}
                className="w-full text-left px-3 py-2 rounded bg-scholar-800 border border-scholar-700 hover:border-accent/40 text-scholar-200 text-sm transition-colors"
              >
                <span className="font-medium">{profile.name}</span>
                <span className="block text-xs text-scholar-400 mt-0.5">
                  {profile.username}@{profile.host}:{profile.port}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
