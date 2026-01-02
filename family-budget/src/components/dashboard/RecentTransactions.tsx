import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { CategoryBadge } from '../common/CategoryBadge';

export function RecentTransactions() {
  const navigate = useNavigate();
  const { transactions } = useData();

  const recentTransactions = transactions
    .filter((t) => t.amount < 0) // Only expenses
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
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
          <span style={{ fontSize: '20px' }}>💳</span>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
            Recent Transactions
          </h2>
        </div>
        <button
          onClick={() => navigate('/transactions')}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recentTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background 200ms ease',
            }}
            whileHover={{ background: 'rgba(255, 255, 255, 0.08)' }}
            onClick={() => navigate('/transactions')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
              <CategoryBadge category={transaction.category} size="small" showLabel={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {transaction.merchantName}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {format(transaction.date, 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'white',
                marginLeft: '16px',
              }}
            >
              -{formatCurrency(transaction.amount)}
            </div>
          </motion.div>
        ))}

        {recentTransactions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            <div style={{ fontSize: '14px' }}>No transactions yet</div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
