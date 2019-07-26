// 批量将actionAcretors对象使用dispatch进行包裹
// obj 写法 let actions = { add:{type: types.ADD}}
// func写法
export default function bindActionCreators(actionCreators, dispatch) {
	if (typeof actionCreators === "function")
		// 兼容直接传递action写法
		return bindActionCreator(actionCreators, dispatch);
	let boundActionCreators = {};
	for (const key in actionCreators) {
		const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") 
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	}
	return boundActionCreators;
}
// 将单个actionCreator使用dispatch包裹
function bindActionCreator(actionCreator, dispatch) {
	// 接收用户传递的args参数
	return (...args) => dispatch(actionCreator(...args));
}
