const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')

// html文件地址
const HTML_PATH = path.resolve(__dirname, 'index.html')
// 目标地址
const TARGET_PATH = path.resolve(__dirname, 'dist')
// 输出js的地址
const OUTPUT_PATH = './index.js'

/**
 * 自定义插件
 */
const plugin = {
  name: 'my-plugin',
  setup({ onEnd }) {
    onEnd(({ errors }) => {
      console.log(errors)
      if (!errors.length) {
        let data = fs.readFileSync(HTML_PATH, { encoding: 'utf-8' })
        data = data.replace(`{scripts}`, OUTPUT_PATH)
        fs.writeFileSync(path.resolve(TARGET_PATH, 'index.html'), data, {
          encoding: 'utf-8',
        })
      }
    })
  },
}

esbuild
  .build({
    entryPoints: [path.resolve(__dirname, 'index.ts')],
    outdir: path.resolve(__dirname, 'dist'),
    bundle: true,
    plugins: [plugin],
  })
  .then((msg) => {
    if (msg.length) throw new Error('compile error')
    console.log('compile success')
  })
