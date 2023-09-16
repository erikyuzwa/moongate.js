import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import EsLint from 'vite-plugin-linter'
const { EsLinter, linterPlugin } = EsLint
import * as packageJson from './package.json'
// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    //react(),
    //tsConfigPaths(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
    //dts({
    //  include: ['src/'],
    //}),
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.js'),
      name: 'moongate',
      formats: ['es', 'umd'],
      fileName: (format) => `moongate.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
}))