const buildReviewPrompt = (code, language) => `
You are an expert code reviewer. Analyze this ${language} code thoroughly.

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "overallScore": <0-100>,
  "summary": "<2-3 sentence assessment>",
  "bugs": [{"title": "", "description": "", "severity": "high|medium|low", "fix": ""}],
  "securityIssues": [{"title": "", "description": "", "severity": "high|medium|low", "fix": ""}],
  "performanceIssues": [{"title": "", "description": "", "fix": ""}],
  "readabilityIssues": [{"title": "", "description": "", "fix": ""}],
  "maintainability": {"score": <0-100>, "comments": ""},
  "bestPractices": [""],
  "refactoredCode": "<improved version of the code>",
  "alternativeApproach": {"description": "", "code": ""},
  "interviewQuestions": [{"question": "", "answer": ""}],
  "learningResources": [{"title": "", "url": "", "description": ""}],
  "complexity": {"time": "", "space": "", "explanation": ""}
}

Code to review:
${code}
`;

const buildChatSystemPrompt = ({ code, language, reviewSummary } = {}) => `
You are an expert code reviewer AI assistant.
${code ? `Current code (${language}):\n${code}` : ''}
${reviewSummary ? `Review summary: ${reviewSummary}` : ''}
Help the user understand their code, fix bugs, and improve quality.
`;

const buildExplainPrompt = (code, language) => {
  return `You are an expert programming teacher. Explain the following ${language} code in a clear, structured, and beginner-friendly way.

\`\`\`${language}
${code}
\`\`\`

Your explanation MUST follow this exact structure using proper Markdown:

## 📌 Overview
Write 2-3 sentences explaining what this code does overall.

## 🔍 Line-by-Line Breakdown

For each line or logical block, explain:
- What it does
- Why it's written that way
- Any important concept it demonstrates

Use this format:
\`\`\`
Line X: <actual code>
\`\`\`
**Explanation:** Clear explanation here.

## 🏃 Dry Run (Step-by-Step Execution)

Simulate the code running step by step with actual values. Show what happens at each step like this:

**Step 1:** ...
**Step 2:** ...
**Output:** ...

## 💡 Example with Different Input

Show the same code running with a different example input and what the output would be.

## 🧠 Key Concepts Used
List the programming concepts demonstrated in this code as bullet points with brief explanations.

## ⚡ Quick Recap
Summarize in 3-4 bullet points what this code does.

IMPORTANT: Use proper Markdown formatting. Use code blocks for code. Use bold for important terms. Be beginner-friendly but thorough.`;
};

module.exports = { buildReviewPrompt, buildChatSystemPrompt, buildExplainPrompt };