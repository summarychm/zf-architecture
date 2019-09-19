const constant = {"pending": "pending", "fulfilled": "fulfilled", "rejected": "rejected"}

function isPromise(obj) {
  let flag = false;
  if ((typeof obj === "object" && obj !== null) || typeof obj === "function") {
    if (typeof obj.then === 'function')
      flag = true;
  }
  return flag;
}

// 获取onfulfilled/onReject的执行结果x,
// 判断x的类型,如果是非Promise则直接调用promise2的resolve.
// 如果是x的Promise类型.则让x这个promise执行x.then,
function resolvePromise(promise2, x, resolve, reject) {
  // 排除循环引用的问题
  if (promise2 === x) return reject(newTypeError("循环引用!"));
  // 判断x是不是一个promise(只有对象/函数才有可能是Promise,兼容别人写的promise)
  try {
    if (isPromise(x)) {
      // 如果有then是一个方法,就认为x是一个promise

      // 调用x.then并将结果作为resolve的值返回
      x.then.call(x, y => {
        //! x.then的返回值y可能还是一个promise,所有这里递归调用resolvePromise,直到解析出一个常量为止.最终将常量返回.
        resolvePromise(promise2, y, resolve, reject);
      }, r => reject(r))

    } else  //不是promise那肯定就是常量了
      resolve(x); // 直接将常量x包装为resolve并返回.

  } catch (error) {
    reject(error);
  }
}


class Promise {
  constructor(exector) {
    this.value = null; // resolveValue
    this.status = constant.pending;
    this.reason = null; // rejectValue
    this.resolveCallBackFn = [];//当then时,status为padding则将成功回调存入.
    this.rejectCallBackFn = [];

    // 调用者code有了明确调用(resolve/reject).
    let resolve = value => {
      // 兼容用户直接传入new Promise的写法,递归解析,向下传递
      if (value instanceof Promise) return value.then(resolve, reject);
      //! 只有在status是padding时才可以更改status(状态机)
      if (Object.is(this.status, constant.pending)) {
        this.value = value;
        this.status = constant.fulfilled;
        this.resolveCallBackFn.forEach(fn => fn());
      }
    }
    let reject = value => {
      if (Object.is(this.status, "pending")) {
        this.reason = value;
        this.status = constant.rejected;
        this.rejectCallBackFn.forEach(fn => fn());
      }
    }
    try { // Promise初始化时出错,直接调用reject
      return exector(resolve, reject);
    } catch (e) {
      reject(e)
    }
  }
  // 处理promise实例的返回值(异步)
  then(onfulfilled = f => f, onrejected = f => {throw f}) {
    let promise2 = new Promise((resolve, reject) => {
      switch (this.status) {
        case constant.fulfilled:
          // 为了保证同步模式下promise.then中promise2存在,这里使用setTimeout来模拟microTask,错峰获取promise2实例.
          // 浏览器内部使用的是micro task而非setTimeout  
          setTimeout(() => {
            try {
              //获取当前then中onfulfilled返回值
              let x = onfulfilled(this.value);
              // 根据x的返回值类型来调用不同的处理函数
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
          break;
        case constant.rejected:
          setTimeout(() => {
            try {
              //获取当前then中onrejected返回值
              let x = onrejected(this.value);
              // 根据x的返回值类型来调用不同的处理函数
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
          break;
        case constant.pending:// pending状态,延迟执行,暂存resolve和reject回调,等待Promise有明确的返回值
          // 异步promise.then中就不需要使用setTimeout来获取promise2实例了,因为异步promise.then调用时,promise2已经创建了.
          // 只有同步的promise.then才需要使用setTimeout来错开当前执行栈,让promise2初始化.
          this.resolveCallBackFn.push(() => {
            try {
              let x = onfulfilled(this.value);//获取当前then中onfulfilled返回值
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          this.rejectCallBackFn.push(() => {
            try {
              //获取当前then中onrejected返回值
              let x = onrejected(this.reason);
              // 根据x的返回值类型来调用不同的处理函数
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
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

// 暴露一个快捷方法,用于快速创建Promise实例和方便Promise测试
// 可以减少使用时的嵌套层数.延迟对象,类似于angular中的Q
Promise.defer = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
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
Promise.race = function () {

}
module.exports = Promise;
