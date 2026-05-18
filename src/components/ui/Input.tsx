import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
        {label ? <span className="text-sm font-semibold text-ink">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'min-h-[52px] rounded-xl border border-line/15 bg-surface/88 px-4 text-sm text-ink shadow-[0_8px_24px_rgba(15,15,15,0.03)] outline-none transition placeholder:text-muted/38 focus:border-brand-300 dark:bg-white/[0.03]',
            error && 'border-red-300 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {error ? <span className="text-sm text-danger">{error}</span> : null}
        {!error && hint ? <span className="text-sm text-muted">{hint}</span> : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
