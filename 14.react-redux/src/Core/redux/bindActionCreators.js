// 批量为actionAcretors绑定dispatch
// obj 写法 let actions = { add:{type: types.ADD}}
// func写法 let add=function(){ return {type:types.ADD,payload}}
export default function bindActionCreators(actionCreators, dispatch) {
	if (typeof actionCreators === "function")// 兼容actionCreators的func写法
		return bindActionCreator(actionCreators, dispatch);
	let boundActionCreators = {};//存放绑定dispatch后的actionCreator对象
	for (const key in actionCreators) {
		const actionCreator = actionCreators[key];
		if (typeof actionCreator === "function")
			boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	}
	return boundActionCreators;
}
// 为单个actionCreator绑定dispatch
function bindActionCreator(actionCreator, dispatch) {
	return (...args) => dispatch(actionCreator(...args));// 接收payload参数
}
