export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PropFirm {
  id: string;
  name: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  userId: string;
  propFirmId: string;
  accountSize: number;
  phase: string;
  purchasePrice: number;
  status: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  propFirm?: PropFirm;
  payouts?: Payout[];
}

export interface Payout {
  id: string;
  userId: string;
  challengeId?: string;
  propFirmId?: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  challenge?: Challenge;
  propFirm?: PropFirm;
}

export interface Analytics {
  summary: {
    totalChallenges: number;
    passedChallenges: number;
    failedChallenges: number;
    inProgressChallenges: number;
    totalCosts: number;
    totalEarnings: number;
    profitLoss: number;
    roi: number;
    successRate: number;
  };
  monthlyData: {
    month: string;
    costs: number;
    earnings: number;
    profitLoss: number;
  }[];
}

export interface CreateChallengeDTO {
  propFirmId: string;
  accountSize: number;
  phase: string;
  purchasePrice: number;
  status: string;
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
