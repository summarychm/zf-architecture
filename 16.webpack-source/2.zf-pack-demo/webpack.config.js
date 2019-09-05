let path = require("path");

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
  }
}