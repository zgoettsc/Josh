// Apple Weather-inspired theme with glassmorphism

export const theme = {
  colors: {
    // Gradient backgrounds based on budget health
    gradients: {
      healthy: 'linear-gradient(180deg, #1a5f2a 0%, #0d3d16 50%, #0a2d10 100%)',
      warning: 'linear-gradient(180deg, #8b6914 0%, #5c4510 50%, #3d2e0a 100%)',
      danger: 'linear-gradient(180deg, #8b1414 0%, #5c1010 50%, #3d0a0a 100%)',
      neutral: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
      night: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    },

    // Glass effects
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backgroundHover: 'rgba(255, 255, 255, 0.15)',
      backgroundActive: 'rgba(255, 255, 255, 0.2)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderLight: 'rgba(255, 255, 255, 0.1)',
    },

    // Text colors
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
      inverse: 'rgba(0, 0, 0, 0.9)',
    },

    // Status colors
    status: {
      safe: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      exceeded: '#ef4444',
      info: '#60a5fa',
    },

    // Category colors (matching types/index.ts)
    categories: {
      groceries: '#4CAF50',
      dining: '#FF9800',
      transportation: '#2196F3',
      utilities: '#9C27B0',
      entertainment: '#E91E63',
      shopping: '#00BCD4',
      healthcare: '#F44336',
      education: '#3F51B5',
      travel: '#009688',
      subscriptions: '#673AB7',
      housing: '#795548',
      personal: '#607D8B',
      gifts: '#FF5722',
      income: '#8BC34A',
      savings: '#CDDC39',
      other: '#9E9E9E',
    },
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Border radius
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
    md: '0 4px 16px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(255, 255, 255, 0.1)',
  },

  // Typography
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '28px',
      xxl: '36px',
      hero: '56px',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400,
  },
};

// Glass card styles
export const glassCard = `
  background: ${theme.colors.glass.background};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
`;

// Glass button styles
export const glassButton = `
  background: ${theme.colors.glass.background};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.borderLight};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.glass.backgroundHover};
  }

  &:active {
    background: ${theme.colors.glass.backgroundActive};
  }
`;

export type Theme = typeof theme;
