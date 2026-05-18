import type { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const PageWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
