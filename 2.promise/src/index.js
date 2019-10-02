
// 来自工业聚大佬的分享  
// github https://github.com/Lucifier129/promise-aplus-impl/blob/master/src/index.js
// 文章 https://mp.weixin.qq.com/s/qdJ0Xd8zTgtetFdlJL3P1g
// const delay = (f, time = 0) => value => setTimeout(() => f(value), time)

const PENDING = Symbol('pending')
const FULFILLED = Symbol('fulfilled')
const REJECTED = Symbol('rejected')

const tools = {
  delay: (f, time = 0) => value => setTimeout(f, time, value), // 第三个参数value是f的形参
  isFunction: obj => typeof obj === 'function',
  toString: Object.prototype.toString,
  isObject: obj => tools.toString.call(obj) === '[object Object]',
  isThenable: obj => (tools.isObject(obj) || tools.isFunction(obj)) && 'then' in obj,
  isPromise: promise => promise instanceof Promise,
}

// 核心方法一: 变更promsie的状态
const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return
  promise.state = state
  promise.result = result
  notifyCallBackAll(promise)
}

// 核心方法二: 在当前promise和下一个pormise之间进行状态传递
const notifyCallBack = (handler, state, result) => {
  let {onFulfilled, onRejected, resolve, reject} = handler
  try {
    if (state === FULFILLED)
      tools.isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    else if (state === REJECTED)
      tools.isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
  } catch (error) {
    reject(error)
  }
}
// 批量处理notifyCallBack
// 延时触发promise的回调函数,让promise可以使用then绑定回调函数,延迟绑定
// 通过.then方法和exector中的resolve&reject来触发promise的回调
const notifyCallBackAll = tools.delay(promise => {
  let {handlers, state, result} = promise
  while (handlers.length)// 依次调用每个then绑定
    notifyCallBack(handlers.shift(), state, result)
});

//核心方法三: resolvePromise(处理value的各种边界值)
const resolvePromise = (promise, value, onFulfilled, onRejected) => {
  if (value === promise)
    return onRejected(new TypeError('Can not fufill promise with itself'))
  //判断 result 是不是 promise 类型，是就调用 then(resolve, reject) 取它的 value 或 reason。
  if (tools.isPromise(value))
    return value.then(onFulfilled, onRejected)
  //判断 result 是不是 thenable 对象，是就先取出 then，再用 new Promise 去进入 The Promise Resolution Procedure 过程。
  if (tools.isThenable(value)) {
    try {
      let then = value.then
      if (tools.isFunction(then))
        return new Promise(then.bind(value)).then(onFulfilled, onRejected)
    } catch (error) {
      return onRejected(error)
    }
  }
  onFulfilled(value)
}




function Promise(exector) {
  this.state = PENDING
  this.handlers = []
  let onFulfilled = value => transition(this, FULFILLED, value)
  let onRejected = reason => transition(this, REJECTED, reason)
  let ignore = false //保证 resolve/reject只调用一次
  let resolve = value => {
    if (ignore) return
    ignore = true
    resolvePromise(this, value, onFulfilled, onRejected)
  }
  let reject = reason => {
    if (ignore) return
    ignore = true
    onRejected(reason)
  }
  try {
    exector(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 1.返回一个新的Promise
  // 2.注册回调钩子.
  // 3.如果state已经更改(同步resolve),派发回调钩子
  return new Promise((resolve, reject) => {
    this.handlers.push({onFulfilled, onRejected, resolve, reject});
    this.state !== PENDING && notifyCallBackAll(this)
  });
}


Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

Promise.resolve = value => new Promise(resolve => resolve(value))
Promise.reject = reason => new Promise((_, reject) => reject(reason))



Promise.all = (promises = []) => {
  return new Promise((resolve, reject) => {
    let count = 0
    let values = new Array(promises.length)
    let collectValue = index => value => {
      values[index] = value
      count += 1
      count === promises.length && resolve(values)
    }
    promises.forEach((promise, i) => {
      if (tools.isPromise(promise)) {
        promise.then(collectValue(i), reject)
      } else {
        collectValue(i)(promise)
      }
    })
  })
}
Promise.race = (promises = []) => {
  return new Promise((resolve, reject) =>
    promises.forEach(promise => {
      if (tools.isPromise(promise)) {
        promise.then(resolve, reject)
      } else {
        resolve(promise)
      }
    })
  )
}

module.exports = Promise
