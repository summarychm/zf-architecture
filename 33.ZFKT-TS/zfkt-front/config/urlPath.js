const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  dist: path.join(__dirname, "../dist"),
  wdsNotFoundUrl: './index.html',
  nodeModules: path.resolve(__dirname, '../node_modules'),
  templateHtml: './public/index.html',

  // alias url
  $types: path.resolve(__dirname, '../src/typings'),
  $component: path.resolve(__dirname, '../src/component'),
  $actions: path.resolve(__dirname, "../src/store/actions"),
  $assets: path.resolve(__dirname, "../public"),
  $utils: path.resolve(__dirname, "../src/utils"),
}
