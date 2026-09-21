import { describe, expect, it } from 'vitest';
import { generateTotp } from './totp.cjs';

describe('TOTP generator', () => {
  // RFC 6238 test vector: The base32 of "12345678901234567890" (20 bytes) is
  // "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
  // For timestamp=59000ms (epoch=59s, counter=1), SHA-1, the 8-digit TOTP = 94287082
  // For 6 digits: 94287082 % 1000000 = 287082
  it('generates RFC 6238 compliant codes', () => {
    const rfcSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
    const code = generateTotp(rfcSecret, 59000, 30, 6);
    expect(code).toBe('287082');
  });

  it('generates RFC 6238 8-digit code correctly', () => {
    const rfcSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
    const code = generateTotp(rfcSecret, 59000, 30, 8);
    expect(code).toBe('94287082');
  });

  it('generates different codes for different timestamps', () => {
    // Use timestamps that produce different counters (counter 0 vs counter 1)
    const code1 = generateTotp('JBSWY3DPEHPK3PXP', 0, 30, 6);
    const code2 = generateTotp('JBSWY3DPEHPK3PXP', 31000, 30, 6);
    expect(code1).not.toBe(code2);
  });

  it('generates different codes for different periods', () => {
    const code1 = generateTotp('JBSWY3DPEHPK3PXP', 59000, 30, 6);
    const code2 = generateTotp('JBSWY3DPEHPK3PXP', 59000, 60, 6);
    expect(code1).not.toBe(code2);
  });

  it('throws on invalid base32 characters', () => {
    expect(() => generateTotp('INVALID!', Date.now(), 30, 6)).toThrow('Invalid Base32 character');
    expect(() => generateTotp('LOWE1%', Date.now(), 30, 6)).toThrow('Invalid Base32 character');
  });

  it('handles lowercase base32 input', () => {
    // Same as uppercase JBSWY3DPEHPK3PXP but lowercase
    const lower = generateTotp('jbswy3dpehpk3pxp', 59000, 30, 6);
    const upper = generateTotp('JBSWY3DPEHPK3PXP', 59000, 30, 6);
    expect(lower).toBe(upper);
  });

  it('produces codes with consistent length', () => {
    const code = generateTotp('JBSWY3DPEHPK3PXP', Date.now(), 30, 6);
    expect(code.length).toBe(6);
  });

  it('accepts different digit lengths', () => {
    const code8 = generateTotp('JBSWY3DPEHPK3PXP', 59000, 30, 8);
    expect(code8.length).toBe(8);
  });
});
