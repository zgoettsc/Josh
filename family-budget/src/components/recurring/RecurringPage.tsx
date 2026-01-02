import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { CategoryBadge } from '../common/CategoryBadge';
import { CATEGORIES, RecurringTransaction, RecurringFrequency, CategoryType } from '../../types';

export function RecurringPage() {
  const { recurringTransactions, transactions } = useData();
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate monthly total from recurring
  const monthlyTotal = recurringTransactions
    .filter((r) => r.isActive)
    .reduce((sum, r) => {
      switch (r.frequency) {
        case 'weekly':
          return sum + r.amount * 4.33;
        case 'biweekly':
          return sum + r.amount * 2.17;
        case 'monthly':
          return sum + r.amount;
        case 'quarterly':
          return sum + r.amount / 3;
        case 'yearly':
          return sum + r.amount / 12;
        default:
          return sum + r.amount;
      }
    }, 0);

  // Group by upcoming
  const upcoming = recurringTransactions
    .filter((r) => r.isActive && r.nextDate <= addDays(new Date(), 7))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getFrequencyLabel = (freq: RecurringFrequency) => {
    switch (freq) {
      case 'weekly':
        return 'Weekly';
      case 'biweekly':
        return 'Every 2 weeks';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      default:
        return freq;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
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
            Recurring
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
            Track subscriptions and recurring bills
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'white',
            background: 'rgba(74, 222, 128, 0.2)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
        >
          <span>+</span> Add Recurring
        </button>
      </div>

      {/* Summary Card */}
      <GlassCard
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderColor: 'rgba(168, 85, 247, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
              Estimated Monthly Total
            </div>
            <div style={{ fontSize: '36px', fontWeight: 700 }}>
              {formatCurrency(monthlyTotal)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
              Active Subscriptions
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>
              {recurringTransactions.filter((r) => r.isActive).length}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Upcoming This Week */}
      {upcoming.length > 0 && (
        <GlassCard>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            📅 Due This Week
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcoming.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CategoryBadge category={item.category} size="small" showLabel={false} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                      {item.description}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Due {format(item.nextDate, 'EEEE, MMM d')}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
                  {formatCurrency(item.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* All Recurring Transactions */}
      <GlassCard>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          All Recurring Transactions
        </h2>

        {recurringTransactions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              No recurring transactions
            </div>
            <div style={{ fontSize: '14px' }}>
              Add subscriptions and bills to track them automatically
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recurringTransactions.map((item, index) => {
              const categoryInfo = CATEGORIES[item.category];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    opacity: item.isActive ? 1 : 0.5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        fontSize: '20px',
                        background: `${categoryInfo.color}20`,
                        borderRadius: '12px',
                      }}
                    >
                      {categoryInfo.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '2px' }}>
                        {item.description}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {item.merchantName} • {getFrequencyLabel(item.frequency)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>
                        {formatCurrency(item.amount)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                        Next: {format(item.nextDate, 'MMM d')}
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      ⋮
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddRecurringModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Add Recurring Modal
interface AddRecurringModalProps {
  onClose: () => void;
}

function AddRecurringModal({ onClose }: AddRecurringModalProps) {
  const [description, setDescription] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('subscriptions');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [nextDate, setNextDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = Object.keys(CATEGORIES).filter(
    (cat) => cat !== 'income' && cat !== 'savings'
  ) as CategoryType[];

  const frequencies: { value: RecurringFrequency; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every 2 Weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call addRecurringTransaction from context
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    outline: 'none',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 200,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(30, 30, 50, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
            Add Recurring
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Netflix Subscription"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
              Merchant/Company
            </label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="e.g., Netflix"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
                Amount
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{ ...inputStyle, paddingLeft: '32px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {frequencies.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px' }}>
                Next Due Date
              </label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '15px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '15px',
                fontWeight: 600,
                color: 'white',
                background: 'rgba(74, 222, 128, 0.2)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Add Recurring
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
