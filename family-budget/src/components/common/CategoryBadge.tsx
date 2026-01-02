import React from 'react';
import { CategoryType, CATEGORIES } from '../../types';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function CategoryBadge({ category, size = 'medium', showLabel = true }: CategoryBadgeProps) {
  const categoryInfo = CATEGORIES[category];

  const sizeStyles = {
    small: { padding: '4px 8px', fontSize: '11px', iconSize: '12px' },
    medium: { padding: '6px 12px', fontSize: '13px', iconSize: '14px' },
    large: { padding: '8px 16px', fontSize: '14px', iconSize: '16px' },
  };

  const styles = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: styles.padding,
        fontSize: styles.fontSize,
        fontWeight: 500,
        background: `${categoryInfo.color}20`,
        color: categoryInfo.color,
        borderRadius: '9999px',
        border: `1px solid ${categoryInfo.color}40`,
      }}
    >
      <span style={{ fontSize: styles.iconSize }}>{categoryInfo.icon}</span>
      {showLabel && <span>{categoryInfo.label}</span>}
    </span>
  );
}
