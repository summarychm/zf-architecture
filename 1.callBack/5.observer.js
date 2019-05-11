class Boss {
  constructor(title, level) {
    this.title = title;
    this.level = level;
    this.observerObj = []; //存放通知集合
  }
  attach(obj) { // 监听方法,用于注册监听
    this.observerObj.push(obj);
  }
  goBack() {
    console.log(`BOSS ${this.title} 回来了! 危险等级: ${this.level}`);
    this.observerObj.forEach((observer, index, ary) => {
      observer.warning(this); //调用监听回调方法
    })
  }
}
class Staff {
  constructor(name, level, sex) {
    this.name = name;
    this.level = level;
    this.sex = sex;
  }
  warning(msg) {
    let { level, title } = msg;
    if (level >= 3)
      console.log("红色警报,A级戒备!");
    else
      console.log("黄色警报,大家注意言行即可!");

  }
}
var zhangZong = new Boss("CTO", 3);
var staffXiaoLiu = new Staff("小刘", 1, "男");
var staffXiaoWang = new Staff("小王", 0, "女");
zhangZong.attach(staffXiaoLiu);
zhangZong.attach(staffXiaoWang);
zhangZong.goBack();

// 函数式编程涉及的名词 attach observer 