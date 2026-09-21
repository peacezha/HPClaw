// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { findMatchingLoginProfile, loginProfileId, type LoginProfile } from './loginProfiles';

const profiles: LoginProfile[] = [
  {
    id: 'legacy-random-id',
    name: 'alice@Cluster.Example',
    host: 'Cluster.Example',
    port: '22',
    username: 'alice',
    hasSavedPassword: true,
    hasSavedTotp: true,
  },
  {
    id: 'other',
    name: 'bob@cluster.example',
    host: 'cluster.example',
    port: '22',
    username: 'bob',
    hasSavedPassword: true,
    hasSavedTotp: true,
  },
];

describe('login profile identity', () => {
  it('normalizes host casing and numeric port spelling', () => {
    expect(loginProfileId(' Cluster.Example ', '022', 'alice')).toBe('cluster.example:22:alice');
  });

  it('matches only the exact host, port and username tuple', () => {
    expect(findMatchingLoginProfile(profiles, {
      host: 'cluster.example',
      port: '022',
      username: 'alice',
    })?.id).toBe('legacy-random-id');
    expect(findMatchingLoginProfile(profiles, {
      host: 'cluster.example',
      port: '22',
      username: 'charlie',
    })).toBeUndefined();
  });
});
