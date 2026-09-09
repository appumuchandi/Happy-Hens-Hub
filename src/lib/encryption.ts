
import crypto from 'crypto';

/**
 * @fileOverview Encryption utilities for protecting sensitive API keys.
 */

const ALGORITHM = 'aes-256-cbc';
// Use a fixed key derived from environment or a fallback. 
// In production, ENCRYPTION_KEY should be a 32-character string in .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'poultry-manager-standard-secret-32-chars';
const IV_LENGTH = 16;

/**
 * Encrypts a string using AES-256-CBC.
 */
export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts a string. If decryption fails, it returns the original text 
 * (to support legacy plain-text values).
 */
export function decrypt(text: string): string {
  if (!text || !text.includes(':')) return text;
  
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // If decryption fails, assume it's already plain text (fallback)
    return text;
  }
}
