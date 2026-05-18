import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@components/layout/LanguageToggle';
import { ThemeToggle } from '@components/layout/ThemeToggle';
import { Button } from '@components/ui';
import { cn } from '@utils';

const navItems = [
  { to: '/checkout', key: 'common:navigation.checkout' },
  { to: '/dashboard', key: 'common:navigation.dashboard' },
];

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-app/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-300/50 bg-brand-600/10 text-brand-600 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300">
            <span className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-current" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">Axipays</p>
          <p className="truncate text-sm text-muted">{t('common:app.tagline')}</p>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 border-b-2 border-transparent px-1 py-2 text-sm font-semibold transition',
                  isActive ? 'border-brand-600 text-brand-600' : 'text-muted hover:text-ink',
                )
              }
            >
              <span className="hidden sm:inline">{t(key)}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            aria-label={isOpen ? t('common:actions.closeMenu') : t('common:actions.openMenu')}
            variant="ghost"
            size="sm"
            className="rounded-full md:hidden"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div className="px-4 py-3 md:hidden">
          <div className="space-y-2">
            {navItems.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-brand-200'
                      : 'bg-surface text-ink',
                  )
                }
              >
                <span>{t(key)}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
};
