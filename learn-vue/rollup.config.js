import { defineConfig } from 'rollup'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  input: './src/index.js',
  output: {
    file: './dist/vue.js',
    format: 'umd',
    name: 'Vue',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: /node_modules/,
      babelHelpers: 'bundled',
    }),
  ],
})
