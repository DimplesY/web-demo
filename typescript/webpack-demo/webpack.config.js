const path = require('path')

/** @type import('webpack').Configuration */
module.exports = {
  entry: {
    main: './src/index.ts',
    foo: './src/foo.ts',
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name]-[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /.json$/,
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/json-loader.js'),
            options: {},
          },
        ],
      },
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
}
