const constant = {"pending": "pending", "fulfilled": "fulfilled", "rejected": "rejected"}
class Promise {
  constructor(exector) {
    this.value = null; // resolveValue
    this.status = constant.pending;
    this.reason = null; // rejectValue
    this.resolveCallBackFn = [];//当then时,status为padding则将成功回调存入.
    this.rejectCallBackFn = [];
    // 使用箭头函数避免this指向(指向promise实例)
    let resolve = value => {
      //! 只有在status还是padding时才可以更改status
      if (Object.is(this.status, constant.pending)) {
        this.value = value;
        this.status = constant.fulfilled;
        this.resolveCallBackFn.forEach(fn =>fn(this.value));
      }
    }
    let reject = value => {
      if (Object.is(this.status, "pending")) {
        this.reason = value;
        this.status = constant.rejected;
        this.rejectCallBackFn.forEach(fn => fn(this.reason));
      }
    }
    try {
      return exector(resolve, reject);
    } catch (e) {
      reject(e)
    }
  }

  then(onfulfilled, onrejected=e=>e) {
    switch (this.status) {
      case constant.fulfilled:
        onfulfilled(this.value);
        break;
      case constant.rejected:
        onrejected(this.reason);
        break;
      case constant.pending:
        this.resolveCallBackFn.push(onfulfilled);
        this.rejectCallBackFn.push(onrejected);
        break;
      default:
        // throw new Error("错误的状态", this.status);
        break;
    }
  }
}
module.exports = Promise;