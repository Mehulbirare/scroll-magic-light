import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['react', 'react-dom'],
    treeshake: true,
  },
  {
    entry: { 'react/index': 'src/react/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom'],
    treeshake: true,
    esbuildOptions(options) {
      options.jsx = 'automatic'
    },
  },
  {
    entry: { 'scroll-magic-lite': 'src/iife.ts' },
    format: ['iife'],
    globalName: 'ScrollMagicLite',
    outDir: 'dist',
    minify: true,
    sourcemap: false,
    target: 'es2017',
  },
])
