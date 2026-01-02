import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { GlassCard } from '../common/GlassCard';

type AuthView = 'welcome' | 'login' | 'signup' | 'household';

export function AuthScreen() {
  const { login, signup, loginDemo, createHousehold, joinHousehold } = useAuth();
  const [view, setView] = useState<AuthView>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [householdCode, setHouseholdCode] = useState('');
  const [createdCode, setCreatedCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setView('household');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, displayName);
      setView('household');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHousehold = async () => {
    setError('');
    setLoading(true);
    try {
      const code = await createHousehold(householdName);
      setCreatedCode(code);
    } catch (err: any) {
      setError(err.message || 'Failed to create household');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    setError('');
    setLoading(true);
    try {
      await joinHousehold(householdCode);
    } catch (err: any) {
      setError(err.message || 'Failed to join household');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    outline: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    color: 'white',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <GlassCard variant="large">
          <AnimatePresence mode="wait">
            {view === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💰</div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                  Family Budget
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '32px' }}>
                  Track spending together, achieve goals together.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => setView('login')}
                    style={buttonStyle}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    style={secondaryButtonStyle}
                  >
                    Create Account
                  </button>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      margin: '16px 0',
                    }}
                  >
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
                  </div>

                  <button
                    onClick={handleDemoLogin}
                    style={{
                      ...secondaryButtonStyle,
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      color: '#fbbf24',
                    }}
                  >
                    🚀 Try Demo Mode
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => setView('welcome')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    fontSize: '14px',
                  }}
                >
                  ← Back
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                  Welcome Back
                </h2>

                <form onSubmit={handleLogin} style={formStyle}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {error && (
                    <div style={{ color: '#f87171', fontSize: '14px' }}>{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => setView('welcome')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    fontSize: '14px',
                  }}
                >
                  ← Back
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                  Create Account
                </h2>

                <form onSubmit={handleSignup} style={formStyle}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {error && (
                    <div style={{ color: '#f87171', fontSize: '14px' }}>{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'household' && (
              <motion.div
                key="household"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                  {createdCode ? 'Household Created!' : 'Join or Create Household'}
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
                  {createdCode
                    ? 'Share this code with your family member to join.'
                    : 'Create a new household or join an existing one with a code.'}
                </p>

                {createdCode ? (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        padding: '20px',
                        background: 'rgba(74, 222, 128, 0.1)',
                        border: '2px dashed rgba(74, 222, 128, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '24px',
                      }}
                    >
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                        Your Household Code
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '4px', color: '#4ade80' }}>
                        {createdCode}
                      </div>
                    </div>
                    <button
                      onClick={() => joinHousehold(createdCode)}
                      style={buttonStyle}
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Create New */}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Create New Household
                      </h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Household Name"
                          value={householdName}
                          onChange={(e) => setHouseholdName(e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                          onClick={handleCreateHousehold}
                          disabled={loading || !householdName}
                          style={{
                            ...buttonStyle,
                            width: 'auto',
                            opacity: loading || !householdName ? 0.5 : 1,
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>or</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
                    </div>

                    {/* Join Existing */}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Join Existing Household
                      </h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Enter Code"
                          value={householdCode}
                          onChange={(e) => setHouseholdCode(e.target.value.toUpperCase())}
                          style={{ ...inputStyle, flex: 1, letterSpacing: '2px', textTransform: 'uppercase' }}
                          maxLength={6}
                        />
                        <button
                          onClick={handleJoinHousehold}
                          disabled={loading || householdCode.length !== 6}
                          style={{
                            ...buttonStyle,
                            width: 'auto',
                            opacity: loading || householdCode.length !== 6 ? 0.5 : 1,
                          }}
                        >
                          Join
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div style={{ color: '#f87171', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}
