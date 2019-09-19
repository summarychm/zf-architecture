var Promise = require('./Promise');
var fs = require("fs");
function read(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

read("./step1.txt").then(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Promise((resolve,reject)=>{
        setTimeout(() => {
          resolve(300)
        }, 0);
      }));
    }, 0);
  });
}, function (e) {
  console.log("err1", e)
}).then().then(data => {
  console.log("data3", data)
}, function (e) {
  console.log("err3", e)
});