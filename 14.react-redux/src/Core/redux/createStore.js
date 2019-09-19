import isPlainObject from "./utils/isPlainObject";
/**
 * 创建一个存放状态对象的Redux对象
 * @param {*} reducer  通过传入oldStore和action返回newStore的一个函数
 * @param {*} preloadedState  初始state
 * @param {*} enhancer  中间件集合
 */
export default function createStore(reducer, preloadedState, enhancer) {
	if (typeof reducer !== "function") throw new Error("Expected the reducer to be a function.");
	// 兼容未传递preloadedState而传递enhancer的情况
	if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
		enhancer = preloadedState;
		preloadedState = undefined;
	}
	if (typeof enhancer !== "undefined") // 调用中间件
		return enhancer(createStore)(reducer, preloadedState);

	let currentState = preloadedState; //当前的状态
	let currentListeners = []; //订阅监听数组

	//读取仓库中状态树中的状态
	function getState() {
		return currentState;
	}
	//增加一个状态变化监听函数。它将在每次动作被派发的时候调用
	function subscribe(listener) {
		let isSubscribed = true; //是否已取消监听(利用闭包防止多次取消监听)
		currentListeners.push(listener); // 添加监听函数
		return function unsubscribe() {
			if (!isSubscribed) return; //如果已经取消了，则直接返回
			isSubscribed = false;
			const index = currentListeners.indexOf(listener);
			currentListeners.splice(index, 1); //删除此函数,不使用filter,避免遍历整个数组.
		};
	}

	//派发一个动作，它是唯一能触发状态更新的方法
	function dispatch(action) {
		if (!isPlainObject(action)) throw new Error(`动作必须是一个纯对象，如果想进行异步操作请使用中间件`);
		if (typeof action.type === "undefined") throw new Error(`动作不能一个值为undefined的type属性`);
		currentState = reducer(currentState, action); //根据action生成新的state.
		currentListeners.forEach(listener => listener());// 依次调用回调监听
		return action; //返回派发的动作
	}
	dispatch({type: Symbol()});// store自身预先初始化 "REDUX.INIT"
	return {
		dispatch,
		subscribe,
		getState,
	};
}
