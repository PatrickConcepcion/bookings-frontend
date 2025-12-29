import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await api.post('/refresh');

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }

    // If this was a refresh request that failed, redirect to login
    if (error.response?.status === 401 && originalRequest.url?.includes('/refresh')) {
      router.push('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
