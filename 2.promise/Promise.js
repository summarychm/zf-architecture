const constant = {"pending": "pending", "fulfilled": "fulfilled", "rejected": "rejected"}

// 获取onfulfilled/onReject的执行结果x,
// 判断x的类型,如果是非Promise则直接调用promise2的resolve.
// 如果是x的Promise类型.则让x这个promise执行x.then,
function resolvePromise(promise2, x, resolve, reject) {
  // 排除循环引用的问题
  if (promise2 === x) return reject(newTypeError("循环引用!"));
  // 判断x是不是一个promise(只有对象/函数才有可能是Promise,兼容别人写的promise)
  if (typeof x === "function" || (typeof x === "object" && x !== null)) {
    try {
      // 如果有then是一个方法,就认为x是一个promise
      if (typeof x.then === 'function') {
        // 调用x.then并将结果作为resolve的值返回
        x.then.call(x, y => {
          //! x.then的返回值y可能还是一个promise,所有这里递归调用resolvePromise,直到解析出一个常量为止.最终将常量返回.
          resolvePromise(promise2, y, resolve, reject);
        }, r => reject(r))
      } else
        resolve(x); // 其他情况做常量处理.
    } catch (error) {
      reject(error);
    }
  } else { //不是promise那肯定就是常量了
    resolve(x); // 直接将常量x包装为resolve并返回.
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
  then(onfulfilled, onrejected = e => e) {
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
}
module.exports = Promise;