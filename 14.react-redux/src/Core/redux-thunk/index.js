const reduxThunk = ({ dispatch, getState }) => (next) => (action) => {
	//如果是函数,调用用户自己的回调方法
	//将dispatch和state都传递给自定义回调中.
	if (typeof action == "function") return action(dispatch, getState);
	// 作为常规action处理
	else return next(action);
};
export default reduxThunk;
