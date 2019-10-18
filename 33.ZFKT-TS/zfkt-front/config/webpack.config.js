
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
      "$component": url.$component,
      "$actions": url.$actions,
      "$assets": url.$assets,
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
      loader: ['style-loader', 'css-loader', {
        loader: "postcss-loader",
        options: {
          plugins: [
            require("autoprefixer")(),
            require("postcss-pxtorem")({
              rootValue: 100,// 根元素大小
              unitPrecision: 5, // 保留的小数位
              propList: ['*'], // 支持哪些属性
              selectorBlackList: [], //哪些属性不会被转义
              minPixelValue: 12 // 转换临界值
            }),
          ]
        }
      }]
    }, {
      test: /\.less$/,
      use: ['style-loader', "css-loader", {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          plugins: [
            require("autoprefixer")(),
            require("postcss-pxtorem")({
              rootValue: 100,// 根元素大小
              unitPrecision: 5, // 保留的小数位
              propList: ['*'], // 支持哪些属性
              selectorBlackList: [], //哪些属性不会被转义
              minPixelValue: 12 // 转换临界值
            }),
          ]
        }
      }, "less-loader"]
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