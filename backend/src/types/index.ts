import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateChallengeDTO {
  propFirmId: string;
  identifier?: string;
  accountSize: number;
  purchasePrice: number;
  status: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface UpdateChallengeDTO {
  propFirmId?: string;
  identifier?: string;
  accountSize?: number;
  purchasePrice?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface CreatePayoutDTO {
  challengeId?: string;
  propFirmId?: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface UpdatePayoutDTO {
  challengeId?: string;
  propFirmId?: string;
  amount?: number;
  date?: string;
  notes?: string;
}

export interface CreatePropFirmDTO {
  name: string;
}
