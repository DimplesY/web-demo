const { webpack } = require('webpack')
const path = require('path')


class MyPlugin {
  /**
   * 
   * @param {import('webpack').Compiler} compiler 
   */
  apply(compiler) {
    compiler.hooks.beforeRun.tap('MyPlugin', () => {
      console.log('before run')
    })

    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('compilation')
    })

    compiler.hooks.compile.tap('MyPlugin', () => {
      console.log('compile')
    })
  }
}

function build() {
  webpack({
    entry: './src/index.ts',
    module: {
      rules: [
        { test: /\.ts$/, use: 'ts-loader' },
      ],
    },
    plugins: [
      new MyPlugin()
    ]
  }).run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err)
      process.exit(1)
    }
  })
}

build()
