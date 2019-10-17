const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  dist: path.join(__dirname, "../dist"),
  wdsNotFoundUrl: './index.html',
  nodeModules: path.resolve(__dirname, '../node_modules'),
  templateHtml: './public/index.html',
  $types: path.resolve(__dirname, '../src/typings')
}
