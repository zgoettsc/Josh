import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { Transaction, CategoryType, CATEGORIES, TransactionSplit } from '../../types';

interface SplitTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export function SplitTransactionModal({ transaction, onClose }: SplitTransactionModalProps) {
  const { splitTransaction } = useData();
  const totalAmount = Math.abs(transaction.amount);

  const [splits, setSplits] = useState<Array<{ category: CategoryType; amount: string }>>([
    { category: transaction.category, amount: totalAmount.toFixed(2) },
  ]);

  const categories = Object.keys(CATEGORIES).filter(
    (cat) => cat !== 'income' && cat !== 'savings'
  ) as CategoryType[];

  const currentTotal = splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
  const remaining = totalAmount - currentTotal;

  const addSplit = () => {
    setSplits([...splits, { category: 'other', amount: '' }]);
  };

  const removeSplit = (index: number) => {
    if (splits.length > 1) {
      setSplits(splits.filter((_, i) => i !== index));
    }
  };

  const updateSplit = (index: number, field: 'category' | 'amount', value: string) => {
    const newSplits = [...splits];
    if (field === 'category') {
      newSplits[index].category = value as CategoryType;
    } else {
      newSplits[index].amount = value;
    }
    setSplits(newSplits);
  };

  const handleSubmit = () => {
    const validSplits: TransactionSplit[] = splits
      .filter((s) => parseFloat(s.amount) > 0)
      .map((s) => ({
        category: s.category,
        amount: parseFloat(s.amount),
      }));

    if (validSplits.length > 0) {
      splitTransaction(transaction.id, validSplits);
    }
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    outline: 'none',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
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
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
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
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
            Split Transaction
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

        {/* Transaction Info */}
        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
            {transaction.merchantName}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>

        {/* Splits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {splits.map((split, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <select
                value={split.category}
                onChange={(e) => updateSplit(index, 'category', e.target.value)}
                style={{
                  ...inputStyle,
                  flex: 1,
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '16px',
                  paddingRight: '36px',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                  </option>
                ))}
              </select>

              <div style={{ position: 'relative', width: '120px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={totalAmount}
                  value={split.amount}
                  onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                  placeholder="0.00"
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                />
              </div>

              <button
                onClick={() => removeSplit(index)}
                disabled={splits.length === 1}
                style={{
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: splits.length === 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: splits.length === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Split Button */}
        <button
          onClick={addSplit}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.6)',
            background: 'transparent',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          + Add Another Split
        </button>

        {/* Remaining Amount */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            background:
              Math.abs(remaining) < 0.01
                ? 'rgba(74, 222, 128, 0.1)'
                : 'rgba(251, 191, 36, 0.1)',
            border: `1px solid ${
              Math.abs(remaining) < 0.01
                ? 'rgba(74, 222, 128, 0.3)'
                : 'rgba(251, 191, 36, 0.3)'
            }`,
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Remaining</span>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: Math.abs(remaining) < 0.01 ? '#4ade80' : '#fbbf24',
            }}
          >
            {formatCurrency(remaining)}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
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
            onClick={handleSubmit}
            disabled={Math.abs(remaining) >= 0.01}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'white',
              background:
                Math.abs(remaining) < 0.01
                  ? 'rgba(74, 222, 128, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${
                Math.abs(remaining) < 0.01
                  ? 'rgba(74, 222, 128, 0.3)'
                  : 'rgba(255, 255, 255, 0.2)'
              }`,
              borderRadius: '12px',
              cursor: Math.abs(remaining) < 0.01 ? 'pointer' : 'not-allowed',
              opacity: Math.abs(remaining) < 0.01 ? 1 : 0.5,
            }}
          >
            Save Splits
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
