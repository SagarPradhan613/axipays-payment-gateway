import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/**
 * Renders a shared textarea primitive with the same subtle styling as text inputs.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <label className="flex w-full flex-col gap-2" htmlFor={textareaId}>
        {label ? <span className="text-sm font-medium text-muted">{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'min-h-[108px] rounded-xl border border-line/15 bg-surface/88 px-4 py-3 text-sm text-ink shadow-[0_8px_24px_rgba(15,15,15,0.03)] outline-none transition placeholder:text-muted/38 focus:border-brand-300 dark:bg-white/[0.03]',
            error && 'border-red-300 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs text-danger">{error}</span> : null}
        {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';
