import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subWeeks, subYears } from 'date-fns';
import {
  Transaction,
  Budget,
  Account,
  RecurringTransaction,
  Alert,
  CategoryType,
  SpendingSummary,
  PeriodComparison,
  BudgetProgress,
  BudgetPeriod,
  TransactionSplit,
} from '../types';
import { useAuth } from './AuthContext';
import {
  demoTransactions,
  demoBudgets,
  demoAccounts,
  demoRecurringTransactions,
  demoAlerts,
  generateDemoAlerts,
} from '../services/demoData';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  transactions: Transaction[];
  budgets: Budget[];
  accounts: Account[];
  recurringTransactions: RecurringTransaction[];
  alerts: Alert[];
  loading: boolean;

  // Period management
  currentPeriod: BudgetPeriod;
  setCurrentPeriod: (period: BudgetPeriod) => void;
  customPeriodStart: Date | null;
  customPeriodEnd: Date | null;
  setCustomPeriod: (start: Date, end: Date) => void;

  // Computed data
  getSpendingSummary: (period?: BudgetPeriod) => SpendingSummary;
  getPeriodComparison: () => PeriodComparison;
  getBudgetProgress: () => BudgetProgress[];
  getTransactionsForPeriod: (start: Date, end: Date) => Transaction[];

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'householdId' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  splitTransaction: (id: string, splits: TransactionSplit[]) => void;

  addBudget: (budget: Omit<Budget, 'id' | 'householdId' | 'createdAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { household, isDemo } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPeriod, setCurrentPeriod] = useState<BudgetPeriod>('monthly');
  const [customPeriodStart, setCustomPeriodStart] = useState<Date | null>(null);
  const [customPeriodEnd, setCustomPeriodEnd] = useState<Date | null>(null);

  // Load data when household changes
  useEffect(() => {
    if (household) {
      if (isDemo) {
        // Load demo data
        setTransactions(demoTransactions);
        setBudgets(demoBudgets);
        setAccounts(demoAccounts);
        setRecurringTransactions(demoRecurringTransactions);
        setAlerts(demoAlerts);
      } else {
        // In a real app, we'd fetch from Firestore
        setTransactions([]);
        setBudgets([]);
        setAccounts([]);
        setRecurringTransactions([]);
        setAlerts([]);
      }
      setLoading(false);
    }
  }, [household, isDemo]);

  // Get period date range
  const getPeriodRange = useCallback((period: BudgetPeriod = currentPeriod): { start: Date; end: Date } => {
    const now = new Date();
    switch (period) {
      case 'weekly':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'monthly':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'yearly':
        return { start: startOfYear(now), end: endOfYear(now) };
      case 'custom':
        return {
          start: customPeriodStart || startOfMonth(now),
          end: customPeriodEnd || endOfMonth(now),
        };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [currentPeriod, customPeriodStart, customPeriodEnd]);

  // Get previous period range
  const getPreviousPeriodRange = useCallback((period: BudgetPeriod = currentPeriod): { start: Date; end: Date } => {
    const now = new Date();
    switch (period) {
      case 'weekly':
        const prevWeek = subWeeks(now, 1);
        return { start: startOfWeek(prevWeek), end: endOfWeek(prevWeek) };
      case 'monthly':
        const prevMonth = subMonths(now, 1);
        return { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
      case 'yearly':
        const prevYear = subYears(now, 1);
        return { start: startOfYear(prevYear), end: endOfYear(prevYear) };
      case 'custom':
        // For custom, show the same duration before the custom period
        if (customPeriodStart && customPeriodEnd) {
          const duration = customPeriodEnd.getTime() - customPeriodStart.getTime();
          return {
            start: new Date(customPeriodStart.getTime() - duration),
            end: new Date(customPeriodStart.getTime() - 1),
          };
        }
        const defaultPrev = subMonths(now, 1);
        return { start: startOfMonth(defaultPrev), end: endOfMonth(defaultPrev) };
      default:
        const defaultPrevMonth = subMonths(now, 1);
        return { start: startOfMonth(defaultPrevMonth), end: endOfMonth(defaultPrevMonth) };
    }
  }, [currentPeriod, customPeriodStart, customPeriodEnd]);

  const setCustomPeriod = (start: Date, end: Date) => {
    setCustomPeriodStart(start);
    setCustomPeriodEnd(end);
    setCurrentPeriod('custom');
  };

  const getTransactionsForPeriod = useCallback((start: Date, end: Date): Transaction[] => {
    return transactions.filter((t) => t.date >= start && t.date <= end);
  }, [transactions]);

  const getSpendingSummary = useCallback((period?: BudgetPeriod): SpendingSummary => {
    const { start, end } = getPeriodRange(period);
    const periodTransactions = getTransactionsForPeriod(start, end);

    const byCategory: Record<CategoryType, number> = {} as Record<CategoryType, number>;
    let total = 0;

    periodTransactions.forEach((t) => {
      if (t.amount < 0) { // Only count expenses
        const amount = Math.abs(t.amount);

        if (t.splits && t.splits.length > 0) {
          // Handle split transactions
          t.splits.forEach((split) => {
            byCategory[split.category] = (byCategory[split.category] || 0) + split.amount;
            total += split.amount;
          });
        } else {
          byCategory[t.category] = (byCategory[t.category] || 0) + amount;
          total += amount;
        }
      }
    });

    return {
      total,
      byCategory,
      periodStart: start,
      periodEnd: end,
    };
  }, [getPeriodRange, getTransactionsForPeriod]);

  const getPeriodComparison = useCallback((): PeriodComparison => {
    const current = getSpendingSummary(currentPeriod);

    const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(currentPeriod);
    const prevTransactions = getTransactionsForPeriod(prevStart, prevEnd);

    const prevByCategory: Record<CategoryType, number> = {} as Record<CategoryType, number>;
    let prevTotal = 0;

    prevTransactions.forEach((t) => {
      if (t.amount < 0) {
        const amount = Math.abs(t.amount);
        if (t.splits && t.splits.length > 0) {
          t.splits.forEach((split) => {
            prevByCategory[split.category] = (prevByCategory[split.category] || 0) + split.amount;
            prevTotal += split.amount;
          });
        } else {
          prevByCategory[t.category] = (prevByCategory[t.category] || 0) + amount;
          prevTotal += amount;
        }
      }
    });

    const previous: SpendingSummary = {
      total: prevTotal,
      byCategory: prevByCategory,
      periodStart: prevStart,
      periodEnd: prevEnd,
    };

    const percentageChange = prevTotal > 0
      ? ((current.total - prevTotal) / prevTotal) * 100
      : 0;

    const categoryChanges: Record<CategoryType, number> = {} as Record<CategoryType, number>;
    const allCategories = new Set([
      ...Object.keys(current.byCategory),
      ...Object.keys(previous.byCategory),
    ]) as Set<CategoryType>;

    allCategories.forEach((category) => {
      const curr = current.byCategory[category] || 0;
      const prev = previous.byCategory[category] || 0;
      categoryChanges[category] = prev > 0 ? ((curr - prev) / prev) * 100 : (curr > 0 ? 100 : 0);
    });

    return {
      currentPeriod: current,
      previousPeriod: previous,
      percentageChange,
      categoryChanges,
    };
  }, [currentPeriod, getSpendingSummary, getPreviousPeriodRange, getTransactionsForPeriod]);

  const getBudgetProgress = useCallback((): BudgetProgress[] => {
    const summary = getSpendingSummary(currentPeriod);

    return budgets
      .filter((b) => b.isActive && b.period === currentPeriod)
      .map((budget) => {
        const spent = summary.byCategory[budget.category] || 0;
        const remaining = Math.max(0, budget.limit - spent);
        const percentageUsed = (spent / budget.limit) * 100;

        let status: 'safe' | 'warning' | 'danger' | 'exceeded';
        if (percentageUsed >= 100) {
          status = 'exceeded';
        } else if (percentageUsed >= 90) {
          status = 'danger';
        } else if (percentageUsed >= budget.alertThreshold) {
          status = 'warning';
        } else {
          status = 'safe';
        }

        return {
          budget,
          spent,
          remaining,
          percentageUsed,
          status,
        };
      })
      .sort((a, b) => b.percentageUsed - a.percentageUsed);
  }, [budgets, currentPeriod, getSpendingSummary]);

  // Transaction actions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'householdId' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      householdId: household?.id || '',
      createdAt: new Date(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Regenerate alerts
    setAlerts(generateDemoAlerts([newTransaction, ...transactions], budgets));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const splitTransaction = (id: string, splits: TransactionSplit[]) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, splits } : t))
    );
  };

  // Budget actions
  const addBudget = (budget: Omit<Budget, 'id' | 'householdId' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: uuidv4(),
      householdId: household?.id || '',
      createdAt: new Date(),
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Alert actions
  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const clearAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const value: DataContextType = {
    transactions,
    budgets,
    accounts,
    recurringTransactions,
    alerts,
    loading,
    currentPeriod,
    setCurrentPeriod,
    customPeriodStart,
    customPeriodEnd,
    setCustomPeriod,
    getSpendingSummary,
    getPeriodComparison,
    getBudgetProgress,
    getTransactionsForPeriod,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    splitTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    markAlertRead,
    clearAlerts,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
