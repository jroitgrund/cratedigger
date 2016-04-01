var path = require('path');
var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"',
});

module.exports = {
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [definePlugin],
};
