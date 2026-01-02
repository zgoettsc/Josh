import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';

export function SettingsPage() {
  const { currentUser, household, isDemo } = useAuth();
  const { accounts } = useData();

  const [alertsEnabled, setAlertsEnabled] = useState(currentUser?.alertPreferences.enabled ?? true);
  const [alertThresholds, setAlertThresholds] = useState<number[]>(
    currentUser?.alertPreferences.thresholds ?? [50, 75, 90, 100]
  );

  const handleThresholdToggle = (threshold: number) => {
    if (alertThresholds.includes(threshold)) {
      setAlertThresholds(alertThresholds.filter((t) => t !== threshold));
    } else {
      setAlertThresholds([...alertThresholds, threshold].sort((a, b) => a - b));
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
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
          Settings
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Demo Mode Banner */}
      {isDemo && (
        <GlassCard
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🚀</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#fbbf24' }}>
                Demo Mode Active
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                You're viewing sample data. Create an account to save your own budget.
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Profile Section */}
      <GlassCard>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
          Profile
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '4px' }}>
              Display Name
            </label>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>
              {currentUser?.displayName}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '4px' }}>
              Email
            </label>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>
              {currentUser?.email}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Household Section */}
      <GlassCard>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
          Household
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '4px' }}>
              Household Name
            </label>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>
              {household?.name}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '4px' }}>
              Invite Code
            </label>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '3px', fontFamily: 'monospace' }}>
                {household?.code}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(household?.code || '')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Copy
              </button>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '8px' }}>
              Share this code with family members to let them join
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '4px' }}>
              Members
            </label>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>
              {household?.memberIds.length || 0} member(s)
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Alert Preferences */}
      <GlassCard>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
          Alert Preferences
        </h2>

        {/* Enable/Disable Alerts */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Enable Alerts</div>
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Receive notifications when approaching budget limits
            </div>
          </div>
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            style={{
              width: '56px',
              height: '32px',
              padding: '4px',
              background: alertsEnabled ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${alertsEnabled ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              position: 'relative',
            }}
          >
            <motion.div
              animate={{ x: alertsEnabled ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                width: '24px',
                height: '24px',
                background: alertsEnabled ? '#4ade80' : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
              }}
            />
          </button>
        </div>

        {/* Threshold Preferences */}
        <div style={{ opacity: alertsEnabled ? 1 : 0.5, pointerEvents: alertsEnabled ? 'auto' : 'none' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
            Alert me when I reach:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[50, 75, 90, 100].map((threshold) => (
              <button
                key={threshold}
                onClick={() => handleThresholdToggle(threshold)}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: alertThresholds.includes(threshold) ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  background: alertThresholds.includes(threshold)
                    ? 'rgba(99, 102, 241, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    alertThresholds.includes(threshold)
                      ? 'rgba(99, 102, 241, 0.5)'
                      : 'rgba(255, 255, 255, 0.15)'
                  }`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                {threshold}%
              </button>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '12px' }}>
            You'll receive alerts when spending reaches these percentages of your budget
          </div>
        </div>
      </GlassCard>

      {/* Connected Accounts */}
      <GlassCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
            Connected Accounts
          </h2>
          {!isDemo && (
            <button
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'white',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              + Connect Account
            </button>
          )}
        </div>

        {accounts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏦</div>
            <div style={{ fontSize: '14px' }}>
              {isDemo
                ? 'In demo mode, accounts are simulated'
                : 'Connect your bank accounts to automatically import transactions'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {accounts.map((account) => (
              <div
                key={account.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      fontSize: '18px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                    }}
                  >
                    {account.type === 'checking' ? '💵' : account.type === 'savings' ? '🏦' : '💳'}
                  </span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 500 }}>{account.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {account.institution} •••• {account.mask}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>
                    ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  {account.isDemo && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#fbbf24',
                        textTransform: 'uppercase',
                      }}
                    >
                      Demo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Danger Zone */}
      {!isDemo && (
        <GlassCard
          style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#f87171' }}>
            Danger Zone
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Delete Household</div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                This will permanently delete all data for your household
              </div>
            </div>
            <button
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
