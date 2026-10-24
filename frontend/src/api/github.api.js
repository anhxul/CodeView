import axiosInstance from './axiosInstance';

export const listRepoFiles = (repoUrl) => axiosInstance.post('/github/files', { repoUrl });

export const analyzeRepoFile = (data) => axiosInstance.post('/github/analyze', data);