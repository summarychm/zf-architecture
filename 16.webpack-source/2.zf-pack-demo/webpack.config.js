let path = require("path");

let PluginA = require("./plugin/pluginA.js");

module.exports = {
  mode:"development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: path.resolve(__dirname, "loader", "babel-loader.js"),
        options: {
          presets: ["@babel/preset-env"]
        }
      }]
    }, {
      test: /\.less$/, use: [
        path.resolve(__dirname, "loader", "style-loader.js"),
        path.resolve(__dirname, "loader", "less-loader.js")
      ]
    }]
  },
  // plugins: [new PluginA({k1: "k1"})]
}