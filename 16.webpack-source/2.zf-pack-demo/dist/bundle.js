(function(modules) {
	var installedModules = {};
	function __webpack_require__(moduleId) {
		if (installedModules[moduleId])
			return installedModules[moduleId].exports;
		// Create a new module (and put it into the cache)
		var module = (installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {},
		});
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.l = true;
		// Return the exports of the module
		return module.exports;
	}
	// Load entry module and return exports
	return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})
({
  
		"./src/index.js":(function (module,exports,__webpack_require__){
      eval(`__webpack_require__("./src/index.less");

let a = __webpack_require__("./src/common/a.js");

let str = "str=" + a;
console.log(str);`)
    }),
  
		"./src/index.less":(function (module,exports,__webpack_require__){
      eval(`let style = document.createElement('style');
style.innerHTML = "body {\\n  background-color: #ce40c2;\\n}\\n";
document.head.appendChild(style);`)
    }),
  
		"./src/common/a.js":(function (module,exports,__webpack_require__){
      eval(`let b = __webpack_require__("./src/common/b.js");

module.exports = "a" + b;`)
    }),
  
		"./src/common/b.js":(function (module,exports,__webpack_require__){
      eval(`module.exports = "b";`)
    }),
  
})
