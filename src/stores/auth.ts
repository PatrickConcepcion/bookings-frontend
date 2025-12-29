import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';
import type {
  User,
  RegisterData,
  LoginData,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  MeResponse,
} from '../types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authInitialized = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<RegisterResponse>('/register', data);
      user.value = response.data.user;
      return response.data;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (data: LoginData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<LoginResponse>('/login', data);
      user.value = response.data.user;
      return response.data;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;
    try {
      await api.post('/logout');
      user.value = null;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Logout failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refresh = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<RefreshResponse>('/refresh');
      return response.data;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Token refresh failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const me = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get<MeResponse>('/me');
      user.value = response.data.user;
      return response.data.user;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user';
      user.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const initAuth = async () => {
    try {
      await me();
    } catch (error) {
      // Clear user state on auth check failure
      user.value = null;
      // Don't redirect here - let the router guard handle it
    } finally {
      authInitialized.value = true;
    }
  };

  return {
    user,
    loading,
    error,
    authInitialized,
    isAuthenticated,
    register,
    login,
    logout,
    refresh,
    me,
    initAuth,
  };
});
