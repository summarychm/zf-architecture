const constant = {"pending": "pending", "fulfilled": "fulfilled", "rejected": "rejected"}
class Promise {
  constructor(exector) {
    this.value = null; // resolveValue
    this.status = constant.pending;
    this.reason = null; // rejectValue
    this.resolveCallBackFn = [];
    this.rejectCallBackFn = [];
    // 使用箭头函数避免this指向(指向promise实例)
    let resolve = value => {
      // 只有在status还是padding时才可以更改status
      if (Object.is(this.status, constant.pending)) {
        this.value = value;
        this.status = constant.fulfilled;
        //   this.resolveCallBackFn.forEach(fn => fn());
      }
    }
    let reject = value => {
      if (Object.is(this.status, "pending")) {
        this.reason = value;
        this.status = constant.rejected;
        //   this.rejectCallBackFn.forEach(fn => fn());
      }
    }
    try {
      return exector(resolve, reject);
    } catch (e) {
      reject(e)
    }
  }

  then(onfulfilled, onrejected) {
    if (Object.is(this.status, constant.fulfilled))
      onfulfilled(this.value);
    if (Object.is(this.status, constant.rejected))
      onrejected(this.reason);
  }
}
module.exports = Promise;