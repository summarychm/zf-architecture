let path = require("path");

let PluginA = require("./plugin/pluginA.js");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.less$/, use: [
          path.resolve(__dirname, "loader", "style-loader.js"),
          path.resolve(__dirname, "loader", "less-loader.js")
        ]
      },
    ]
  },
  plugins: [new PluginA({k1:"k1"})]
}