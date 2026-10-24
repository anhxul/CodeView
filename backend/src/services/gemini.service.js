const { callAI } = require('../config/gemini');
const { buildReviewPrompt, buildChatSystemPrompt, buildExplainPrompt } = require('../prompts/reviewPrompt');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const stripCodeFences = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '');
    cleaned = cleaned.replace(/```\s*$/, '');
  }
  return cleaned.trim();
};

const REQUIRED_REVIEW_KEYS = [
  'overallScore', 'summary', 'bugs', 'securityIssues',
  'performanceIssues', 'readabilityIssues', 'maintainability',
  'bestPractices', 'refactoredCode', 'alternativeApproach',
  'interviewQuestions', 'learningResources', 'complexity',
];

const validateReviewShape = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  return REQUIRED_REVIEW_KEYS.every((key) => Object.prototype.hasOwnProperty.call(obj, key));
};

const reviewCode = async (code, language) => {
  const prompt = buildReviewPrompt(code, language);
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawText = await callAI(prompt, true);
      const cleaned = stripCodeFences(rawText);

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        logger.warn(`JSON parse failed (attempt ${attempt}): ${parseErr.message}`);
        lastError = parseErr;
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      if (!validateReviewShape(parsed)) {
        logger.warn(`Incomplete response (attempt ${attempt})`);
        lastError = new Error('Incomplete review JSON');
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      parsed.overallScore = Math.max(0, Math.min(100, Number(parsed.overallScore) || 0));
      if (parsed.maintainability) {
        parsed.maintainability.score = Math.max(0, Math.min(100, Number(parsed.maintainability.score) || 0));
      }

      return parsed;
    } catch (err) {
      logger.error(`AI error (attempt ${attempt}): ${err.message}`);
      lastError = err;
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  throw ApiError.badGateway(`AI review failed: ${lastError?.message}`);
};

const chatWithAI = async (history, userMessage, codeContext = {}) => {
  const systemPrompt = buildChatSystemPrompt(codeContext);
  const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callAI(fullPrompt, false);
    } catch (err) {
      logger.error(`Chat error (attempt ${attempt}): ${err.message}`);
      lastError = err;
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  throw ApiError.badGateway(`AI chat failed: ${lastError?.message}`);
};

const explainCode = async (code, language) => {
  const prompt = buildExplainPrompt(code, language);
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callAI(prompt, false);
    } catch (err) {
      logger.error(`Explain error (attempt ${attempt}): ${err.message}`);
      lastError = err;
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  throw ApiError.badGateway(`AI explanation failed: ${lastError?.message}`);
};

module.exports = { reviewCode, chatWithAI, explainCode };