import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, household, isDemo, logout } = useAuth();
  const { alerts } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/budgets', label: 'Budgets', icon: '🎯' },
    { path: '/recurring', label: 'Recurring', icon: '🔄' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const NavItem = ({ path, label, icon }: { path: string; label: string; icon: string }) => {
    const isActive = location.pathname === path;
    return (
      <NavLink
        to={path}
        onClick={() => setMobileMenuOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 20px',
          color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: isActive ? 600 : 400,
          background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: '12px',
          margin: '4px 12px',
          transition: 'all 200ms ease',
        }}
      >
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span>{label}</span>
      </NavLink>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}
        className="hide-mobile"
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
            💰 Family Budget
          </h1>
          {isDemo && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                background: 'rgba(251, 191, 36, 0.2)',
                color: '#fbbf24',
                borderRadius: '9999px',
              }}
            >
              DEMO MODE
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, paddingTop: '16px' }}>
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* User Info */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>
              {currentUser?.displayName}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
              {household?.name}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className="hide-desktop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 100,
        }}
      >
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
          💰 Family Budget
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {unreadAlerts > 0 && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                fontSize: '12px',
                fontWeight: 600,
                background: '#ef4444',
                color: 'white',
                borderRadius: '9999px',
              }}
            >
              {unreadAlerts}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="hide-desktop"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 150,
            }}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '280px',
                background: 'rgba(15, 15, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '80px 0 20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ padding: '20px' }}>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '32px',
          minHeight: '100vh',
        }}
        className="main-content"
      >
        <style>{`
          @media (max-width: 768px) {
            .main-content {
              margin-left: 0 !important;
              padding: 80px 16px 100px !important;
            }
          }
        `}</style>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="hide-desktop"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 100,
        }}
      >
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <span style={{ fontSize: '22px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
