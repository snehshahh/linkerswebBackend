// utils/encrypt.js
const crypto = require('crypto');
const { ENCRYPTION_KEY, IV } = require('../config/encryption');

function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

module.exports = encrypt;
