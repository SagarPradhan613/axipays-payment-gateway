import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-axipays-primary text-white shadow-glow hover:bg-axipays-primary-hover focus-visible:ring-brand-300',
  secondary:
    'border border-brand-300 bg-transparent text-brand-700 hover:bg-brand-600 hover:text-white focus-visible:ring-brand-300 dark:text-brand-300 dark:hover:bg-brand-600 dark:hover:text-white',
  ghost:
    'bg-transparent text-muted hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200',
  danger:
    'bg-danger text-white hover:bg-red-700 focus-visible:ring-red-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-14 px-5 text-base',
};

/**
 * Renders a styled button with optional loading state support.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Loading',
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-app disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = 'Button';
