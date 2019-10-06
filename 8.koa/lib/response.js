let response = {
  _body:"",//第三方变量中转
  get body() {
    return this._body;
  },
  set body(val) {
    // 如果调用了ctx.body 会将状态码 变成200
    this.res.statusCode = 200;
    this._body = val;
  }
}
module.exports = response;