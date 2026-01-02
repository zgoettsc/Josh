import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { AlertsWidget } from './AlertsWidget';
import { TotalSpentWidget } from './TotalSpentWidget';
import { BudgetProgressWidget } from './BudgetProgressWidget';
import { ComparisonWidget } from './ComparisonWidget';
import { RecentTransactions } from './RecentTransactions';
import { PeriodSelector } from './PeriodSelector';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const { currentPeriod, alerts, getSpendingSummary, getBudgetProgress } = useData();
  const summary = getSpendingSummary();
  const unreadAlerts = alerts.filter((a) => !a.isRead);
  const budgetProgress = getBudgetProgress();

  // Determine background gradient based on budget health
  const getBudgetHealth = () => {
    const exceededCount = budgetProgress.filter((p) => p.status === 'exceeded').length;
    const dangerCount = budgetProgress.filter((p) => p.status === 'danger').length;

    if (exceededCount > 0) return 'danger';
    if (dangerCount > 0) return 'warning';
    return 'healthy';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
            Dashboard
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
            {format(summary.periodStart, 'MMM d')} - {format(summary.periodEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <PeriodSelector />
      </motion.div>

      {/* Alerts - Top Priority */}
      {unreadAlerts.length > 0 && (
        <motion.div variants={itemVariants}>
          <AlertsWidget />
        </motion.div>
      )}

      {/* Main Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Total Spent - Priority Widget */}
        <motion.div variants={itemVariants}>
          <TotalSpentWidget />
        </motion.div>

        {/* Comparison Widget - Priority */}
        <motion.div variants={itemVariants}>
          <ComparisonWidget />
        </motion.div>
      </div>

      {/* Budget Progress - Priority Widget */}
      <motion.div variants={itemVariants}>
        <BudgetProgressWidget />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <RecentTransactions />
      </motion.div>
    </motion.div>
  );
}
