import React from 'react';
import ReactDOM from 'react-dom';
import {log, sum} from './moduleA';

let num1 = sum(5, 11);
console.log(num1);
log("调用 moduleA 的 log 方法!");

let root=document.createElement('div');
document.append(root);
let str=<p>测试信息</p>;
ReactDOM.render(str,root);