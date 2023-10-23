const { webpack } = require('webpack')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { JAVASCRIPT_MODULE_TYPE_AUTO, JSON_MODULE_TYPE, ASSET_MODULE_TYPE } = require('webpack/lib/ModuleTypeConstants')

const path = require('path')
const MyParaser = require('./parser')

class MyPlugin {
  /**
   *
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.beforeRun.tap('MyPlugin', () => {})

    compiler.hooks.compilation.tap('MyPlugin', (compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.createParser.for(JAVASCRIPT_MODULE_TYPE_AUTO).tap('MyPlugin', (parserOptions) => {
        return new MyParaser(parserOptions)
      })
    })

    compiler.hooks.compile.tap('MyPlugin', () => {})
  }
}


function myLoader(sourceCode) {
  console.log(sourceCode)
  return sourceCode
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
    plugins: [new MiniCssExtractPlugin()],
  }).run((err, stats) => {
    if (err || stats.hasErrors()) {
      process.exit(1)
    }
  })
}

build()
