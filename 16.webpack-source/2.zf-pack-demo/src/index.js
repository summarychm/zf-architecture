
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
const dog = new Animal("小狗")
dog.getType()


import img from './public/img.jpg';
import logo from './public/logo.svg';

// let imgImg = document.createElement('img');
// imgImg.src = img;
// document.body.appendChild(imgImg);
// let logoImg = document.createElement('img');
// logoImg.style="width:100px;height:100px;";
// logoImg.src = logo;
// document.body.appendChild(logoImg);

