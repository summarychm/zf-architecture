
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
  // 异步/批量处理回调钩子,让promise可以使用then绑定回调函数,延迟绑定
  // 通过.then方法和exector中的resolve&reject来触发promise的回调
  handleCallbackAll: (promise) => {
    setTimeout(() => {
      let {handlers, state, result} = promise;
      while (handlers.length) handleCallback(handlers.shift(), state, result);
    }, 0);
    // 核心方法二: 在当前promise和下一个pormise之间进行状态传递
    function handleCallback(handler, state, result) {
      
      let {onFulfilled, onRejected, resolve, reject} = handler;
      // console.log("==============",onFulfilled, onRejected)
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
  //核心方法三: 处理value的各种边界值,并触发对应的钩子函数
  resolvePromise: (promise, result, onFulfilled, onRejected) => {
    if (result === promise) return onRejected(new TypeError('promise循环引用自身'));
    //1. 如果result是promise 类型,就通过result.then获取其state和value,将其作为作为result传给回调函数
    if (tools.isPromise(result)) return result.then(onFulfilled, onRejected)
    //2. 如果result是thenable对象(类promise)，就先取出then的结果,再包装为promise.
    if (tools.isThenable(result)) {
      try {
        let then = result.then;
        if (tools.isFunction(then))// 将result作为onFulfilled的值传入then
          return new Promise(then.bind(result)).then(onFulfilled, onRejected)
      } catch (error) {
        return onRejected(error)
      }
    }
    //3. 其他情况将result直接传给回调函数.
    onFulfilled(result);
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
      // 更新promise实例的vlaue和state,并触发对应的钩子函数
      tools.resolvePromise(this, value, onFulfilled, onRejected);
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
  // 注册promise的回调函数.
  then(onFulfilled, onRejected) {
    // 1.返回一个新的Promise
    // 2.注册回调钩子.
    // 3.如果state已经更改(同步resolve)触发结束流程(异步,更改value,state,派发callback),如果state是Pending则跳过,由exector处理
    return new Promise((resolve, reject) => {
      this.handlers.push({onFulfilled, onRejected, resolve, reject});
      this.state !== PENDING && tools.handleCallbackAll(this);//同步的promise,则在县一个事件队列中处理结束流程
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
    promises.forEach((promise, i) => {
      // 如果是promise,通过.then将collectValue注册为回调函数,更新Ary项
      if (tools.isPromise(promise)) promise.then(collectValue(i), reject)
      else collectValue(i)(promise)// 非promise的情况,直接完成,更新Ary项
    });
    // 更新Ary项,判断是否到达边界.
    function collectValue(index) {
      return function (value) {
        values[index] = value
        count += 1
        // 全部promise执行完毕,将ary包装为resolve返回
        count === promises.length && resolve(values)
      }
    }
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
