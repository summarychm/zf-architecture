
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const url = require("./urlPath")

module.exports = {
  mode: "development",
  entry: url.entry,
  output: {
    filename: "bundle.js",
    path: url.dist,
  },

  devtool: "source-map", //改为精简模式,source-map
  devServer: {
    hot: true,
    contentBase: url.dist, // 
    historyApiFallback: {
      index: url.wdsNotFoundUrl
    }
  },
  resolve: {
    alias: {
      "~": url.nodeModules,
      "$types": url.$types,
      "$component":url.$component,
      "$actions":url.$actions
    },
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [{
      test: /\.(j|t)sx?$/,
      exclude: /node_modules/,
      // exclude: path.resolve(__dirname, 'node_modules')
      loader: "ts-loader",
      options: {
        transpileOnly: true
      }
    }, {
      enforce: "pre",
      test: /\.(j|t)sx?$/,
      loader: "source-map-loader"
    }, {
      test: /\.css$/,
      loader: ['style-loader', 'css-loader']
    }, {
      test: /\.less$/,
      use: ['style-loader', "css-loader", "less-loader"]
    }, {
      test: /\.(git|svg|png|jpg|jpeg)$/,
      use: ['url-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: url.templateHtml
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}