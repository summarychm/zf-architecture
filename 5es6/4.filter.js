Array.prototype.filter=function(cb){
  var ary=[];
  this.forEach(function(v,i,a){
    cb(v,i,a)&&ary.push(a[i]);
  });
  return ary;
}
var ary=[1,2,3,4,5,6];
var d=ary.filter(function(v,i,a){
  return i<3
});
console.log(d);
