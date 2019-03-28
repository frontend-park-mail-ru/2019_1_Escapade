const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './public/main.js',

  plugins: [
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'public/sw.js'),
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [{
      test: /\.pug$/,
      use: 'pug-loader',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    ],
  },
};
