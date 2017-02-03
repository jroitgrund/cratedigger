var path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    'index': './src/index',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'index.js',
    publicPath: 'http://localhost:8080/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunks: ["index"],
    }),
  ],
  resolve: {
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
};
