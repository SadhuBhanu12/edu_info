import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    plugins: [
      react(),
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE ? visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    }) : undefined,
    
    // Gzip compression
    mode === 'production' ? viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false
    }) : undefined,
    
    // Brotli compression (better than gzip)
    mode === 'production' ? viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }) : undefined
  ].filter(Boolean),

  // Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2015',
    
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production debugging
    sourcemap: mode === 'production' ? 'hidden' : true,
    
    // Minification
    minify: 'esbuild',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunking for optimal code splitting
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
          }
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset'
          const info = name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    
    // Compression
    reportCompressedSize: true,
    
    // Optimize deps
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@supabase/supabase-js'
    ],
    exclude: []
  },

  // Server configuration
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 443,
      host: 'procuratorial-chlorinous-ayaan.ngrok-free.dev'
    },
    // Warm up frequently used files
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/Home/HomePage.tsx',
        './src/pages/UserDashboard/UserDashboard.tsx'
      ]
    }
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  }
};
  
  return config;
});
