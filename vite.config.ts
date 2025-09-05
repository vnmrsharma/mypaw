import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for MyPaw app
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Run on localhost:3000
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude from pre-bundling
  },
});
