import type { ClusterCredentials } from './clusterSession';

export interface ReconnectSecretSource {
  password?: string;
  totpSecret?: string;
}

/** 旧动态码绝不复用；有种子时由调用方生成当前码。 */
export function buildReconnectCredentials(
  current: ClusterCredentials,
  secrets: ReconnectSecretSource | undefined,
  generateTotp: (secret: string) => string,
): ClusterCredentials {
  return {
    ...current,
    password: secrets?.password || current.password,
    verificationCode: secrets?.totpSecret ? generateTotp(secrets.totpSecret) : '',
  };
}
