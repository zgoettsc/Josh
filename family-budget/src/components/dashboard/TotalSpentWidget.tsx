import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';

export function TotalSpentWidget() {
  const { getSpendingSummary, getPeriodComparison, currentPeriod } = useData();
  const summary = getSpendingSummary();
  const comparison = getPeriodComparison();

  const percentChange = comparison.percentageChange;
  const isIncrease = percentChange > 0;
  const isDecrease = percentChange < 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const periodLabel = {
    weekly: 'this week',
    monthly: 'this month',
    yearly: 'this year',
    custom: 'this period',
  }[currentPeriod];

  return (
    <GlassCard
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.3)',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
          Total Spent {periodLabel}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.1 }}
        >
          {formatCurrency(summary.total)}
        </motion.div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {percentChange !== 0 && (
          <>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '13px',
                fontWeight: 600,
                background: isIncrease
                  ? 'rgba(248, 113, 113, 0.2)'
                  : 'rgba(74, 222, 128, 0.2)',
                color: isIncrease ? '#f87171' : '#4ade80',
                borderRadius: '8px',
              }}
            >
              {isIncrease ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
            </motion.span>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
              vs last {currentPeriod === 'weekly' ? 'week' : currentPeriod === 'yearly' ? 'year' : 'month'}
            </span>
          </>
        )}
      </div>

      {/* Mini sparkline or visual */}
      <div
        style={{
          display: 'flex',
          gap: '3px',
          alignItems: 'flex-end',
          height: '40px',
          marginTop: '20px',
        }}
      >
        {Object.entries(summary.byCategory)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([category, amount], index) => (
            <motion.div
              key={category}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(10, (amount / summary.total) * 100)}%` }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
              style={{
                flex: 1,
                background: `rgba(255, 255, 255, ${0.3 - index * 0.03})`,
                borderRadius: '4px 4px 0 0',
                minHeight: '4px',
              }}
            />
          ))}
      </div>
    </GlassCard>
  );
}
