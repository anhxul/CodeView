require('dotenv').config();
const { callAI } = require('./src/config/gemini');

callAI('Say hello', false)
  .then(r => console.log('SUCCESS:', r))
  .catch(e => console.error('ERROR:', e.response?.data || e.message));