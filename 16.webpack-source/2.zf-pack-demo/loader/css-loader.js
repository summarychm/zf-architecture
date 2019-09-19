function loader(source) {
  console.log('============  begin ====================');
  console.log("css-loader");
  console.log('============  end ======================');
  // 使用正则匹配出所有的url()格式,将其替换为require的写法,最后由webpack统一替换为webpack_require
  // 使用reg.exce()配合last
  const reg = /url\((.+?)\)/g;
  let pos = 0; //匹配位置游标
  let current = null;
  let ary = ['let list=[];'];
  while (current = reg.exec(source)) {
    const [matchUrl, g] = current;
    let last = reg.lastIndex - matchUrl.length;
    ary.push(`list.push(${JSON.stringify(source.slice(pos, last))})`);//追加pre部分.
    // 将url中的路径改为require引用的方式,后面通过url-loader转为最终的图片地址
    ary.push(`list.push('url('+require(${g})+')');`);// 追加当前匹配url
    pos = reg.lastIndex;// 更新匹配游标
  }
  ary.push(`list.push(${JSON.stringify(source.slice(pos))});`);
  ary.push(`module.exports=list.join("");`);
  source = ary.join("\r\n");
  // loaderUtils.stringifyRequest(this,"") //转化为相对路径
  return source;
}

module.exports = loader;