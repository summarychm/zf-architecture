function sum(a, b) {
  return a + b;
}

function add$(str) {
  return '$' + str;
}

function len(str) {
  return (str+"").length
}

function compose(...fns) {
  if (fns.length<1) return new Error("请传入集合");
  // fns=fns.reverse();
  return function (...args) {
    var fn = fns.shift();
    return fns.reduce((pre, crt)=>{
      return crt(pre);
    }, fn(...args))
  }
}

var cc=compose(sum,len,add$)(1,2)
console.log(cc)
var compose = (...fns)=> (...args)=>{
  let fn = fns.pop();
  return fns.reduceRight((a,b)=>b(a),fn(...args));
}
var cc = compose(add$,len,sum)('a','b');
console.log(cc)