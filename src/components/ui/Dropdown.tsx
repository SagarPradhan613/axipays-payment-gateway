import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@utils';

export interface DropdownOption {
  value: string;
  label: string;
  leading?: ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  placeholder: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  error?: boolean;
  className?: string;
  menuClassName?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface DropdownPosition {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
}

/**
 * Renders a custom dropdown with optional search and smart top/bottom placement.
 */
export const Dropdown = ({
  options,
  value,
  placeholder,
  searchable = false,
  searchPlaceholder = 'Search',
  emptyLabel = 'No options found',
  error = false,
  className,
  menuClassName,
  onChange,
  onFocus,
  onBlur,
}: DropdownProps) => {
  const dropdownGap = 8;
  const viewportPadding = 12;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchId = useId();
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const updateMenuPosition = () => {
    if (!dropdownRef.current) {
      return;
    }

    const rect = dropdownRef.current.getBoundingClientRect();
    const estimatedDropdownHeight = searchable ? 296 : 248;
    const measuredMenuHeight = menuRef.current?.offsetHeight ?? estimatedDropdownHeight;
    const availableBelow = Math.max(0, window.innerHeight - rect.bottom - dropdownGap - viewportPadding);
    const availableAbove = Math.max(0, rect.top - dropdownGap - viewportPadding);
    const shouldOpenUpward =
      availableBelow < measuredMenuHeight && (availableAbove > availableBelow || availableBelow < 160);
    const maxHeight = Math.max(0, shouldOpenUpward ? availableAbove : availableBelow);
    const renderedHeight = Math.min(measuredMenuHeight, maxHeight);
    const top = shouldOpenUpward
      ? Math.max(viewportPadding, rect.top - dropdownGap - renderedHeight)
      : rect.bottom + dropdownGap;
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      Math.max(viewportPadding, window.innerWidth - rect.width - viewportPadding),
    );

    setOpenUpward(shouldOpenUpward);
    setPosition({
      left,
      top,
      width: rect.width,
      maxHeight,
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!dropdownRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [onBlur]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateMenuPosition();
    const frameId = window.requestAnimationFrame(updateMenuPosition);

    const handleViewportChange = () => updateMenuPosition();

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [filteredOptions.length, isOpen, query, searchable]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          'relative z-0 flex min-h-[52px] w-full items-center justify-between gap-4 rounded-xl border border-line/15 bg-surface px-4 text-left text-sm text-ink shadow-[0_8px_24px_rgba(15,15,15,0.03)] outline-none transition focus:border-brand-300 dark:bg-white/[0.03]',
          error && 'border-red-300',
          className,
        )}
        onClick={() => {
          setIsOpen((open) => !open);
          onFocus?.();
        }}
      >
        <span className={cn('truncate', !selectedOption && 'text-muted/55')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {typeof document !== 'undefined' && position
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: openUpward ? -8 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: openUpward ? -6 : 6 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    left: position.left,
                    top: position.top,
                    width: position.width,
                    maxHeight: position.maxHeight,
                  }}
                  className={cn(
                    'fixed z-[999] flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-line/80 bg-white p-3 shadow-[0_22px_48px_rgba(15,23,42,0.18)] dark:bg-slate-950',
                    menuClassName,
                  )}
                >
                  {searchable ? (
                    <>
                      <label className="sr-only" htmlFor={searchId}>
                        {searchPlaceholder}
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-line/40 bg-app/40 px-3">
                        <Search className="h-4 w-4 text-muted" />
                        <input
                          id={searchId}
                          autoFocus
                          value={query}
                          placeholder={searchPlaceholder}
                          onChange={(event) => setQuery(event.target.value)}
                          className="h-11 w-full border-0 bg-transparent text-sm text-ink shadow-none outline-none [box-shadow:none] placeholder:text-muted focus:[box-shadow:none]"
                        />
                      </div>
                    </>
                  ) : null}

                  <div className={cn('min-h-0 flex-1 space-y-1 overflow-y-auto', searchable ? 'mt-3' : '')}>
                    {filteredOptions.length ? (
                      filteredOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={cn(
                            'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-brand-50 dark:hover:bg-white/5',
                            value === option.value && 'bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-brand-200',
                          )}
                          onClick={() => {
                            onChange(option.value);
                            setQuery('');
                            setIsOpen(false);
                            onBlur?.();
                          }}
                        >
                          {option.leading ? <span>{option.leading}</span> : null}
                          <span>{option.label}</span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted">{emptyLabel}</p>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
};
