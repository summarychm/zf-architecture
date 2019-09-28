const {SyncHook} = require("tapable");
// let SyncHook = require('./lib/SyncHook.js')

let h1 = new SyncHook(['options']);

h1.tap('A', function (arg) {
  console.log('参数:A',arg);
  return 'b'; // 除非你在拦截器上的 register 上调用这个函数,不然这个返回值你拿不到.
})

h1.tap('B', function () {
  console.log('b')
})
h1.tap('C', function () {
  console.log('c')
})
h1.tap('D', function () {
  console.log('d')
})

h1.intercept({
  call: (...args) => {
    console.log(...args, '-------------intercept call');
  },
  //
  register: (tap) => {
  console.log(tap, '------------------intercept register');

    return tap;
  },
  loop: (...args) => {
    console.log(...args, '-------------intercept loop')
  },
  tap: (tap) => {
    console.log(tap, '-------------------intercept tap')

  }
})
h1.call(6);