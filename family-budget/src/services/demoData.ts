import { v4 as uuidv4 } from 'uuid';
import { subDays, subMonths, addDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  Transaction,
  Budget,
  Account,
  RecurringTransaction,
  CategoryType,
  Household,
  User,
  Alert,
} from '../types';

const DEMO_HOUSEHOLD_ID = 'demo-household-001';
const DEMO_USER_ID = 'demo-user-001';

// Demo accounts
export const demoAccounts: Account[] = [
  {
    id: 'acc-1',
    householdId: DEMO_HOUSEHOLD_ID,
    name: 'Main Checking',
    type: 'checking',
    institution: 'Chase Bank',
    mask: '4521',
    balance: 5432.18,
    isDemo: true,
    createdAt: new Date(),
  },
  {
    id: 'acc-2',
    householdId: DEMO_HOUSEHOLD_ID,
    name: 'Savings Account',
    type: 'savings',
    institution: 'Chase Bank',
    mask: '7892',
    balance: 12500.00,
    isDemo: true,
    createdAt: new Date(),
  },
  {
    id: 'acc-3',
    householdId: DEMO_HOUSEHOLD_ID,
    name: 'Credit Card',
    type: 'credit',
    institution: 'American Express',
    mask: '1004',
    balance: -1847.32,
    isDemo: true,
    createdAt: new Date(),
  },
];

// Demo recurring transactions
export const demoRecurringTransactions: RecurringTransaction[] = [
  {
    id: 'rec-1',
    householdId: DEMO_HOUSEHOLD_ID,
    description: 'Netflix Subscription',
    merchantName: 'Netflix',
    amount: 15.99,
    category: 'subscriptions',
    frequency: 'monthly',
    nextDate: addDays(new Date(), 12),
    isActive: true,
    createdAt: subMonths(new Date(), 6),
  },
  {
    id: 'rec-2',
    householdId: DEMO_HOUSEHOLD_ID,
    description: 'Spotify Family',
    merchantName: 'Spotify',
    amount: 16.99,
    category: 'subscriptions',
    frequency: 'monthly',
    nextDate: addDays(new Date(), 5),
    isActive: true,
    createdAt: subMonths(new Date(), 12),
  },
  {
    id: 'rec-3',
    householdId: DEMO_HOUSEHOLD_ID,
    description: 'Electric Bill',
    merchantName: 'City Power Co',
    amount: 145.00,
    category: 'utilities',
    frequency: 'monthly',
    nextDate: addDays(new Date(), 18),
    isActive: true,
    createdAt: subMonths(new Date(), 24),
  },
  {
    id: 'rec-4',
    householdId: DEMO_HOUSEHOLD_ID,
    description: 'Internet Service',
    merchantName: 'Xfinity',
    amount: 79.99,
    category: 'utilities',
    frequency: 'monthly',
    nextDate: addDays(new Date(), 8),
    isActive: true,
    createdAt: subMonths(new Date(), 18),
  },
  {
    id: 'rec-5',
    householdId: DEMO_HOUSEHOLD_ID,
    description: 'Gym Membership',
    merchantName: 'Planet Fitness',
    amount: 24.99,
    category: 'healthcare',
    frequency: 'monthly',
    nextDate: addDays(new Date(), 1),
    isActive: true,
    createdAt: subMonths(new Date(), 8),
  },
];

// Demo budgets
export const demoBudgets: Budget[] = [
  {
    id: 'budget-1',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'groceries',
    limit: 800,
    period: 'monthly',
    alertThreshold: 80,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
  {
    id: 'budget-2',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'dining',
    limit: 400,
    period: 'monthly',
    alertThreshold: 75,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
  {
    id: 'budget-3',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'entertainment',
    limit: 200,
    period: 'monthly',
    alertThreshold: 80,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
  {
    id: 'budget-4',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'transportation',
    limit: 350,
    period: 'monthly',
    alertThreshold: 85,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
  {
    id: 'budget-5',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'shopping',
    limit: 300,
    period: 'monthly',
    alertThreshold: 80,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
  {
    id: 'budget-6',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'utilities',
    limit: 400,
    period: 'monthly',
    alertThreshold: 90,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
  {
    id: 'budget-7',
    householdId: DEMO_HOUSEHOLD_ID,
    category: 'subscriptions',
    limit: 100,
    period: 'monthly',
    alertThreshold: 90,
    isActive: true,
    createdAt: subMonths(new Date(), 3),
  },
];

// Transaction templates for generating realistic data
const transactionTemplates: Array<{
  merchantName: string;
  category: CategoryType;
  minAmount: number;
  maxAmount: number;
  frequency: number; // times per month on average
}> = [
  // Groceries
  { merchantName: 'Whole Foods', category: 'groceries', minAmount: 45, maxAmount: 180, frequency: 4 },
  { merchantName: 'Trader Joe\'s', category: 'groceries', minAmount: 35, maxAmount: 120, frequency: 3 },
  { merchantName: 'Costco', category: 'groceries', minAmount: 150, maxAmount: 350, frequency: 2 },
  { merchantName: 'Target', category: 'groceries', minAmount: 25, maxAmount: 80, frequency: 2 },

  // Dining
  { merchantName: 'Starbucks', category: 'dining', minAmount: 5, maxAmount: 15, frequency: 8 },
  { merchantName: 'Chipotle', category: 'dining', minAmount: 12, maxAmount: 25, frequency: 4 },
  { merchantName: 'Local Restaurant', category: 'dining', minAmount: 40, maxAmount: 120, frequency: 3 },
  { merchantName: 'DoorDash', category: 'dining', minAmount: 25, maxAmount: 60, frequency: 3 },
  { merchantName: 'Pizza Hut', category: 'dining', minAmount: 20, maxAmount: 45, frequency: 2 },

  // Transportation
  { merchantName: 'Shell Gas Station', category: 'transportation', minAmount: 35, maxAmount: 70, frequency: 4 },
  { merchantName: 'Uber', category: 'transportation', minAmount: 12, maxAmount: 35, frequency: 3 },
  { merchantName: 'Parking', category: 'transportation', minAmount: 5, maxAmount: 25, frequency: 4 },

  // Entertainment
  { merchantName: 'AMC Theaters', category: 'entertainment', minAmount: 25, maxAmount: 50, frequency: 2 },
  { merchantName: 'Steam', category: 'entertainment', minAmount: 10, maxAmount: 60, frequency: 1 },
  { merchantName: 'Barnes & Noble', category: 'entertainment', minAmount: 15, maxAmount: 40, frequency: 1 },

  // Shopping
  { merchantName: 'Amazon', category: 'shopping', minAmount: 15, maxAmount: 150, frequency: 4 },
  { merchantName: 'Best Buy', category: 'shopping', minAmount: 30, maxAmount: 200, frequency: 1 },
  { merchantName: 'TJ Maxx', category: 'shopping', minAmount: 25, maxAmount: 80, frequency: 1 },

  // Healthcare
  { merchantName: 'CVS Pharmacy', category: 'healthcare', minAmount: 10, maxAmount: 60, frequency: 2 },
  { merchantName: 'Doctor\'s Office', category: 'healthcare', minAmount: 25, maxAmount: 150, frequency: 0.5 },

  // Personal
  { merchantName: 'Hair Salon', category: 'personal', minAmount: 40, maxAmount: 100, frequency: 1 },
  { merchantName: 'Dry Cleaning', category: 'personal', minAmount: 15, maxAmount: 35, frequency: 2 },
];

// Generate random transactions for a given date range
function generateTransactions(startDate: Date, endDate: Date): Transaction[] {
  const transactions: Transaction[] = [];
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  transactionTemplates.forEach((template) => {
    const expectedCount = Math.round((template.frequency * daysDiff) / 30);
    const count = Math.max(1, expectedCount + Math.floor(Math.random() * 3) - 1);

    for (let i = 0; i < count; i++) {
      const randomDay = Math.floor(Math.random() * daysDiff);
      const transactionDate = subDays(endDate, randomDay);
      const amount = Math.round(
        (template.minAmount + Math.random() * (template.maxAmount - template.minAmount)) * 100
      ) / 100;

      transactions.push({
        id: uuidv4(),
        householdId: DEMO_HOUSEHOLD_ID,
        accountId: Math.random() > 0.6 ? 'acc-3' : 'acc-1', // 40% credit, 60% checking
        amount: -amount, // Expenses are negative
        date: transactionDate,
        description: `${template.merchantName} Purchase`,
        merchantName: template.merchantName,
        category: template.category,
        isRecurring: false,
        isManual: false,
        createdAt: transactionDate,
      });
    }
  });

  // Add recurring transaction instances
  demoRecurringTransactions.forEach((recurring) => {
    let date = subMonths(endDate, 2);
    while (date <= endDate) {
      if (date >= startDate) {
        transactions.push({
          id: uuidv4(),
          householdId: DEMO_HOUSEHOLD_ID,
          accountId: 'acc-3',
          amount: -recurring.amount,
          date: new Date(date),
          description: recurring.description,
          merchantName: recurring.merchantName,
          category: recurring.category,
          isRecurring: true,
          recurringId: recurring.id,
          isManual: false,
          createdAt: new Date(date),
        });
      }
      date = addDays(date, 30); // Approximate monthly
    }
  });

  // Add some income
  let incomeDate = startOfMonth(startDate);
  while (incomeDate <= endDate) {
    transactions.push({
      id: uuidv4(),
      householdId: DEMO_HOUSEHOLD_ID,
      accountId: 'acc-1',
      amount: 4500, // Bi-weekly paycheck
      date: new Date(incomeDate),
      description: 'Payroll Deposit',
      merchantName: 'Employer Inc',
      category: 'income',
      isRecurring: true,
      isManual: false,
      createdAt: new Date(incomeDate),
    });

    transactions.push({
      id: uuidv4(),
      householdId: DEMO_HOUSEHOLD_ID,
      accountId: 'acc-1',
      amount: 4500,
      date: addDays(incomeDate, 14),
      description: 'Payroll Deposit',
      merchantName: 'Employer Inc',
      category: 'income',
      isRecurring: true,
      isManual: false,
      createdAt: addDays(incomeDate, 14),
    });

    incomeDate = addDays(incomeDate, 30);
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Generate demo transactions for the last 3 months
export const demoTransactions: Transaction[] = generateTransactions(
  subMonths(new Date(), 3),
  new Date()
);

// Demo household
export const demoHousehold: Household = {
  id: DEMO_HOUSEHOLD_ID,
  name: 'Demo Family',
  code: 'DEMO123',
  memberIds: [DEMO_USER_ID],
  createdAt: subMonths(new Date(), 6),
};

// Demo user
export const demoUser: User = {
  id: DEMO_USER_ID,
  email: 'demo@familybudget.app',
  displayName: 'Demo User',
  householdId: DEMO_HOUSEHOLD_ID,
  alertPreferences: {
    enabled: true,
    thresholds: [50, 75, 90, 100],
  },
  createdAt: subMonths(new Date(), 6),
};

// Generate alerts based on current budget status
export function generateDemoAlerts(
  transactions: Transaction[],
  budgets: Budget[]
): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Calculate spending by category for current month
  const spending: Record<CategoryType, number> = {} as Record<CategoryType, number>;
  transactions
    .filter((t) => t.date >= monthStart && t.date <= monthEnd && t.amount < 0)
    .forEach((t) => {
      const category = t.category;
      spending[category] = (spending[category] || 0) + Math.abs(t.amount);
    });

  // Check each budget
  budgets.forEach((budget) => {
    const spent = spending[budget.category] || 0;
    const percentage = (spent / budget.limit) * 100;

    if (percentage >= 100) {
      alerts.push({
        id: uuidv4(),
        householdId: DEMO_HOUSEHOLD_ID,
        type: 'budget_exceeded',
        category: budget.category,
        message: `You've exceeded your ${budget.category} budget!`,
        percentageUsed: percentage,
        isRead: false,
        createdAt: subDays(now, Math.floor(Math.random() * 3)),
      });
    } else if (percentage >= budget.alertThreshold) {
      alerts.push({
        id: uuidv4(),
        householdId: DEMO_HOUSEHOLD_ID,
        type: 'budget_warning',
        category: budget.category,
        message: `You've used ${Math.round(percentage)}% of your ${budget.category} budget`,
        percentageUsed: percentage,
        isRead: Math.random() > 0.5,
        createdAt: subDays(now, Math.floor(Math.random() * 5)),
      });
    }
  });

  // Add upcoming recurring transaction alert
  const upcomingRecurring = demoRecurringTransactions.filter(
    (r) => r.nextDate <= addDays(now, 7) && r.isActive
  );

  upcomingRecurring.forEach((recurring) => {
    alerts.push({
      id: uuidv4(),
      householdId: DEMO_HOUSEHOLD_ID,
      type: 'recurring_due',
      message: `${recurring.description} ($${recurring.amount}) is due soon`,
      isRead: false,
      createdAt: now,
    });
  });

  return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const demoAlerts = generateDemoAlerts(demoTransactions, demoBudgets);
