/**
 * DEV TOOLS - DEVELOPMENT ENVIRONMENT ONLY
 * These utilities are for creating mock payouts for marketing/demo purposes.
 * They should NEVER be used in production.
 */

import {
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  console.warn('[DevTools] devTools.ts was loaded in production — this should not happen.');
}

export interface MockScenarioConfig {
  label: string;
  description: string;
  amountOwed: number;
  profitSplit: number;
  status: 'pending' | 'approved' | 'completed';
  paymentMethod?: 'usdc_solana' | 'usdt_trc20';
  walletAddress?: string;
  transactionHash?: string;
  submitted?: boolean;
  badge?: string;
  badgeColor?: string;
}

export const MOCK_SCENARIOS: Record<string, MockScenarioConfig> = {
  'completed-xl': {
    label: 'XL Win — Completed',
    description: '$100k profit, 80% split',
    badge: '$80,000',
    badgeColor: '#0FF1CE',
    amountOwed: 100000,
    profitSplit: 80,
    status: 'completed',
    paymentMethod: 'usdc_solana',
    walletAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J',
    transactionHash: '5GvF9VmRCPQKstpJvDdJrQ8m4ZLqpZNKkqXKk7bFGGPWwi8yRaqNmDsGxqJvZ8kHYmEbTpK',
  },
  'completed-big': {
    label: 'Big Win — Completed',
    description: '$50k profit, 80% split',
    badge: '$40,000',
    badgeColor: '#0FF1CE',
    amountOwed: 50000,
    profitSplit: 80,
    status: 'completed',
    paymentMethod: 'usdc_solana',
    walletAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J',
    transactionHash: '3kJvP9aLNxQmzC7TrMwXpF2dKsY8HuRfVgEqNbDjAiW5nMoSzRsGqXpEj9LrK1xBvPqW2',
  },
  'completed-medium': {
    label: 'Medium Win — Completed',
    description: '$12.5k profit, 80% split',
    badge: '$10,000',
    badgeColor: '#0FF1CE',
    amountOwed: 12500,
    profitSplit: 80,
    status: 'completed',
    paymentMethod: 'usdc_solana',
    walletAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J',
    transactionHash: '4mNsK7bVwPyLqXaRcTgJoF3eHiY1UzBdEnCvMtDjAkW6pLrQzGsNxEpFh8MsO2vRu',
  },
  'completed-small': {
    label: 'First Win — Completed',
    description: '$3.125k profit, 80% split',
    badge: '$2,500',
    badgeColor: '#0FF1CE',
    amountOwed: 3125,
    profitSplit: 80,
    status: 'completed',
    paymentMethod: 'usdc_solana',
    walletAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J',
    transactionHash: '2pQrM8cXwUyNsAbTdHkLe5fGjZ0ViBfFoCwNuEkDmWs7qKtPyHvJzBiGl9NaP3wIj',
  },
  'approved': {
    label: 'Approved — Pending Transfer',
    description: '$10k profit, 80% split',
    badge: '$8,000',
    badgeColor: '#60a5fa',
    amountOwed: 10000,
    profitSplit: 80,
    status: 'approved',
    paymentMethod: 'usdc_solana',
    walletAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J',
    submitted: true,
  },
  'submitted': {
    label: 'Submitted — Under Review',
    description: '$6.25k profit, 80% split',
    badge: '$5,000',
    badgeColor: '#facc15',
    amountOwed: 6250,
    profitSplit: 80,
    status: 'pending',
    paymentMethod: 'usdc_solana',
    walletAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J',
    submitted: true,
  },
  'pending': {
    label: 'Pending — Awaiting Details',
    description: '$5k profit, 80% split',
    badge: '$4,000',
    badgeColor: '#facc15',
    amountOwed: 5000,
    profitSplit: 80,
    status: 'pending',
  },
};

export interface CreateMockPayoutOptions {
  scenarioKey?: string;
  amountOwed?: number;
  profitSplit?: number;
  status?: 'pending' | 'approved' | 'completed';
  paymentMethod?: 'usdc_solana' | 'usdt_trc20';
  walletAddress?: string;
  transactionHash?: string;
  submitted?: boolean;
}

/**
 * Creates or overwrites a mock withdrawal request in Firestore.
 * The document is tagged with `_isMockDev: true` for easy identification.
 * DEV ENVIRONMENT ONLY.
 */
export async function createMockPayout(
  userId: string,
  userEmail: string,
  options: CreateMockPayoutOptions = {}
): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[DevTools] createMockPayout cannot be called in production.');
  }

  const scenario = options.scenarioKey ? MOCK_SCENARIOS[options.scenarioKey] : null;

  const amountOwed = options.amountOwed ?? scenario?.amountOwed ?? 10000;
  const profitSplit = options.profitSplit ?? scenario?.profitSplit ?? 80;
  const payoutAmount = (amountOwed * profitSplit) / 100;
  const status = options.status ?? scenario?.status ?? 'completed';
  const paymentMethod = options.paymentMethod ?? scenario?.paymentMethod ?? 'usdc_solana';
  const walletAddress = options.walletAddress ?? scenario?.walletAddress;
  const transactionHash = options.transactionHash ?? scenario?.transactionHash;
  const submitted = options.submitted ?? scenario?.submitted ?? (status !== 'pending');

  const now = Timestamp.now();

  const data: Record<string, unknown> = {
    userId,
    userEmail,
    status,
    amountOwed,
    profitSplit,
    payoutAmount,
    paymentMethod,
    enabledAt: now,
    enabledBy: 'dev-tools',
    createdAt: now,
    updatedAt: now,
    _isMockDev: true,
  };

  if (walletAddress) {
    data.walletAddress = walletAddress;
  }

  if (submitted && walletAddress) {
    data.submittedAt = now;
  }

  if (status === 'approved' || status === 'completed') {
    data.reviewedAt = now;
    data.reviewedBy = 'dev-tools';
  }

  if (status === 'completed' && transactionHash) {
    data.transactionHash = transactionHash;
  }

  const withdrawalRef = doc(db, 'withdrawalRequests', userId);
  await setDoc(withdrawalRef, data);
}

/**
 * Deletes a mock withdrawal request from Firestore.
 * Only removes documents tagged with `_isMockDev: true`.
 * DEV ENVIRONMENT ONLY.
 */
export async function deleteMockPayout(userId: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[DevTools] deleteMockPayout cannot be called in production.');
  }

  const withdrawalRef = doc(db, 'withdrawalRequests', userId);
  await deleteDoc(withdrawalRef);
}
