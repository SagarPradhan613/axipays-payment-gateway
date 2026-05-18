import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@locales': fileURLToPath(new URL('./src/locales', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/')
          ) {
            return 'vendor-react';
          }

          if (id.includes('/framer-motion/')) {
            return 'vendor-ui';
          }

          if (id.includes('/react-hook-form/') || id.includes('/zod/')) {
            return 'vendor-forms';
          }

          if (id.includes('/zustand/')) {
            return 'vendor-state';
          }

          if (id.includes('/i18next/') || id.includes('/react-i18next/')) {
            return 'vendor-i18n';
          }

          return undefined;
        },
      },
    },
  },
});
