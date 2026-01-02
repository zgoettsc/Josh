import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { BudgetPeriod } from '../../types';

export function PeriodSelector() {
  const { currentPeriod, setCurrentPeriod, setCustomPeriod } = useData();
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const periods: { value: BudgetPeriod; label: string }[] = [
    { value: 'weekly', label: 'Week' },
    { value: 'monthly', label: 'Month' },
    { value: 'yearly', label: 'Year' },
    { value: 'custom', label: 'Custom' },
  ];

  const handlePeriodChange = (period: BudgetPeriod) => {
    if (period === 'custom') {
      setShowCustom(true);
    } else {
      setCurrentPeriod(period);
      setShowCustom(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customStart && customEnd) {
      setCustomPeriod(new Date(customStart), new Date(customEnd));
      setShowCustom(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
        }}
      >
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: currentPeriod === period.value ? 600 : 400,
              color: currentPeriod === period.value ? 'white' : 'rgba(255, 255, 255, 0.6)',
              background: currentPeriod === period.value ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            {period.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              padding: '16px',
              background: 'rgba(30, 30, 50, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 100,
              minWidth: '280px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
              Custom Period
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginBottom: '4px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginBottom: '4px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowCustom(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customStart || !customEnd}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    opacity: !customStart || !customEnd ? 0.5 : 1,
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
