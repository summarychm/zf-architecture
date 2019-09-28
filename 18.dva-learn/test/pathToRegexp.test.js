// let pathToRegExp = require('path-to-regexp');

// let url = '/a/1/2';
// let str = '/a/:name/:age';  // {name:1,age:2}

// // let r =  str.replace(/:([^\/]+)/g,()=>{return "([^\/]+)"});
// // console.log(new RegExp(r));

// let keys = [];
// let r = pathToRegExp(str,keys);
// // /^\/a\/([^\/]+?)\/([^\/]+?)(?:\/)?$/i
// let args = keys.map(key=>key.name);
// let [,...rs] = url.match(r);
// console.log(rs)


let pathToRegExp = require('path-to-regexp');
let url = 'https://www.bilibili.com/video/av55863089/?p=12';
let str = 'https://www.bilibili.com/video/:avNumber/?p=:num';
let keys = [];
let regObj = pathToRegExp(str, keys); // 自动生成的正则语句
let rs = url.match(regObj);
let args = keys.map((key, i) => {return {[key.name]: rs[++i]}});
console.log(args); // 序列化后的结果[{avNumber:'av55863089'}, {num:'12'}]