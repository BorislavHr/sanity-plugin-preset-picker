import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/patterns.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'es2022',
  // Peer dependencies are external automatically; the JSX runtime must be too.
  external: ['react/jsx-runtime'],
});
