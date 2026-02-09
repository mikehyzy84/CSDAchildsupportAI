import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Note: Client-side code should use import.meta.env.VITE_* for environment variables
  // Server-side API functions in /api have access to process.env
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
