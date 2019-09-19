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

read("./step11.txt").then(data=>{
  console.log("data",data);
},function(e){
  console.log(e)
});