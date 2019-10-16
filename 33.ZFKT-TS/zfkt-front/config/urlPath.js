const path=require("path");

module.exports={
  dist: path.join(__dirname, "dist"),
  nodeModules: path.resolve(__dirname, 'node_modules'),
  templateHtml: './public/index.html',
  $types:path.resolve(__dirname,'../src/typings')
}
