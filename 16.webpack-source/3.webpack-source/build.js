const webpack = require("webpack");
// const {RawSource}=require("webpack-sources")
const config = require('./webpack.config.js');//1.读取配置文件
const compiler = webpack(config);
let log;
function compilerCallback(err, stats) {
    log=stats;

    // const statsString = stats.toString();
    // console.log('============  begin ====================');
    // console.log(stats);
    // console.log('============  end ======================');
}
// compiler.hooks.emit.tap("setStats",function(){
//     // compilation.assets['stats']=new RawSource(log);
//     console.log('============ this begin ====================');
//     console.log();
//     console.log('============ this end ======================');
// })
compiler.run((err,stats)=>{
    compilerCallback(err, stats);
});