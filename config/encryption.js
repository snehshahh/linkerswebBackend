// config/encryption.js
require('dotenv').config(); // Ensure environment variables are loaded

module.exports = {
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  IV: process.env.IV
};
