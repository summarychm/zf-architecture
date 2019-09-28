var Promise = require('./Promise');
var promise1 = new Promise(function (resolve, reject) {
  resolve(123)
});
setTimeout(() => {
  promise1.then(data => {console.log("data", data)},e=>{console.log("e",e);
  });
}, 100);


// var fs = require("fs");
// function read(url) {
//   let dfd = Promise.deferred();
//   fs.readFile(url, "utf8", (err, data) => {
//     if (err) dfd.reject(err);
//     dfd.resolve(data);
//   });
//   return dfd.promise;
// }

// read("./step1.txt").then(data => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve(300)
//         }, 0);
//       }));
//     }, 0);
//   });
// }, function (e) {
//   console.log("err1", e)
// }).then().then(data => {
//   console.log("data3", data)
// }, function (e) {
//   console.log("err3", e)
// });
