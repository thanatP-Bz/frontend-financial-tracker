import api from './axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const login = (data: LoginCredentials) =>
  api.post<AuthResponse>('/auth/login', data).then((res) => res.data);

export const register = (data: RegisterCredentials) =>
  api.post<AuthResponse>('/auth/register', data).then((res) => res.data);

export const logout = () => api.post('/auth/logout');
