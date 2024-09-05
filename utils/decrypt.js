// utils/decrypt.js
const crypto = require('crypto');
const { ENCRYPTION_KEY, IV } = require('../config/encryption');

function decrypt(text) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = decrypt;
