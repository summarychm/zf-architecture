/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common/a.js":
/*!*************************!*\
  !*** ./src/common/a.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**测试banner**/let b = __webpack_require__(/*! ./b */ "./src/common/b.js");

module.exports = "a" + b;

/***/ }),

/***/ "./src/common/b.js":
/*!*************************!*\
  !*** ./src/common/b.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**测试banner**/module.exports="b";

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _public_img_jpg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./public/img.jpg */ "./src/public/img.jpg");
/* harmony import */ var _public_img_jpg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_public_img_jpg__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _public_logo_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./public/logo.svg */ "./src/public/logo.svg");
/* harmony import */ var _public_logo_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_public_logo_svg__WEBPACK_IMPORTED_MODULE_1__);
/**测试banner**/
__webpack_require__(/*! ./index.less */ "./src/index.less");
let a = __webpack_require__(/*! ./common/a.js */ "./src/common/a.js");

let str = "str=" + a;
console.log(str)

class Animal {
  constructor(type) {
    this.type = type;
  }
  getType() {
    console.log("type", this.type);
  }
}
const dog = new Animal("小狗")
dog.getType()





let imgImg = document.createElement('img');
imgImg.src = _public_img_jpg__WEBPACK_IMPORTED_MODULE_0___default.a;
document.body.appendChild(imgImg);
let logoImg = document.createElement('img');
logoImg.style="width:100px;height:100px;";
logoImg.src = _public_logo_svg__WEBPACK_IMPORTED_MODULE_1___default.a;
document.body.appendChild(logoImg);



/***/ }),

/***/ "./src/index.less":
/*!************************!*\
  !*** ./src/index.less ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {


    let style=document.createElement('style');
    style.innerHTML="body {\\n  background-color: #ce40c2;\\n}\\n";
    document.head.appendChild(style);
  

/***/ }),

/***/ "./src/public/img.jpg":
/*!****************************!*\
  !*** ./src/public/img.jpg ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports="image/img.jpg"

/***/ }),

/***/ "./src/public/logo.svg":
/*!*****************************!*\
  !*** ./src/public/logo.svg ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports="image/logo.svg"

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map