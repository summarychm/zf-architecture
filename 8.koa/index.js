let fs = require('fs');
let path = require("path");

// let Koa = require("./lib/application");
let Koa=require("koa")
let app = new Koa();

// let koaStatic = require('./lib/koa-static');
// app.use(koaStatic(path.join(__dirname,"./public"))); //使用中间件


// app.use(async (ctx, next) => {
//   try {
//     let msg="";
//     let ccc=await next();
//   } catch (err) {
//     console.log("出错了", err);
//     ctx.body = "page error: " + err.message;
//   }
// });
// app.use(async ctx=>{throw new Error("abcde");})

app.use(async (ctx, next) => {
  // throw new Error("我是错误信息! -- abc");
  console.log('============ ctx.res.URL begin ====================');
  console.log(ctx.req.URL);
  console.log('============ ctx.res.URL end ======================');
  console.log(ctx.req.method);
  console.log(ctx.request.req.method);
  // ----------
  console.log(ctx.request.method);
  ctx.response.body = 'hello'
  console.log(ctx.body);
});

// let logger =function(){
//   return new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//       console.log("logger");
//       resolve()
//     },100)
//   })
// };
// app.use(async (ctx,next)=>{
//   console.log(1);
//   await next();
//   console.log(2);
// })
// app.use(async (ctx,next)=>{
//   console.log(3);
//   await logger();
//   next();
//   console.log(4);
// })
// app.use(async (ctx,next)=>{
//   console.log(5);
//   next();
//   console.log(6);
// })



// app.use(async (ctx, next) => {
//   let url = path.resolve(__dirname, "../test.txt")
//   ctx.body = fs.createReadStream(url);
//   next();
// })

// app.use((ctx)=>{
//   ctx.body={a:1}
// });
// app.use((ctx)=>{
//   throw new Error("出错了!!!!")
//   ctx.body={a:1}
// });
app.on("error", (err, ctx) => {
  console.log(err)
  ctx.res.end("error 出错了"+JSON.stringify(err));
})
app.listen(3000, function () {
  console.log("server 启动成功");
});