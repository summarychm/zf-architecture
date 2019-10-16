const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "123456"; //明文密码
let hashVal = ""; //加密后的字符串
// 加密
bcrypt.genSalt(saltRounds, function(err, salt) {
	bcrypt.hash(myPlaintextPassword, salt, (err, hash) => (hashVal = hash));
});
// 验证
bcrypt.compare(myPlaintextPassword, hashVal, (err, res) => {
	if (res) console.log("登陆成功!");
});

