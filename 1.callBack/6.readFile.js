var fs=require("fs");
var path=require('path');

// 多个异步调用完毕后才执行after回调
function after(total,fn){
  return function(...arg){
    if(--total<=0)
      return fn.call(this,arg);
  }
}
var afterReade=after(2,function(data){
  console.log("全部读取完毕!",data);
})
fs.readFile(path.resolve(__dirname,"../test.txt"),"utf8",function(err,data){
  console.log("第一次",data);
  afterReade(data);
});
fs.readFile(path.resolve(__dirname,"../test.txt"),"utf8",function(err,data){
  console.log("第二次",data);
  afterReade(data);
});
