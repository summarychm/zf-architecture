var debug = require("debug"),
	error = debug("app:error"),
	log = debug("app:log");
error("booting %o", "张三"); //模板
log("调试信息"); //默认样式
console.log("log信息")