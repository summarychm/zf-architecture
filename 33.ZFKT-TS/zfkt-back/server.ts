let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
let cors = require("cors"); //处理跨域资源共享
// 持久化session信息
let MongoStore = require("connect-mongo")(session);

let config = require("./config/settings");
let { User } = require("./utils/db");

let app = express();
app.use(
	cors({
		origin: ["http://localhost:8080", "http://localhost:8081"],
		credentials: true, //是否允许跨域 发cookie
		allowedHeaders: "Content-Type",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
	}),
);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: "zfkt",
		store: new MongoStore({ config.dbUrl }),
	}),
);

/*
返回体格式  {code:number}
*/

interface typeResult{
  code:number,
  data:any
}
const tools={
  sendJSON:function(res,code=200,data:any){
    let result:typeResult={
      code,
      data
    }
    res.json(result)
  }
}
// 路由开始
app.post("/api/register",async(req,res)=>{
  let user=req.body;
  let result=await User.create(user);
  tools.sendJSON()
  res.json({code:0,data:result})
})




