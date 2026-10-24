const axios = require('axios');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const logger = require('../utils/logger');

const GITHUB_API = 'https://api.github.com';

const CODE_EXTENSIONS = [
  '.py', '.java', '.c', '.cpp', '.cc', '.h', '.hpp',
  '.js', '.jsx', '.ts', '.tsx', '.go', '.rs', '.php', '.kt', '.swift',
];

const githubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'CodeView-AI',
  };
  if (env.githubToken) {
    headers.Authorization = `Bearer ${env.githubToken}`;
  }
  return headers;
};

const parseRepoUrl = (url) => {
  try {
    const cleaned = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/i);
    if (!match) throw new Error('Invalid format');
    return { owner: match[1], repo: match[2] };
  } catch (err) {
    throw ApiError.badRequest('Invalid GitHub repository URL');
  }
};

const getRepoTree = async (owner, repo) => {
  try {
    const repoRes = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: githubHeaders(),
    });
    const defaultBranch = repoRes.data.default_branch;

    const treeRes = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers: githubHeaders() }
    );
    return treeRes.data.tree || [];
  } catch (err) {
    logger.error(`GitHub repo fetch failed: ${err.message}`);
    if (err.response && err.response.status === 404) {
      throw ApiError.notFound('GitHub repository not found or is private');
    }
    if (err.response && err.response.status === 403) {
      throw ApiError.tooManyRequests('GitHub API rate limit exceeded.');
    }
    throw ApiError.badGateway('Failed to fetch GitHub repository');
  }
};

const getFileContent = async (owner, repo, sha) => {
  const res = await axios.get(
    `${GITHUB_API}/repos/${owner}/${repo}/git/blobs/${sha}`,
    { headers: githubHeaders() }
  );
  const { content, encoding } = res.data;
  if (encoding === 'base64') {
    return Buffer.from(content, 'base64').toString('utf-8');
  }
  return content;
};

const detectLanguageFromPath = (filePath) => {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  const map = {
    '.py': 'python', '.java': 'java', '.c': 'c', '.cpp': 'cpp',
    '.cc': 'cpp', '.h': 'c', '.hpp': 'cpp', '.js': 'javascript',
    '.jsx': 'javascript', '.ts': 'typescript', '.tsx': 'typescript',
    '.go': 'go', '.rs': 'rust', '.php': 'php', '.kt': 'kotlin', '.swift': 'swift',
  };
  return map[ext] || 'plaintext';
};

const listAnalyzableFiles = async (repoUrl, maxFiles = 15) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const tree = await getRepoTree(owner, repo);

  const files = tree
    .filter((item) => item.type === 'blob')
    .filter((item) => CODE_EXTENSIONS.some((ext) => item.path.toLowerCase().endsWith(ext)))
    .filter((item) => item.size && item.size < 100000)
    .slice(0, maxFiles)
    .map((item) => ({
      path: item.path,
      sha: item.sha,
      size: item.size,
      language: detectLanguageFromPath(item.path),
    }));

  return { owner, repo, files };
};

module.exports = {
  parseRepoUrl,
  getRepoTree,
  getFileContent,
  detectLanguageFromPath,
  listAnalyzableFiles,
};