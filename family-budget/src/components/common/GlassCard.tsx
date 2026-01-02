import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'small' | 'large';
  hover?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}: GlassCardProps) {
  const baseStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: variant === 'small' ? '12px' : variant === 'large' ? '28px' : '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    padding: variant === 'small' ? '12px' : variant === 'large' ? '32px' : '20px',
  };

  return (
    <motion.div
      style={baseStyles}
      className={className}
      whileHover={hover ? {
        background: 'rgba(255, 255, 255, 0.15)',
        scale: 1.02,
      } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
