// 定义redux-devl-tools的componse
declare interface Window {
	__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
	store?:any // 方便store调试
}
