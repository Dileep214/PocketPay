import apiClient from './apiClient';

export const authService = {
  register: async (payload) => {
    return await apiClient.post('/auth/register', payload);
  },

  login: async (payload) => {
    return await apiClient.post('/auth/login', payload);
  },

  getMe: async () => {
    return await apiClient.get('/auth/me');
  }
};
