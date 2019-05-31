const HtmlWebpackPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const path = require('path');


module.exports = {
  entry: './public/main.ts',

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.[chunkhash].js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'public/sw.js'),
    }),
  ],

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
    },
    {
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    },
    {
      test: /\.pug$/,
      loader: 'pug-loader',
    },
    {
      test: /\.(img|jpeg|jpg|png)$/,
      loader: 'file-loader?name=img/[name].[ext]',
    },
    ],
  },
};
