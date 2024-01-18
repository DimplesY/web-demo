const fs = require('fs')
const esbuild = require('esbuild')

// 使用 esbuild 的 API 进行打包
esbuild
  .build({
    entryPoints: ['./index.jsx'],
    bundle: true,
    plugins: [require('../plugins/index')],
    outfile: 'out.js',
  })
  .catch(() => process.exit(1))
