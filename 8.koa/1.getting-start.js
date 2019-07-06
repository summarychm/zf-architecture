let fs = require('fs');
let path = require("path");

let Koa = require("./lib/application");
let app = new Koa();
app.use(async (ctx, next) => {
  ctx.body = "getting start!";
  await next();
});

app.use(async (ctx,next)=>{
  let url=path.resolve(__dirname,"../test.txt")
  ctx.body=fs.createReadStream(url);
  next();
})

// app.use((ctx)=>{
//   ctx.body={a:1}
// });
// app.use((ctx)=>{
//   throw new Error("出错了!!!!")
//   ctx.body={a:1}
// });
app.on("error", (err, ctx) => {
  console.log(err)
  // ctx.res.end("出错了"+JSON.stringify(err));
})
app.listen(3000, function () {
  console.log("server 启动成功");
});