/**
 * 从local中读取数据
 * @param {string} key key值
 * @param {string} defaultVal 默认值,"[]"
 */
export function getItem(key, defaultVal = "[]") {
	return localStorage.getItem(key) || defaultVal;
}
export function setItem(key, val) {
	if (typeof val === "object") val = JSON.stringify(val);
	return localStorage.setItem(key, val);
}
