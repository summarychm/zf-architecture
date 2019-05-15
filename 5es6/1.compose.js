function sum(a, b) {
  return a + b;
}

function add$(str) {
  return '$' + str;
}

function len(str) {
  return (str + "").length
}

function compose(...fns) {
  return function (...args) {
    var fn = fns.pop();
    return fns.reduceRight((a, b) => b(a), fn(...args));
  }
}

function compose(...fns) {
  return fns.reduce(function (a, b) {
    return function (...args) {
      return a(b(...args));
    }
  })
}
var cc = compose(sum, len, add$)(1, 2)
console.log(cc)
var compose = (...fns) => (...args) => {
  let fn = fns.pop();
  return fns.reduceRight((a, b) => b(a), fn(...args));
}
var cc = compose(add$, len, sum)('a', 'b');
console.log(cc)


