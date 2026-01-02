import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { ProgressBar } from '../common/ProgressBar';
import { CATEGORIES } from '../../types';

export function BudgetProgressWidget() {
  const navigate = useNavigate();
  const { getBudgetProgress } = useData();
  const progress = getBudgetProgress();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <GlassCard>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🎯</span>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
            Budget Progress
          </h2>
        </div>
        <button
          onClick={() => navigate('/budgets')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.6)',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          View All
        </button>
      </div>

      {progress.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
          <div style={{ fontSize: '14px', marginBottom: '16px' }}>
            No budgets set up yet
          </div>
          <button
            onClick={() => navigate('/budgets')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {progress.map((item, index) => {
            const categoryInfo = CATEGORIES[item.budget.category];

            return (
              <motion.div
                key={item.budget.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: item.status === 'exceeded'
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : item.status === 'danger'
                    ? '1px solid rgba(248, 113, 113, 0.2)'
                    : '1px solid transparent',
                }}
              >
                {/* Category Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        fontSize: '16px',
                        background: `${categoryInfo.color}20`,
                        borderRadius: '8px',
                      }}
                    >
                      {categoryInfo.icon}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {categoryInfo.label}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {item.status !== 'safe' && (
                    <span
                      style={{
                        padding: '3px 8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderRadius: '6px',
                        background:
                          item.status === 'exceeded'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : item.status === 'danger'
                            ? 'rgba(248, 113, 113, 0.2)'
                            : 'rgba(251, 191, 36, 0.2)',
                        color:
                          item.status === 'exceeded'
                            ? '#ef4444'
                            : item.status === 'danger'
                            ? '#f87171'
                            : '#fbbf24',
                      }}
                    >
                      {item.status === 'exceeded' ? 'Over Budget' : item.status === 'danger' ? 'Almost' : 'Warning'}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <ProgressBar
                  percentage={item.percentageUsed}
                  status={item.status}
                  height={8}
                />

                {/* Amount Info */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {formatCurrency(item.spent)} spent
                  </span>
                  <span
                    style={{
                      color:
                        item.status === 'exceeded'
                          ? '#ef4444'
                          : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {item.status === 'exceeded'
                      ? `${formatCurrency(item.spent - item.budget.limit)} over`
                      : `${formatCurrency(item.remaining)} left`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
