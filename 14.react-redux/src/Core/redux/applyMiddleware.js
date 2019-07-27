import compose from "./compose";
export default function applyMiddleware(...middlewares) {
	return (createStore) => {
		return (...args) => {
			// 1.根据reducer和initState构建store,(...args) reducer,iniState
      const store = createStore(...args);
      // debugger;
			let dispatch; // 2.存储最新的dispatch,保证每次调用的都是增强后的dispatch
      // 构建给中间件使用的getStore和增强后的dispatch
      const middlewaresAPI = {
				getStore: store.getState,
				// 每次传入的都是最新增强的dispatch,传入dispatch为了可以级联派发action
				dispatch: (...args) => dispatch(...args),
			};
			// 3.组合中间件并包裹store.dispatch
			let chain = middlewares.map((middleware) => middleware(middlewaresAPI));
			dispatch = compose(...chain)(store.dispatch);
			// 4.将新dispatch和store融合并返回
			return { ...store, dispatch };
		};
	};
}
