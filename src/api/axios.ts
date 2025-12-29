import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Required for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Endpoints that should NOT trigger token refresh
const AUTH_ENDPOINTS = ['/login', '/register', '/refresh', '/me', '/logout'];

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
    const requestUrl = originalRequest.url || '';

    // Check if this is an auth-related endpoint that shouldn't trigger refresh
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => requestUrl.includes(endpoint));

    // Don't retry for auth endpoints or if already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await api.post('/refresh');

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth state
        const { useAuthStore } = await import('../stores/auth');
        const authStore = useAuthStore();
        authStore.user = null;

        // Only redirect if not on auth pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          router.push('/login');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
