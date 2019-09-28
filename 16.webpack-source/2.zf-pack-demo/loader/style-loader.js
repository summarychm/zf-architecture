let loaderUtils = require('loader-utils');
// normalLoader在这里被废弃了
function loader(source) {
  let style = `
    let style=document.createElement('style');
    style.innerHTML=${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
  return style;
}
// remainingRequest 剩余的loader
loader.pitch = function (remainingRequest) {
  // 1.将剩余模块转为相对地址,并应用inlineLoader的"!!"
  let relativePath = loaderUtils.stringifyRequest(this, "!!" + remainingRequest);
  console.log('============  begin ====================');
  console.log("style-loader");
  console.log('============  end ======================');
  // 2.使用require包裹剩余的loader
  let str = `
    let style=document.createElement('style');
    style.innerHTML=require(${relativePath});
    document.head.appendChild(style);
  `
  return str;
}
module.exports = loader;
