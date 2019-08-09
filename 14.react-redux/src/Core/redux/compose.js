// 组合中间件,用于增强store.dispatch
export default function compose(...fns) {
	if (fns.length === 0) return (arg) => arg; //空函数
	if (fns.length === 1) return fns[0]; // 原样返回
  // 洋葱模型包起来,模型的核心函数可以传递多个参数,
  return fns.reduce((a, b) => (...args) => a(b(...args)));
}

// 旧写法
// function compose(...fns) {
//   if (!fns.length) return (args) => args;
// 	return (...args) => {
//     let last=fns.pop();
//     let val = last(...args);
// 		return fns.reduceRight((pre, cur) => {
// 			return cur(pre);
// 		}, val);
// 	};
// }