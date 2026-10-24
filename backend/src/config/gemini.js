const axios = require('axios');
const env = require('./env');

const callAI = async (prompt, jsonMode = false) => {
  const dns = require('dns');
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: env.geminiModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 8192,
      response_format: jsonMode ? { type: 'json_object' } : undefined,
    },
    {
      headers: {
        Authorization: `Bearer ${env.geminiApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
};

const getGeminiModel = () => ({
  generateContent: (prompt) => callAI(prompt, true),
});

const getGeminiChatModel = () => ({
  generateContent: (prompt) => callAI(prompt, false),
});

module.exports = { getGeminiModel, getGeminiChatModel, callAI };