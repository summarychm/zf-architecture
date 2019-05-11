/**
 * after 在函数执行xxx次后执行回调
 * @param {number} total 函数的调用上限
 * @param {function} cb 到达上限后的回调事件
 */
function after(total, cb) {
  if (typeof cb != 'function') throw new TypeError('Expected a function');
  // 形参total被缓存了起来,每次递减,直到触发回调
  return function (...args) {
    if (--total < 1)
      return cb.call(this, args);
  }
}

// // testCode
// var saves = ['profile', 'settings'];
// var done = after(saves.length, function () {
//   console.log('done saving!');
// });
// saves.forEach(function (item) {
//   console.log(item);
//   done();
// });
module.exports={after:after}