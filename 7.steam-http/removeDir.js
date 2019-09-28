let fs = require('fs');
let path = require('path');

function removeDir(dirname, callback) {
  fs.stat(dirname, (err, statObj) => {
    if (statObj.isDirectory()) {
      fs.readdir(dirname, (err, dirs) => {
        if (err) throw new Error(err);
        if (!dirs.length) {
          console.log(dirname, "-- 删除成功!");
          /* fs.rmdir(dirname, () => {
            console.log(dirname, "-- 删除成功!");
          }); */
        }
        dirs = dirs.map(d => {
          console.log(d);
          removeDir(path.join(dirname, d), function () {
            console.log(arguments);
          })
          return path.join(dirname, d);
        });
      })
    } else
      fs.unlink(dirname, callback); //文件直接删除
  })
}
removeDir(path.join(__dirname, 'tempDir'), () => {
  console.log('删除目录成功')
})