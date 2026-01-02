import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  status: 'safe' | 'warning' | 'danger' | 'exceeded';
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  percentage,
  status,
  height = 8,
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const cappedPercentage = Math.min(percentage, 100);

  const getGradient = () => {
    switch (status) {
      case 'safe':
        return 'linear-gradient(90deg, #4ade80, #22c55e)';
      case 'warning':
        return 'linear-gradient(90deg, #fbbf24, #f59e0b)';
      case 'danger':
        return 'linear-gradient(90deg, #f87171, #ef4444)';
      case 'exceeded':
        return 'linear-gradient(90deg, #ef4444, #dc2626)';
      default:
        return 'linear-gradient(90deg, #4ade80, #22c55e)';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${cappedPercentage}%` }}
          animate={{ width: `${cappedPercentage}%` }}
          transition={animated ? {
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
          } : undefined}
          style={{
            height: '100%',
            background: getGradient(),
            borderRadius: `${height / 2}px`,
            boxShadow: status === 'exceeded' ? '0 0 10px rgba(239, 68, 68, 0.5)' : undefined,
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'right',
          }}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
