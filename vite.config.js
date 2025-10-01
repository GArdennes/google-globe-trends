import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configure esbuild to handle JSX in .js files
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  
  // Define aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@data': path.resolve(__dirname, './src/data'),
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          globe: ['react-globe.gl'],
          utils: ['axios', 'moment', 'xml2js'],
        },
        // Optimize asset naming for fonts
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-globe.gl', 'axios', 'moment', 'xml2js'],
  },
  
  // CSS configuration for Sass
  css: {
    preprocessorOptions: {
      scss: {
        // Remove variables import since file doesn't exist
      },
    },
  },

  // Font and asset handling
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.otf'],
  
  // Environment variables (if needed)
  define: {
    // Define global constants here if needed
    __DEV__: JSON.stringify(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
  },
})