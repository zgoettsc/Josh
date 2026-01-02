// Core data types for the Family Budget App

export interface User {
  id: string;
  email: string;
  displayName: string;
  householdId: string | null;
  alertPreferences: AlertPreferences;
  createdAt: Date;
}

export interface Household {
  id: string;
  name: string;
  code: string;
  memberIds: string[];
  createdAt: Date;
}

export interface Transaction {
  id: string;
  householdId: string;
  accountId: string;
  amount: number;
  date: Date;
  description: string;
  merchantName: string;
  category: CategoryType;
  subcategory?: string;
  isRecurring: boolean;
  recurringId?: string;
  splits?: TransactionSplit[];
  isManual: boolean;
  addedBy?: string;
  plaidTransactionId?: string;
  createdAt: Date;
}

export interface TransactionSplit {
  category: CategoryType;
  amount: number;
  note?: string;
}

export interface Budget {
  id: string;
  householdId: string;
  category: CategoryType;
  limit: number;
  period: BudgetPeriod;
  customPeriodStart?: Date;
  customPeriodEnd?: Date;
  alertThreshold: number; // percentage (0-100)
  isActive: boolean;
  createdAt: Date;
}

export interface RecurringTransaction {
  id: string;
  householdId: string;
  description: string;
  merchantName: string;
  amount: number;
  category: CategoryType;
  frequency: RecurringFrequency;
  nextDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Alert {
  id: string;
  householdId: string;
  type: AlertType;
  category?: CategoryType;
  message: string;
  percentageUsed?: number;
  isRead: boolean;
  createdAt: Date;
}

export interface AlertPreferences {
  enabled: boolean;
  thresholds: number[]; // e.g., [50, 75, 90, 100]
}

export interface Account {
  id: string;
  householdId: string;
  name: string;
  type: AccountType;
  institution: string;
  mask: string; // last 4 digits
  balance: number;
  isDemo: boolean;
  plaidAccountId?: string;
  createdAt: Date;
}

// Enums and union types

export type CategoryType =
  | 'groceries'
  | 'dining'
  | 'transportation'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'subscriptions'
  | 'housing'
  | 'personal'
  | 'gifts'
  | 'income'
  | 'savings'
  | 'other';

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export type AlertType = 'budget_warning' | 'budget_exceeded' | 'unusual_transaction' | 'recurring_due';

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

// Category metadata for display
export const CATEGORIES: Record<CategoryType, { label: string; icon: string; color: string }> = {
  groceries: { label: 'Groceries', icon: '🛒', color: '#4CAF50' },
  dining: { label: 'Dining Out', icon: '🍽️', color: '#FF9800' },
  transportation: { label: 'Transportation', icon: '🚗', color: '#2196F3' },
  utilities: { label: 'Utilities', icon: '💡', color: '#9C27B0' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: '#E91E63' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#00BCD4' },
  healthcare: { label: 'Healthcare', icon: '🏥', color: '#F44336' },
  education: { label: 'Education', icon: '📚', color: '#3F51B5' },
  travel: { label: 'Travel', icon: '✈️', color: '#009688' },
  subscriptions: { label: 'Subscriptions', icon: '📱', color: '#673AB7' },
  housing: { label: 'Housing', icon: '🏠', color: '#795548' },
  personal: { label: 'Personal', icon: '👤', color: '#607D8B' },
  gifts: { label: 'Gifts', icon: '🎁', color: '#FF5722' },
  income: { label: 'Income', icon: '💰', color: '#8BC34A' },
  savings: { label: 'Savings', icon: '🏦', color: '#CDDC39' },
  other: { label: 'Other', icon: '📦', color: '#9E9E9E' },
};

// Dashboard types
export interface SpendingSummary {
  total: number;
  byCategory: Record<CategoryType, number>;
  periodStart: Date;
  periodEnd: Date;
}

export interface PeriodComparison {
  currentPeriod: SpendingSummary;
  previousPeriod: SpendingSummary;
  percentageChange: number;
  categoryChanges: Record<CategoryType, number>;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'safe' | 'warning' | 'danger' | 'exceeded';
}
