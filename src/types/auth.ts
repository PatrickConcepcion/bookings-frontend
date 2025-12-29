export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface RefreshResponse {
  message: string;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface MeResponse {
  user: User;
}
