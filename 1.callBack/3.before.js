/**
 * 创建一个调用 cb 的函数。 调用次数不超过 total 次。 之后再调用这个函数，将返回最后一个调用的结果。
 * @param {Number} total 函数执行上限
 * @param {Function} cb 回调函数
 */
function before(total, cb) {
  let result; // 缓存最终的返回值,如果超过边界则返回该值
  if (typeof cb != 'function') return new TypeError("应为一个函数!");
  return () => {
    if (--total >= 0)
      result = cb();
    if (total <= 0)
      cb = null;
    return result;
  }
}
// // testCode
// document.querySelector('#wiki-content').addEventListener("click", before(3, function () {
//   console.log("点击事件");
// }));

let ceshi=before(3,()=>{console.log("运行",Date.now())})
setInterval(function(){
  console.log("setInterval");
},100)