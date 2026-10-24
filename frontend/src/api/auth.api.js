import axiosInstance from './axiosInstance';

export const signup = (data) => axiosInstance.post('/auth/signup', data);

export const login = (data) => axiosInstance.post('/auth/login', data);

export const logout = () => axiosInstance.post('/auth/logout');

export const getMe = () => axiosInstance.get('/auth/me');

export const updateProfile = (data) => axiosInstance.patch('/auth/profile', data);

export const changePassword = (data) => axiosInstance.patch('/auth/change-password', data);

export const deleteAccount = () => axiosInstance.delete('/auth/account');