let context = {}
// context ==? ctx  他俩不是一个东西
function defineGetter(property,key){ // 如果去context上取值 转换成去ctx.request上取值
    // context.method  = ctx.request.method
    context.__defineGetter__(key,function(){
        return this[property][key];
    });
}
function defineSetter(property,key){
    context.__defineSetter__(key,function(val){
        this[property][key] = val
    });
}
defineGetter('request','method');
defineSetter('request','path');
defineGetter('response','body');
// ctx.method == ctx.request.method
// ctx.body = 123;  ctx.response.body = 123
defineSetter('response','body');

module.exports = context;