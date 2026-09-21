export type RemoteEditState =
  | 'downloading'
  | 'opening'
  | 'editing'
  | 'uploading'
  | 'synced'
  | 'failed';

export interface RemoteEditSession {
  id: string;
  profileId: string;
  sshSessionId: string;
  remotePath: string;
  localPath: string;
  state: RemoteEditState;
  dirty: boolean;
  lastLocalFingerprint?: string;
  lastUploadedFingerprint?: string;
  error?: string;
}

export interface RemoteEditEvent {
  type: 'changed' | 'dirty' | 'closed' | 'error' | 'discarded';
  session: RemoteEditSession;
}
