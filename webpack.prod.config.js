const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
  mode: 'production',
  target: ['web', 'es5'],
  entry: './src/index.js',
  optimization: {
    minimize: true,
  },
  output: {
    pathinfo: true,
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body',
    }),
    new HtmlInlineScriptPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }, {
        test: /\.(mp3|gif|png|jpe?g|svg)$/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      assets: path.join(__dirname, 'assets/'),
    },
  },
  stats: 'minimal',
  performance: {
    hints: false,
  },
}
