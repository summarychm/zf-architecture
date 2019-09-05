#! /usr/bin/env node
// 1. 获取当前执行路径,读取weboack.config.js
let path = require("path");
let config = require(path.resolve("webpack.config.js"));

// 2.创建编译类实例
let Compiler = require("../lib/Compiler");
let compiler = new Compiler(config);
compiler.run();// 3.运行编译
