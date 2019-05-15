function EventEmitter() {
  this._events = {};
}
// 注册指定事件的回调函数
EventEmitter.prototype.on = function (type, cb) {
  if (!this._events) this._events = {}; // 修正子类实例没有_events的问题.
  if (!this._events[type]) this._events[type] = [];
  if (type != 'newListener')
    this._events.newListener && this._events.newListener.forEach(cb => cb(type));
  this._events[type].push(cb);
}
// 触发指定事件
EventEmitter.prototype.emit = function (type, ...args) {
  if (!this._events[type]) return;
  this._events[type].forEach(cb => {
    cb && cb.call(this, ...args);
  });
}
// 关闭指定回调
EventEmitter.prototype.off = function (type, cb) {
  if (!this._events[type]) return;
  this._events[type] = this._events[type].filter(fn => fn != cb && fn.once != cb);
}
// 只执行一次的监听事件
EventEmitter.prototype.once = function (type, cb) {
  if (!this._events[type]) this._events[type] = [];
  let tempFn=(...args) =>{
    cb && cb(...args);// 先调用cb,在删除引用
    this.off(tempFn);
  }
  tempFn.once = cb;
  this.on(type, tempFn);
}

module.exports = EventEmitter;