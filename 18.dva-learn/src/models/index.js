// const context = require.context("./", false, /\.js$/);
// export default context
//   .keys()
//   .fillter(item => item !== './index.js')
//   .map(key => context(key))

var context=require.context('./', true, /\.js$/)
console.log('============ context begin ====================');
console.log(context);
console.log('============ context end ======================');
export default context.keys().fillter(i=>i!='./index.js').map(i=>context(i))

// function importAll(r) {
//   r.keys().forEach(r);
// }
// importAll(require.context('./models/', true, /\.js$/));
