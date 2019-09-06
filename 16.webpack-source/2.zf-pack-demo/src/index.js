
require("./index.less");
let a = require("./common/a.js");

let str = "str=" + a;
console.log(str)

class Animal {
  constructor(type) {
    this.type = type;
  }
  getType() {
    console.log("type", this.type);
  }
}
const dog=new Animal("小狗")
dog.getType()