let request= require("request");
let path=require("path");
var cc=path.resolve("a","b");
var dd=path.join("a","b");
console.log(path.dirname(__dirname));
console.log(cc);
console.log(dd);
return;

function syncRequest(url, cookie) {
  return new Promise(function (resolve, reject) {
    let obj = {
      method: 'GET',
      url,
    };
    request(obj, function (err, res, body) {
      if (!err && res.statusCode === 200) resolve(body);
      else reject(err);
    });
  }).catch(err => console.error(err));
}
async function testFn(){
  console.log("begin");
  await syncRequest("http://www.baidu.com").then(data=>{
    console.log("内容长度:",data.length);
  })
  await Promise.resolve(1).then(data=>{
    // i=1000000000;
    // while (i>=0) {
    //   i-=1;
    // }
    console.log(data)
  })
  console.log("end");
}
testFn()