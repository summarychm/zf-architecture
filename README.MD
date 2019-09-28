
> 这个项目主要用于上课老师讲解的经典 code 的整理
> 并按照自己的想法延展.

```js
function typeStr(obj) {
	return Object.prototype.toString.call(obj);
}
var set = new Set([1, 2, 4]);
console.log(set.entries().next()); //迭代器
console.log(typeStr(set.entries())); //迭代器
console.log(typeStr(set.entries().next())); //迭代器

let entr = Object.entries(set);
console.log(entr);
console.log(typeStr(entr));

var obj = {
	k1: "v1",
	k2: "v2",
};
obj;

// 默认不可访问的prototype就是设置了enumerable

state.user = new Proxy(state.user, {
	set(target, key, value, proxy) {
		if (Object.is(key, "id")) TogetherJS.config("userId", value + "");
		if (Object.is(key, "controlId")) $("#cId").html("cId:" + value);
		return Reflect.set(target, key, value, proxy);
	},
});

var a = {
	k1: "v1",
};
var b = {
	k2: "v2",
};
var c = {};
Object.defineProperty(a, "a1", {
	value: "ceshi",
});
console.log(a);
// Object.assign(c,a,Array)
console.dir(c);
console.log(Object(true));

Object.getOwnPropertyDescriptor(Array.prototype, "push");
Object.getOwnPropertyDescriptors(Array.prototype);

var obj = {};
Object.setPrototypeOf(obj, Array.prototype);
obj.__proto__ == Array.prototype;
var obj = Object.create(Array.prototype);

// 向 Promise.prototype 增加 finally()
Promise.prototype.finally = function(onFinally) {
	return this.then(
		/* onFulfilled */
		(res) => Promise.resolve(onFinally()).then(() => res),
		/* onRejected */
		(err) =>
			Promise.resolve(onFinally()).then(() => {
				throw err;
			}),
	);
};

Promise.prototype.finally = function(onFinally) {};
```
