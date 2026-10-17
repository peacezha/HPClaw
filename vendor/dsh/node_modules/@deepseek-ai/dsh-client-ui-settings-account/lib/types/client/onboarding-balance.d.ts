import type { AccountSnapshot } from './AccountSection.tsx';
/**
 * Check purchased and granted credit without treating a pending query as zero.
 * @param balance - current account balance result.
 * @returns whether either wallet group has positive credit.
 */
export declare function hasOnboardingCredit(balance: NonNullable<AccountSnapshot['details']>['balance']): boolean;
//# sourceMappingURL=onboarding-balance.d.ts.map