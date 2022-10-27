const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  target: ['web', 'es5'],
  entry: './src/index.js',
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
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
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
  devtool: 'source-map',
  performance: {
    hints: false,
  },
}
