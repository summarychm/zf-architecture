'use strict'
// 元属性,通过new.target来判断当前函数是否是通过new创建的实例
function Person(name, sex) {
  console.log(new.target,name)
  if(!new.target)
    console.error("!!! 当前类必须通过new才能创建实例")
}
var test = {}
new Person("new");
Person.call(test,"call")
Person.apply(test,["apply"])
// let P = Person.bind(test);
// new P()

class Man extends Person{
  constructor(props){
    super(props)
    console.log(new.target)
  }
}
new Man('extends')


var c=r=>r;
 console.log((r=>r).name)
 console.log("....")