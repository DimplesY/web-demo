import { build } from 'bun'

build({
  entrypoints: [
    './index.ts'
  ],
  outdir: './dist',
  experimentalCss: true
})
