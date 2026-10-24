import axiosInstance from './axiosInstance';

export const getHistory = (params) => axiosInstance.get('/history', { params });