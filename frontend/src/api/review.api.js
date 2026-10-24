import axiosInstance from './axiosInstance';

export const createReview = (data) => axiosInstance.post('/reviews', data);

export const getReviews = (params) => axiosInstance.get('/reviews', { params });

export const getReviewById = (id) => axiosInstance.get(`/reviews/${id}`);

export const deleteReview = (id) => axiosInstance.delete(`/reviews/${id}`);

export const explainCode = (data) => axiosInstance.post('/reviews/explain', data);

export const explainReview = (id) => axiosInstance.post(`/reviews/${id}/explain`);

export const getReviewStats = () => axiosInstance.get('/reviews/stats');