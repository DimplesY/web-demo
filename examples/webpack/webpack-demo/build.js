const { webpack } = require('webpack')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { JAVASCRIPT_MODULE_TYPE_AUTO, JSON_MODULE_TYPE, ASSET_MODULE_TYPE, CSS_MODULE_TYPE_MODULE } = require('webpack/lib/ModuleTypeConstants')

const path = require('path')
const MyParaser = require('./parser')

class MyPlugin {
  /**
   *
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.beforeRun.tap('MyPlugin', (...args) => {
      console.log('before run')
    })

    compiler.hooks.compilation.tap('MyPlugin', (compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.createParser.for(CSS_MODULE_TYPE_MODULE).tap('MyPlugin', (parserOptions) => {
        return new MyParaser(parserOptions)
      })
    })

    compiler.hooks.compile.tap('MyPlugin', () => {
      console.log('compile')
    })
  }
}


function build() {
  webpack({
    mode: 'development',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.css'],
    },
    plugins: [new MiniCssExtractPlugin(), new MyPlugin()],
  }).run((err, stats) => {
    if (err || stats.hasErrors()) {
      process.exit(1)
    }
  })
}

build()
