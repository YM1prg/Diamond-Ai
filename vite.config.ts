// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Optional: Use a custom server if needed
  },
  // ✅ Add this to fix .onnx MIME type
  publicDir: 'public',
  assetsInclude: ['**/*.onnx'], // ← Tell Vite to include .onnx as asset
});
