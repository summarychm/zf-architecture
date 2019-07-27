import compose from "./compose";
export default function applyMiddleware(...middlewares) {
	return (createStore) => {
		return (...args) => {
			// 1.根据reducer和initState构建store,(...args) reducer,iniState
			const store = createStore(...args);
			// 2.用于存储最新的dispatch,保证每次调用的都是增强后的dispatch
			let dispatch = () => {
				throw new Error("不允许派发正在构建中的中间件!");
			};
			// 构建给中间件使用的getStore和增强后的dispatch
			const middlewaresAPI = {
				getStore: store.getState,
				// 调用最新增强的dispatch,用于应对级联派发action
				dispatch: (...args) => dispatch(...args),
			};
			// 3.组合中间件用于增强store.dispatch
			let chain = middlewares.map((middleware) => middleware(middlewaresAPI));
			dispatch = compose(...chain)(store.dispatch);
			// 4.将新dispatch和store融合并返回
			return { ...store, dispatch };
		};
	};
}
