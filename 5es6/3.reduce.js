Array.prototype.reduce = function (cb, prev) {
  if (typeof prev == "undefined")
    prev = this.shift();
  for (let i = 0; i < this.length; i++) {
    prev=cb(prev, this[i], i, this);
  }
  return prev;
}
var ary=[1,2,3,4,5,6];
var c=ary.reduce(function(a,b){
  return a+b
},0);
console.log(c)