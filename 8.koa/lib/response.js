class response{
  get body(){
    return this.body;
  }
  set body(val){
    console.log("ccc")
    this.res.statusCode=200;// 调用了 body,就将状态码改为 200;
    this.body=val;
  }
}
module.exports=response;