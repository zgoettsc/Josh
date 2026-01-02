import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { ProgressBar } from '../common/ProgressBar';
import { CategoryType, CATEGORIES, Budget } from '../../types';

export function BudgetsPage() {
  const { budgets, getBudgetProgress, addBudget, updateBudget, deleteBudget, currentPeriod } = useData();
  const progress = getBudgetProgress();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Categories without a budget yet
  const availableCategories = (Object.keys(CATEGORIES) as CategoryType[]).filter(
    (cat) =>
      cat !== 'income' &&
      cat !== 'savings' &&
      !budgets.some((b) => b.category === cat && b.period === currentPeriod)
  );

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
            Budgets
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
            {budgets.filter((b) => b.period === currentPeriod).length} active budgets
          </p>
        </div>
        {availableCategories.length > 0 && (
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
            <span>+</span> Add Budget
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <GlassCard variant="small">
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            On Track
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#4ade80' }}>
            {progress.filter((p) => p.status === 'safe').length}
          </div>
        </GlassCard>
        <GlassCard variant="small">
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            Warning
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fbbf24' }}>
            {progress.filter((p) => p.status === 'warning' || p.status === 'danger').length}
          </div>
        </GlassCard>
        <GlassCard variant="small">
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            Exceeded
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>
            {progress.filter((p) => p.status === 'exceeded').length}
          </div>
        </GlassCard>
      </div>

      {/* Budget Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {progress.length === 0 ? (
          <GlassCard>
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                No budgets yet
              </div>
              <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                Create your first budget to start tracking your spending
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
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
          </GlassCard>
        ) : (
          progress.map((item, index) => {
            const categoryInfo = CATEGORIES[item.budget.category];

            return (
              <motion.div
                key={item.budget.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard
                  style={{
                    borderColor:
                      item.status === 'exceeded'
                        ? 'rgba(239, 68, 68, 0.4)'
                        : item.status === 'danger'
                        ? 'rgba(248, 113, 113, 0.3)'
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '48px',
                          height: '48px',
                          fontSize: '24px',
                          background: `${categoryInfo.color}20`,
                          borderRadius: '14px',
                        }}
                      >
                        {categoryInfo.icon}
                      </span>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '2px' }}>
                          {categoryInfo.label}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Alert at {item.budget.alertThreshold}%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.status !== 'safe' && (
                        <span
                          style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            borderRadius: '8px',
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
                          {item.status === 'exceeded' ? 'Over Budget' : item.status}
                        </span>
                      )}
                      <button
                        onClick={() => setEditingBudget(item.budget)}
                        style={{
                          padding: '8px 12px',
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <ProgressBar
                      percentage={item.percentageUsed}
                      status={item.status}
                      height={10}
                    />
                  </div>

                  {/* Amounts */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: 700 }}>
                        {formatCurrency(item.spent)}
                      </span>
                      <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.5)', marginLeft: '8px' }}>
                        / {formatCurrency(item.budget.limit)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color:
                          item.status === 'exceeded'
                            ? '#ef4444'
                            : item.status === 'safe'
                            ? '#4ade80'
                            : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {item.status === 'exceeded'
                        ? `${formatCurrency(item.spent - item.budget.limit)} over`
                        : `${formatCurrency(item.remaining)} left`}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingBudget) && (
          <BudgetModal
            budget={editingBudget}
            availableCategories={editingBudget ? [editingBudget.category, ...availableCategories] : availableCategories}
            onSave={(data) => {
              if (editingBudget) {
                updateBudget(editingBudget.id, data);
              } else {
                addBudget({
                  ...data,
                  period: currentPeriod,
                  isActive: true,
                });
              }
              setShowAddModal(false);
              setEditingBudget(null);
            }}
            onDelete={
              editingBudget
                ? () => {
                    deleteBudget(editingBudget.id);
                    setEditingBudget(null);
                  }
                : undefined
            }
            onClose={() => {
              setShowAddModal(false);
              setEditingBudget(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Budget Modal Component
interface BudgetFormData {
  category: CategoryType;
  limit: number;
  alertThreshold: number;
}

interface BudgetModalProps {
  budget: Budget | null;
  availableCategories: CategoryType[];
  onSave: (data: BudgetFormData) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function BudgetModal({ budget, availableCategories, onSave, onDelete, onClose }: BudgetModalProps) {
  const [category, setCategory] = useState<CategoryType>(budget?.category || availableCategories[0]);
  const [limit, setLimit] = useState(budget?.limit.toString() || '');
  const [alertThreshold, setAlertThreshold] = useState(budget?.alertThreshold || 80);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      category,
      limit: parseFloat(limit),
      alertThreshold,
    });
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
            {budget ? 'Edit Budget' : 'Create Budget'}
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
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '6px',
              }}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              disabled={!!budget}
              style={{
                ...inputStyle,
                cursor: budget ? 'not-allowed' : 'pointer',
                opacity: budget ? 0.6 : 1,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '18px',
                paddingRight: '44px',
              }}
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '6px',
              }}
            >
              Budget Limit
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                $
              </span>
              <input
                type="number"
                step="1"
                min="1"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="500"
                style={{ ...inputStyle, paddingLeft: '32px' }}
                required
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '6px',
              }}
            >
              Alert Threshold: {alertThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                appearance: 'none',
                cursor: 'pointer',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: '4px',
              }}
            >
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#f87171',
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            )}
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
              {budget ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
