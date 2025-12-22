import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.test.ts', '**/*.spec.ts'],
    },
  },
  resolve: {
    alias: {
      '@/config': resolve(__dirname, './src/config'),
      '@/data': resolve(__dirname, './src/data'),
      '@/systems': resolve(__dirname, './src/systems'),
      '@/presentation': resolve(__dirname, './src/presentation'),
    },
  },
});
