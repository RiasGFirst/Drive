const crypto = require('crypto');

const generateRandomKey = () => crypto.randomBytes(32).toString('hex');

const token_secret = generateRandomKey();
const session_secret = generateRandomKey();

module.exports = {token_secret, session_secret}