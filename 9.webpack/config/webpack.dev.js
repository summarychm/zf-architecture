const webpack = require('webpack');
const path=require('path');
const HtmlWebPackPlugin=require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    hot: true
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  }
}