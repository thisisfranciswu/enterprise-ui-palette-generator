const path = require('path');

module.exports = {
  entry: './js/main.js',  // Your main JS file
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'development'
};