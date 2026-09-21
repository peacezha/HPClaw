const crypto = require('node:crypto');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function decodeBase32(secret) {
  let bits = '';
  const cleaned = secret.toUpperCase().replace(/=|\s/g, '');
  for (const char of cleaned) {
    const value = alphabet.indexOf(char);
    if (value < 0) throw new Error(`Invalid Base32 character: ${char}`);
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let offset = 0; offset + 8 <= bits.length; offset += 8) {
    bytes.push(parseInt(bits.slice(offset, offset + 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTotp(secret, timestamp = Date.now(), period = 30, digits = 6) {
  const counter = BigInt(Math.floor(timestamp / 1000 / period));
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(counter);
  const key = decodeBase32(secret);
  const digest = crypto.createHmac('sha1', key).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = digest.readUInt32BE(offset) & 0x7fffffff;
  return String(binary % (10 ** digits)).padStart(digits, '0');
}

module.exports = { generateTotp, decodeBase32 };
