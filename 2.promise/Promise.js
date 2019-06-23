class Promsie {
  constructor(exector) {
    this.value = null;
    this.status = "pending";
    this.reason = null;
    this.resolveCallBackFn = [];
    this.rejectCallBackFn = [];
    let resolve = value => {
      if (Object.is(this.status, "pending")) {
        this.value = value;
        this.status="fulfilled";
        this.resolveCallBackFn.forEach(fn => fn());
      }
    }
    let reject = value => {
      if (Object.is(this.status, "pending")) {
        this.reason = value;
        this.status="rejected";
        this.rejectCallBackFn.forEach(fn => fn());
      }
    }
    return exector(resolve, reject);
  }
  then(onfulfilled,onrejected){
    switch (this.status) {
      case "fulfilled":
        onfulfilled(this.value);
        break;
    case "rejected":
      break;
      default:
        break;
    }
    if(Object.is(this.status,"fulfilled"))
      onfulfilled(this.value);
      if(Object.is())
  }
}