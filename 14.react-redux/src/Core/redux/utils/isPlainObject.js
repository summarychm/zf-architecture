// 先判断 obj 本身是否满足我们熟悉的合法对象概念(必须是对象且不能是null)
// 判断 obj 的构造函数是不是 Object
export default function isPlainObject(obj) {
	if (typeof obj !== "object" || obj === null) return false;
	let proto = obj;
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto);
	}
	return Object.getPrototypeOf(obj) === proto;
}
// export default function isPlainObject(obj) {
// 	if (typeof obj !== "object" || obj === null) return false;
// 	return Object.getPrototypeOf(obj) === Object.prototype;
// }