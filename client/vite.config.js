import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
   outDir: 'dist', 
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize chunks
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'],
        }
      }
    }
  }
});