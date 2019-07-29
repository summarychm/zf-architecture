/**
 * 合并value和key集合
 * @param {array} valueAry value项
 * @param {array} keyAry key项
 */
export function combineObj(valueAry, keyAry) {
	return valueAry.reduce((memo, val, idx) => {
		memo[keyAry[idx]] = val;
		return memo;
	}, {});
}
