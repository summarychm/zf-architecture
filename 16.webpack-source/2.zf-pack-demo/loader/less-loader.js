let less = require("less");
function loader(source) {
  console.log('============  begin ====================');
  console.log("less-loader");
  console.log('============  end ======================');
  let css = "";
  less.render(source, function (err, c) {
    css = c.css // 获取渲染后的css
  });
  // css=css.replace(/\n/g,"\\n");
  return css;
}
module.exports = loader;