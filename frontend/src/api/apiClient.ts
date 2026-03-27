import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: 'https://bot-api.astraviontech.com.br/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user;
  if (user) {
    config.headers['X-USER-ID'] = user.id;
  }
  const adminToken = sessionStorage.getItem('admin_token');
  if (adminToken) {
    config.headers['Authorization'] = `Bearer ${adminToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('admin_token');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
