import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { CATEGORIES, CategoryType } from '../../types';

export function ComparisonWidget() {
  const { getPeriodComparison, currentPeriod } = useData();
  const comparison = getPeriodComparison();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const periodLabel = {
    weekly: 'Last Week',
    monthly: 'Last Month',
    yearly: 'Last Year',
    custom: 'Previous Period',
  }[currentPeriod];

  // Get top category changes
  const categoryChanges = Object.entries(comparison.categoryChanges)
    .filter(([cat, change]) => {
      const current = comparison.currentPeriod.byCategory[cat as CategoryType] || 0;
      const previous = comparison.previousPeriod.byCategory[cat as CategoryType] || 0;
      return current > 0 || previous > 0;
    })
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 4);

  const isIncrease = comparison.percentageChange > 0;

  return (
    <GlassCard>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
          vs {periodLabel}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(comparison.previousPeriod.total)}
          </span>
          {comparison.percentageChange !== 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
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
              {isIncrease ? '+' : ''}{comparison.percentageChange.toFixed(1)}%
            </motion.span>
          )}
        </div>
      </div>

      {/* Category Changes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
          Biggest Changes
        </div>
        {categoryChanges.map(([category, change], index) => {
          const categoryInfo = CATEGORIES[category as CategoryType];
          const isUp = change > 0;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{categoryInfo.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                  {categoryInfo.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isUp ? '#f87171' : '#4ade80',
                }}
              >
                {isUp ? '↑' : '↓'} {Math.abs(change).toFixed(0)}%
              </span>
            </motion.div>
          );
        })}

        {categoryChanges.length === 0 && (
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', padding: '20px' }}>
            No data from previous period
          </div>
        )}
      </div>
    </GlassCard>
  );
}
