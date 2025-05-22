import crypto from 'crypto';

// Use a consistent key for both client and server
const SECRET = process.env.ENCRYPTION_KEY || 'your-secure-encryption-key-32-bytes-long!';

// Always use a 32-byte key for AES-256
const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET).digest(); // 32 bytes
const IV_LENGTH = 16; // AES-CBC requires 16-byte IV

// URL-safe base64 encoding/decoding
const urlSafeEncode = (str: string) => str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
const urlSafeDecode = (str: string) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return str;
};

// Encrypt text → returns URL-safe base64
export const encrypt = (text: string): string => {
  try {
    if (!text) {
      throw new Error('Text to encrypt cannot be empty');
    }

    // Generate a random IV
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with the key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Combine IV and encrypted data with URL-safe encoding
    const result = urlSafeEncode(iv.toString('base64')) + '.' + urlSafeEncode(encrypted);
    
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// Decrypt URL-safe base64 → returns utf8 string
export const decrypt = (encryptedData: string): string => {
  try {
    if (!encryptedData) {
      throw new Error('Encrypted data cannot be empty');
    }

    // Split IV and encrypted data
    const [ivBase64, encryptedBase64] = encryptedData.split('.');
    
    if (!ivBase64 || !encryptedBase64) {
      throw new Error('Invalid encrypted data format');
    }

    // Convert IV from base64
    const iv = Buffer.from(urlSafeDecode(ivBase64), 'base64');
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    // Decrypt the data
    let decrypted = decipher.update(urlSafeDecode(encryptedBase64), 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};
