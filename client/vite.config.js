// vite.config.js
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning threshold if needed
    rollupOptions: {
      output: {
        manualChunks: {
          // Example: Split vendor libraries
          react: ['react', 'react-dom'],
          chartjs: ['chart.js'],
        }
      }
    }
  }
})