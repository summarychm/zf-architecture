import isPlainObject from "./utils/isPlainObject";
/**
 * 创建一个存放状态对象的Redux仓库
 * @param {*} reducer  通过传入当前状态树和动作返回下一个状态树的一个函数
 * @param {*} preloadedState  初始状态
 */
export default function createStore(reducer, preloadedState, enhancer) {
	if (typeof reducer !== "function") throw new Error("Expected the reducer to be a function.");
	// 兼容preloadedState而enhancer传递的情况
	if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
		enhancer = preloadedState;
		preloadedState = undefined;
	}
	if (typeof enhancer !== "undefined") {
		return enhancer(createStore)(reducer, preloadedState);
	}

	let currentState = preloadedState; //当前的状态
	let currentListeners = []; //当前的监听数组

	//读取仓库中状态树中的状态
	function getState() {
		return currentState;
	}

	//增加一个状态变化监听函数。它将在每次动作被派发的时候调用
	function subscribe(listener) {
		let isSubscribed = true; //是否已取消监听(闭包)
		currentListeners.push(listener); //向新的数组中添加监听函数
		return function unsubscribe() {
			//返回一个取消监听函数
			if (!isSubscribed) return; //如果已经取消了，则直接返回
			isSubscribed = false;
			const index = currentListeners.indexOf(listener);
			currentListeners.splice(index, 1); //删除此函数
		};
	}

	//派发一个动作，它是唯一能触发状态更新的方法
	function dispatch(action) {
		// 动作必须是一个纯对象,如果不是纯对象，就报错
		if (!isPlainObject(action)) throw new Error(`动作必须是一个纯对象，如果想进行异步操作请使用中间件`);
		//如果动作类型是undefined也报一个错误，动作不能有一个未定义的type属性
		if (typeof action.type === "undefined") throw new Error(`动作不能一个值为undefined的type属性`);

		currentState = reducer(currentState, action); //根据action生成新的state.
		for (let i = 0; i < currentListeners.length; i++) {
			const listener = currentListeners[i]; // 依次调用回调监听
			listener();
		}
		return action; //返回派发的动作
	}
	//当一个仓库被创建的时候，会派发一个INIT动作，以便让reducer返回初始值，这个可以高效的填充初始状态树
	dispatch({ type: "REDUX.INIT" });
	return {
		dispatch,
		subscribe,
		getState,
	};
}
