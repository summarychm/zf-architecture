
const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const url = {
  dist: path.join(__dirname, "dist"),
  nodeModules: path.resolve(__dirname, 'node_modules'),
  templateHtml: './public/index.html',
}

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: url.dist,
  },

  devtool: "source-map", //改为精简模式,source-map
  devServer: {
    hot: true,
    contentBase: url.dist,
    historyApiFallback: {
      index: './index.html'//webpack打包后生成到目标根目录下面的index.html文件
    }
  },
  resolve: {
    alias: {
      "~": url.nodeModules,
    },
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [{
      test: /\.(j|t)sx?$/,
      loader: "ts-loader",
      // exclude: path.resolve(__dirname, 'node_modules')
      exclude: /node_modules/,
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
    new webpack.HotModuleReplacementPlugin()
  ],
}