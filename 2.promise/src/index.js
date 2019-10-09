
// 来自工业聚大佬的分享  
// github https://github.com/Lucifier129/promise-aplus-impl/blob/master/src/index.js
// 文章 https://mp.weixin.qq.com/s/qdJ0Xd8zTgtetFdlJL3P1g

const PENDING = Symbol('pending')
const FULFILLED = Symbol('fulfilled')
const REJECTED = Symbol('rejected')

const tools = {
  isFunction: obj => typeof obj === 'function',
  toString: Object.prototype.toString,
  isObject: obj => tools.toString.call(obj) === '[object Object]',
  isThenable: obj => (tools.isObject(obj) || tools.isFunction(obj)) && 'then' in obj,
  isPromise: promise => promise instanceof Promise,
  // 核心方法一: 变更promsie的状态,处理回调函数
  transition: (promise, state, result) => {
    if (promise.state !== PENDING) return
    promise.state = state
    promise.result = result
    tools.handleCallbackAll(promise);//处理then回调
  },
  // 延时/批量处理回调钩子,让promise可以使用then绑定回调函数,延迟绑定
  // 通过.then方法和exector中的resolve&reject来触发promise的回调
  handleCallbackAll: (promise) => {
    setTimeout(() => {
      let {handlers, state, result} = promise;
      while (handlers.length) handleCallback(handlers.shift(), state, result);
    }, 0)
    // 核心方法二: 在当前promise和下一个pormise之间进行状态传递
    function handleCallback(handler, state, result) {
      let {onFulfilled, onRejected, resolve, reject} = handler;
      try {
        if (state === FULFILLED)
          tools.isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
        else if (state === REJECTED) // reject被处理后会继续向下执行,所以用resolve.
          tools.isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
      } catch (error) {
        reject(error)
      }
    }
  },
  //核心方法三: 处理value的各种边界值
  resolvePromise: (promise, result, onFulfilled, onRejected) => {
    if (result === promise) return onRejected(new TypeError('promise循环引用自身'));
    //如果是promise 类型，是就调用then(resolve, reject)取它的 result 或 reason。
    if (tools.isPromise(result)) return result.then(onFulfilled, onRejected)
    // 如果是thenable对象(类promise)，就先取出 then的结果,再包装为promise.
    if (tools.isThenable(result)) {
      try {
        let then = result.then;
        if (tools.isFunction(then))// 将result作为onFulfilled的值传入then
          return new Promise(then.bind(result)).then(onFulfilled, onRejected)
      } catch (error) {
        return onRejected(error)
      }
    }
    onFulfilled(result);//其他情况将result直接返回.
  }
}

// Promise 构造函数
class Promise {
  constructor(exector) {
    this.state = PENDING;
    this.result = null;
    this.handlers = [];

    let onFulfilled = value => tools.transition(this, FULFILLED, value)
    let onRejected = reason => tools.transition(this, REJECTED, reason)

    let ignore = false // 保证 resolve/reject只调用一次
    let resolve = value => {
      if (ignore) return
      ignore = true
      tools.resolvePromise(this, value, onFulfilled, onRejected);// 更改promise的state和value值
    }
    let reject = reason => {
      if (ignore) return
      ignore = true
      onRejected(reason)
    }
    try {
      // 依赖翻转,将控制权交给调用者,调用resolve,reject
      exector(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }
  // 构造县一个promise的result.
  then(onFulfilled, onRejected) {
    // 1.返回一个新的Promise
    // 2.注册回调钩子.
    // 3.如果state已经更改(同步resolve)触发结束流程(更改value,state,派发callback),如果state是Pending则跳过,由exector处理
    return new Promise((resolve, reject) => {
      this.handlers.push({onFulfilled, onRejected, resolve, reject});
      this.state !== PENDING && tools.handleCallbackAll(this);
    });
  }
  // promise的catch方法
  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

Promise.resolve = value => new Promise(resolve => resolve(value))
Promise.reject = reason => new Promise((_, reject) => reject(reason))

Promise.all = (promises = []) => {
  return new Promise((resolve, reject) => {
    let count = 0
    let values = new Array(promises.length)
    // 更新结果Ary,判断是否到达边界.
    let collectValue = index => value => {
      values[index] = value
      count += 1
      // 全部执行完毕则resolve结果Ary
      count === promises.length && resolve(values)
    }
    promises.forEach((promise, i) => {
      // 如果是promise,则待其执行完毕,再调用collectValue
      if (tools.isPromise(promise)) promise.then(collectValue(i), reject)
      else collectValue(i)(promise)
    })
  })
}

Promise.race = (promises = []) => {
  return new Promise((resolve, reject) =>
    promises.forEach(promise => {
      if (tools.isPromise(promise)) promise.then(resolve, reject)
      else resolve(promise)
    })
  )
}

module.exports = Promise
