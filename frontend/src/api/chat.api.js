import axiosInstance from './axiosInstance';

export const sendMessage = (data) => axiosInstance.post('/chat', data);

export const getChats = () => axiosInstance.get('/chat');

export const getChatById = (chatId) => axiosInstance.get(`/chat/${chatId}`);

export const deleteChat = (chatId) => axiosInstance.delete(`/chat/${chatId}`);