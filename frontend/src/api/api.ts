import axios from 'axios';
import type {
  AuthResponse,
  User,
  Challenge,
  Payout,
  PropFirm,
  Analytics,
  CreateChallengeDTO,
  CreatePayoutDTO,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const challengeAPI = {
  getAll: (params?: { status?: string; propFirmId?: string; sortBy?: string; order?: string }) =>
    api.get<Challenge[]>('/challenges', { params }),

  getById: (id: string) =>
    api.get<Challenge>(`/challenges/${id}`),

  create: (data: CreateChallengeDTO) =>
    api.post<Challenge>('/challenges', data),

  update: (id: string, data: Partial<CreateChallengeDTO>) =>
    api.put<Challenge>(`/challenges/${id}`, data),

  delete: (id: string) =>
    api.delete(`/challenges/${id}`),
};

export const payoutAPI = {
  getAll: (params?: { challengeId?: string; propFirmId?: string; sortBy?: string; order?: string }) =>
    api.get<Payout[]>('/payouts', { params }),

  getById: (id: string) =>
    api.get<Payout>(`/payouts/${id}`),

  create: (data: CreatePayoutDTO) =>
    api.post<Payout>('/payouts', data),

  update: (id: string, data: Partial<CreatePayoutDTO>) =>
    api.put<Payout>(`/payouts/${id}`, data),

  delete: (id: string) =>
    api.delete(`/payouts/${id}`),
};

export const propFirmAPI = {
  getAll: () =>
    api.get<PropFirm[]>('/propfirms'),

  create: (name: string) =>
    api.post<PropFirm>('/propfirms', { name }),
};

export const analyticsAPI = {
  get: () =>
    api.get<Analytics>('/analytics'),
};

export const exportAPI = {
  exportChallenges: () =>
    api.get('/export/challenges', { responseType: 'blob' }),

  exportPayouts: () =>
    api.get('/export/payouts', { responseType: 'blob' }),

  importChallenges: (csvData: string) =>
    api.post('/export/challenges', { csvData }),

  importPayouts: (csvData: string) =>
    api.post('/export/payouts', { csvData }),
};

export default api;
