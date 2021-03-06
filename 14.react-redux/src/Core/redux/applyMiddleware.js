import compose from "./compose";
export default function applyMiddleware(...middlewares) {
	return (createStore) => {
		return (...args) => {
			// 1.根据reducer和initState构建store
			const store = createStore(...args);
			// 2.用于存储最新的dispatch,保证每次调用的都是增强后的dispatch
			let dispatch = () => {throw new Error("不允许派发正在构建中的中间件!")};
			// 给中间件使用的getStore和增强后的dispatch
			const middlewaresAPI = {
				//最小开放策略,只给开发者提供getState和dispatch
				getStore: store.getState,
				dispatch: (...args) => dispatch(...args),// 调用最新增强的dispatch,用于应对级联派发action
			};
			// 3.依次初始化中间件,方便三层函数嵌套形式的中间件集合.
			let chain = middlewares.map((middleware) => middleware(middlewaresAPI));
			// 依次调用中间件来增强store.dispatch,前一个中间件返回的dispatch作为下一个中中间件的入参next
			dispatch = compose(...chain)(store.dispatch);
			// 4.将新dispatch和s增强后的tore融合并返回
			return {
				...store,
				dispatch //增强后的dispatch
			};
		};
	};
}