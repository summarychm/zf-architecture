// 观察者模式
class Boss {
  constructor(title, level) {
    this.title = title;
    this.level = level;
    this.observerObj = []; //观察者队列
  }
  attach(obj) { // 监听方法
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
  warning(msg) { // 被观察者通知时,调用的被观察者函数
    let { level, title } = msg;
    if (level >= 3)
      console.log("红色警报,A级戒备!");
    else
      console.log("黄色警报,大家注意言行!");
  }
}
var zhangZong = new Boss("CTO", 3);
var staffXiaoLiu = new Staff("小刘", 1, "男");
var staffXiaoWang = new Staff("小王", 0, "女");
zhangZong.attach(staffXiaoLiu);
zhangZong.attach(staffXiaoWang);
zhangZong.goBack();

// 函数式编程涉及的名词 attach observer 