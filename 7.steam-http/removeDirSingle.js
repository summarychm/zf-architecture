let fs = require("fs");
let path = require("path");

function rmDir(dirName, cb) {
  fs.stat(dirName, (err, stats) => {
    if (err) throw new Error(err);
    if (!stats.isDirectory()) fs.unlink(dirName, cb); //文件直接删除
    fs.readdir(dirName, (err, dirs) => {
      if (err) throw new Error(err);
      if (!dirs.length) return fs.rmdir(dirName, cb); // 删除空文件夹
      dirs = dirs.map(dir => {
        return path.join(dirName, dir);
      });
      (function next(index) { //递归删除子文件夹
        if (index == dirs.length)
          return fs.rmdir(dirName, cb); // 删除自身空文件夹
        rmDir(dirs[index], () => {
          next(++index);
        });
      })(0);
    });
  });
}
rmDir("tempDir", function () {
  console.log("全部删除成功!");
})