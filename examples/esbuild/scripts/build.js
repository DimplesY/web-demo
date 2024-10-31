import * as esbuild from 'esbuild'
import vue from 'unplugin-vue/esbuild'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot= path.resolve(__dirname, '..')

esbuild.build({
  entryPoints: [path.relative(projectRoot, 'src/index.ts')],
  bundle: true,
  outdir: path.resolve(projectRoot, 'dist'),
  plugins: [
    vue()
  ]
}).then(() => {
  console.log('build success')
})
