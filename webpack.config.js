const HtmlWebpackPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const path = require('path');


module.exports = {
  entry: './public/main.ts',

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'public/sw.ts'),
    }),
  ],

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader:
            'babel-loader',
          options: {
            presets: [
              '@babel/typescript',
              ['@babel/preset-env', {
                targets: {
                  edge: 15,
                },
              }],
            ],
          },
        },
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
