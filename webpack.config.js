const path = require('path');

module.exports = {
  entry: './public/main.js',
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
