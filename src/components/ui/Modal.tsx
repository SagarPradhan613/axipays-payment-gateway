import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@components/ui/Button';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal = ({ open, title, description, onClose, children }: ModalProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg rounded-4xl bg-surface p-6 shadow-soft"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.94 }}
          transition={{ duration: 0.24 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
              {description ? <p className="text-sm text-muted">{description}</p> : null}
            </div>
            <Button aria-label="Close modal" variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {children ? <div className="mt-6">{children}</div> : null}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
