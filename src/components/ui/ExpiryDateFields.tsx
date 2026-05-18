import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from '@components/ui/Dropdown';
import { cn, getMonthOptions } from '@utils';

interface ExpiryDateFieldsProps {
  month: string;
  year: string;
  locale?: string;
  monthPlaceholder?: string;
  yearPlaceholder?: string;
  monthError?: boolean;
  yearError?: boolean;
  className?: string;
  onChange: (month: string, year: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * Renders a simple expiry editor with a month selector and a typeable year field.
 */
export const ExpiryDateFields = ({
  month,
  year,
  locale = 'en',
  monthPlaceholder = 'MM',
  yearPlaceholder = 'YYYY',
  monthError = false,
  yearError = false,
  className,
  onChange,
  onFocus,
  onBlur,
}: ExpiryDateFieldsProps) => {
  const [yearInputValue, setYearInputValue] = useState(year);

  const monthOptions = useMemo(
    () =>
      getMonthOptions(locale).map((option) => ({
        value: option.value,
        label: `${option.value} · ${option.label}`,
      })),
    [locale],
  );

  useEffect(() => {
    setYearInputValue(year);
  }, [year]);

  return (
    <div className={cn('grid gap-3 sm:grid-cols-[minmax(0,150px)_minmax(0,1fr)]', className)}>
      <Dropdown
        value={month}
        placeholder={monthPlaceholder}
        options={monthOptions}
        error={monthError}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(value) => onChange(value, year)}
        className="min-h-[52px]"
        menuClassName="border-line/80 bg-white dark:bg-slate-950 shadow-[0_22px_48px_rgba(15,23,42,0.18)]"
      />

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-exp-year"
          placeholder={yearPlaceholder}
          value={yearInputValue}
          minLength={4}
          maxLength={4}
          pattern="\d{4}"
          aria-invalid={yearError}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => {
            const nextYear = event.target.value.replace(/\D/g, '').slice(0, 4);
            setYearInputValue(nextYear);
            onChange(month, nextYear);
          }}
          className={cn(
            'min-h-[52px] w-full rounded-xl border border-line/15 bg-surface px-4 text-sm text-ink shadow-[0_8px_24px_rgba(15,15,15,0.03)] outline-none transition placeholder:text-muted/38 focus:border-brand-300 dark:bg-white/[0.03]',
            yearError && 'border-red-300 focus:border-red-400',
          )}
        />
      </div>
    </div>
  );
};
