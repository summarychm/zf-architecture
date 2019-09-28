var util = require("util");
// var EventEmitter = require('events');
var EventEmitter = require('./1.events');

function Dog() {}
util.inherits(Dog, EventEmitter);
let dog = new Dog();
// dog.on("newListener", function (type) {
//   // console.log(type);
// });
dog.on('say', function (name) {
  console.log(name + "饿了!");
});

function goPlay(name){
  console.log(name + '要出去疯!');
}
dog.once('say', goPlay);
dog.on('say', function (name) {
  console.log(name + '要抱抱!');
});
// dog.off("say", goPlay);
dog.emit("say", "小太")
// dog.emit("say", "小太")