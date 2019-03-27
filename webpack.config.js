const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = {
  entry: './public/main.js',

  plugins: [
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'public/sw.js'),
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [{
      test: /\.pug$/,
      use: 'pug-loader',
    }],
  },
};
