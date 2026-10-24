import axiosInstance from './axiosInstance';

export const generateReport = (reviewId) => axiosInstance.post(`/reports/${reviewId}`);

export const getReports = () => axiosInstance.get('/reports');

export const getDownloadUrl = (reportId) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${API_URL}/reports/download/${reportId}`;
};

export const getSettings = () => axiosInstance.get('/settings');

export const updateSettings = (data) => axiosInstance.patch('/settings', data);