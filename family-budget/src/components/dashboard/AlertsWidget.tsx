import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { CATEGORIES, Alert } from '../../types';

export function AlertsWidget() {
  const { alerts, markAlertRead, clearAlerts } = useData();
  const unreadAlerts = alerts.filter((a) => !a.isRead).slice(0, 5);

  const getAlertIcon = (alert: Alert) => {
    switch (alert.type) {
      case 'budget_exceeded':
        return '🚨';
      case 'budget_warning':
        return '⚠️';
      case 'recurring_due':
        return '📅';
      case 'unusual_transaction':
        return '🔍';
      default:
        return '📢';
    }
  };

  const getAlertColor = (alert: Alert) => {
    switch (alert.type) {
      case 'budget_exceeded':
        return '#ef4444';
      case 'budget_warning':
        return '#fbbf24';
      case 'recurring_due':
        return '#60a5fa';
      default:
        return '#9ca3af';
    }
  };

  if (unreadAlerts.length === 0) return null;

  return (
    <GlassCard>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
            Alerts
          </h2>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '24px',
              height: '24px',
              padding: '0 8px',
              fontSize: '12px',
              fontWeight: 600,
              background: '#ef4444',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            {unreadAlerts.length}
          </span>
        </div>
        <button
          onClick={clearAlerts}
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
          Clear All
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence>
          {unreadAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => markAlertRead(alert.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: `${getAlertColor(alert)}10`,
                border: `1px solid ${getAlertColor(alert)}30`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <span style={{ fontSize: '20px' }}>{getAlertIcon(alert)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  {alert.message}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
                  {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
                </div>
              </div>
              {alert.category && (
                <span
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: `${CATEGORIES[alert.category].color}20`,
                    color: CATEGORIES[alert.category].color,
                    borderRadius: '6px',
                  }}
                >
                  {CATEGORIES[alert.category].icon} {CATEGORIES[alert.category].label}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
