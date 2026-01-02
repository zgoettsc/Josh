import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { GlassCard } from '../common/GlassCard';
import { CategoryBadge } from '../common/CategoryBadge';
import { Transaction, CategoryType, CATEGORIES } from '../../types';
import { AddTransactionModal } from './AddTransactionModal';
import { SplitTransactionModal } from './SplitTransactionModal';

type SortField = 'date' | 'amount' | 'category';
type SortDirection = 'asc' | 'desc';

export function TransactionsPage() {
  const { transactions, getSpendingSummary } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [splitTransaction, setSplitTransaction] = useState<Transaction | null>(null);

  const summary = getSpendingSummary();

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((t) => t.amount < 0); // Only expenses

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.merchantName.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [transactions, searchQuery, selectedCategory, sortField, sortDirection]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((t) => {
      const dateKey = format(t.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const categories = Object.keys(CATEGORIES).filter(
    (cat) => cat !== 'income' && cat !== 'savings'
  ) as CategoryType[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '1000px',
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
            Transactions
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
            {filteredTransactions.length} transactions this period
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
            transition: 'all 200ms ease',
          }}
        >
          <span>+</span> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <GlassCard variant="small">
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryType | 'all')}
            style={{
              padding: '12px 36px 12px 16px',
              fontSize: '14px',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '16px',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
              </option>
            ))}
          </select>

          {/* Sort Buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['date', 'amount'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: sortField === field ? 600 : 400,
                  color: sortField === field ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  background: sortField === field ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
          <div key={dateKey}>
            {/* Date Header */}
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '10px',
                paddingLeft: '4px',
              }}
            >
              {format(new Date(dateKey), 'EEEE, MMMM d')}
            </div>

            {/* Transactions for this date */}
            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
              {dayTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom:
                      index < dayTransactions.length - 1
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : 'none',
                    cursor: 'pointer',
                    transition: 'background 200ms ease',
                  }}
                  whileHover={{ background: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <CategoryBadge category={transaction.category} size="medium" showLabel={false} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {transaction.merchantName}
                        </span>
                        {transaction.isRecurring && (
                          <span
                            style={{
                              padding: '2px 6px',
                              fontSize: '10px',
                              fontWeight: 600,
                              background: 'rgba(96, 165, 250, 0.2)',
                              color: '#60a5fa',
                              borderRadius: '4px',
                            }}
                          >
                            RECURRING
                          </span>
                        )}
                        {transaction.splits && transaction.splits.length > 0 && (
                          <span
                            style={{
                              padding: '2px 6px',
                              fontSize: '10px',
                              fontWeight: 600,
                              background: 'rgba(168, 85, 247, 0.2)',
                              color: '#a855f7',
                              borderRadius: '4px',
                            }}
                          >
                            SPLIT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {CATEGORIES[transaction.category].label} • {format(transaction.date, 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, textAlign: 'right' }}>
                      -{formatCurrency(transaction.amount)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSplitTransaction(transaction);
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.5)',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    >
                      Split
                    </button>
                  </div>
                </motion.div>
              ))}
            </GlassCard>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <GlassCard>
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>No transactions found</div>
              <div style={{ fontSize: '14px' }}>
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first transaction to get started'}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddTransactionModal onClose={() => setShowAddModal(false)} />
        )}
        {splitTransaction && (
          <SplitTransactionModal
            transaction={splitTransaction}
            onClose={() => setSplitTransaction(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
