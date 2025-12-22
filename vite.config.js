import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    target: 'ES2022',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'playcanvas': ['playcanvas']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@/config': resolve(__dirname, './src/config'),
      '@/data': resolve(__dirname, './src/data'),
      '@/systems': resolve(__dirname, './src/systems'),
      '@/presentation': resolve(__dirname, './src/presentation')
    }
  },
  optimizeDeps: {
    include: ['playcanvas', 'zod']
  },
  esbuild: {
    target: 'ES2022'
  }
});
