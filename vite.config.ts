import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    clearScreen: false,
    server: {
      port: 3000,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: 'ws',
            host,
            port: 3001,
          }
        : (process.env.DISABLE_HMR !== 'true'),
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/src-tauri/**'],
      },
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    build: {
      target:
        process.env.TAURI_ENV_PLATFORM === 'windows'
          ? 'chrome105'
          : 'safari13',
      minify: !process.env.TAURI_ENV_DEBUG,
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
  };
});
