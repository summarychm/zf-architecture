var fs = require('fs');
var path = require('path');
var {after}=require('./2.after');

class EventEmitter {
  constructor() {
    this.results = {};
    this.callbacks = {};
  }
  on(type, fn) {
    EventEmitter.addToObj(this.callbacks, type, fn);
  }
  emit(type, data) {
    EventEmitter.addToObj(this.results, type, data);
    this.callbacks[type].forEach(cb => cb(this.results));
  }
  static addToObj(obj,type,data) {
    obj[type] ? obj[type].push(data) : obj[type] = [data];
  }
}
// 使用after函数控制回调执行的次数.
let emitAfter=after(2,function(data){
  event.emit("read", data);
});
let event=new EventEmitter();
event.on('read', function (...arg) {
  console.log("执行完毕啦",arg);
});
fs.readFile(path.resolve(__dirname, "../test.txt"), "utf8", function (err, data) {
  if (err) throw err;
  console.log("第一次读取");
  emitAfter(data);
});
fs.readFile(path.resolve(__dirname, "../test.txt"), "utf8", function (err, data) {
  if (err) throw err;
  console.log("第二次读取");
  emitAfter(data);
});
