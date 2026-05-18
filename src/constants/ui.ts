import type { PaymentStatus } from '@types';

export const DASHBOARD_STATUS_COLORS: Record<PaymentStatus, string> = {
  success: '#10B981',
  failed: '#F43F5E',
  pending: '#F59E0B',
};

export const DASHBOARD_CURRENCY_PALETTE = ['#7C3AED', '#D4A847', '#10B981', '#F43F5E', '#8B5CF6', '#F59E0B'];

export const DASHBOARD_THEME_COLORS = {
  dark: {
    axis: '#9E9E9E',
    tooltipBackground: '#1A1A1A',
    tooltipText: '#F5F0E8',
    chartValueText: '#F5F0E8',
  },
  light: {
    axis: '#6B6B6B',
    tooltipBackground: '#FFFFFF',
    tooltipText: '#0F0F0F',
    chartValueText: '#0F0F0F',
  },
} as const;

export const CHECKOUT_CARD_LOGO_COLORS = {
  visa: '#1A1F71',
  mastercardBackground: '#111827',
  mastercardRed: '#EB001B',
  mastercardYellow: '#F79E1B',
  amex: '#2E77BC',
} as const;
