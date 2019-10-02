function isPromise(obj) {
  let flag = false;
  if ((typeof obj === "object" && obj !== null) || typeof obj === "function") {
    if (typeof obj.then === 'function') flag = true;
  }
  return flag;
}

// 解析value的值,并将其包装为promise返回(支持常量/Promise/Promise嵌套)
// 常量直接包装并返回,Promise则调用.then(),并处理Promise嵌套的情况.
function resolvePromise(promise2, value, resolve, reject) {
  if (promise2 === value) return reject(newTypeError("循环引用!"));
  try {
    if (isPromise(value)) // 调用value.then获取结果,并使用resolvePromise进行解析为常量(兼容promise嵌套)
      // TODO 这里该采用哪种写法,直接将resolve和reject传递下去?还是像姜文这种用resolvePromise包裹来替代resolve?
      // 这里不直接使用resolve而是用匿名函数+resolvePromise,是为了应对promise.then中返回的还是一个Promise的情况.
      value.then.call(value, data => {resolvePromise(promise2, data, resolve, reject)}, reject)
    else resolve(value);//不是promise则肯定是常量
  } catch (error) {reject(error)}
}


class Promise {
  constructor(exector) {
    this.value = null; // resolveValue
    this.reason = null; // rejectValue
    this.resolveCallBackFn = [];//当then时,status为padding缓存回调(有异步的情况).
    this.rejectCallBackFn = [];
    this.constant = {"pending": "pending", "fulfilled": "fulfilled", "rejected": "rejected"}
    this.status = this.constant.pending;
    console.log("-- Promise constructor");
    // 调用者code有了明确调用(resolve/reject).
    let resolve = value => {
      console.log("-- resolve", this.resolveCallBackFn);
      // 兼容用户传入promise的写法,递归解析,向下传递
      if (value instanceof Promise) return value.then(resolve, reject);
      if (Object.is(this.status, this.constant.pending)) {
        this.value = value;
        this.status = this.constant.fulfilled;
        this.resolveCallBackFn.forEach(fn => fn());
      }
    }
    let reject = value => {
      console.log("-- reject");
      if (Object.is(this.status, this.constant.pending)) {
        this.reason = value;
        this.status = this.constant.rejected;
        this.rejectCallBackFn.forEach(fn => fn());
      }
    }
    try {
      exector(resolve, reject);
    } catch (e) {reject(e)}// Promise初始化时出错,直接调用reject
  }
  // 处理promise实例的返回值(异步)
  then(onfulfilled = f => f, onrejected = f => {throw new Error(f)}) {
    console.log("-- then");
    // TODO 这个setTimeout的是为什么?李兵,工业聚,姜文
    let promise2 = new Promise((resolve, reject) => {
      // 根据当前自身状态进行不同处理
      switch (this.status) {
        case this.constant.fulfilled:
          //promise.then采用延时绑定,所以这里使用setTimeout来模拟microTask,异步获取promise2实例.浏览器内部使用的是microTask而非setTimeout
          setTimeout(() => {
            try {
              let value = onfulfilled(this.value);//获取当前then中onfulfilled返回值
              resolvePromise(promise2, value, resolve, reject);// 根据value的类型来调用不同的处理函数
            } catch (e) {
              reject(e);
            }
          }, 0);
          break;
        case this.constant.rejected:
          setTimeout(() => {
            try {
              let value = onrejected(this.reason);//获取当前then中onrejected返回值
              resolvePromise(promise2, value, resolve, reject);// 根据value的返回值类型来调用不同的处理函数
            } catch (e) {
              reject(e);
            }
          }, 0);
          break;
        case this.constant.pending:// pending状态,延迟执行,暂存resolve和reject回调,等待Promise有明确的返回值
          // 异步promise.then中就不需要使用setTimeout来获取promise2实例了,因为异步promise.then调用时,promise2已经创建了.
          // 只有同步的promise.then才需要使用setTimeout来错开当前执行栈,让promise2初始化.
          try {
            this.resolveCallBackFn.push(() => {
              let x = onfulfilled(this.value);//获取当前then中onfulfilled返回值
              resolvePromise(promise2, x, resolve, reject);
            });
            this.rejectCallBackFn.push(() => {
              //获取当前then中onrejected返回值
              let x = onrejected(this.reason);
              // 根据x的返回值类型来调用不同的处理函数
              resolvePromise(promise2, x, resolve, reject);
            });
          } catch (e) {
            reject(e);
          }
          break;
        default:
          // throw new Error("错误的状态", this.status);
          break;
      }
    });
    return promise2;
  }
  // catch是没有成功的then方法
  catch(onrejected = f => {throw f}) {
    return this.then(null, onrejected);
  }
  // 成功和失败都执行
  finally() {

  }

}


//产生一个成功的Promise
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => resolve(value))
}
//产生一个失败的Promise
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
}
// 
Promise.all = function (values) {
  return new Promise((resolve, reject) => {
    let results = [];//缓存执行结果
    let i = 0;// 通过计数器来判断是否执行完毕.
    let processData = (value, index) => {
      results[index] = value;
      // Promise全部执行完毕后,返回全部的执行结果
      if (++i === values.length) resolve(results)
    }
    for (let i = 0; i < values.length; i++) {
      const current = values[i];
      if (isPromise(current)) {// 如果是promsie,则获取其then的返回值
        current.then(y => {processData(y, i)}, reject);
      } else {
        processData(current, i);//常量则直接添加到results中
      }


    }
  })
}
Promise.race = function (values) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < values.length; i++) {
      const current = values[i];
      if (isPromise(current))
        current.then.call(current, resolve, reject);
      else
        resolve(current);
    }
  })
}
// 暴露一个快捷方法,用于快速创建Promise实例和方便Promise测试,可以减少使用时的嵌套层数.延迟对象,类似于angular中的Q
Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;