| 文件         | 作用                                         |
| ------------ | -------------------------------------------- |
| Component.js | 自定义组件父类,及公共方法                    |
| element.js   | ReactElement 父类及 createElement 方法       |
| unit.js      | element 渲染单元,将 element 转为 html 字符串 |
|              |                                              |

代码解析过程
React.render(ReactElement,rootId)
-> createReactUnit(ReactElement) ->根据 element 类型创建不同的 unit 实例(3 种类型,用于渲染界面,将 ReactElement 转为 html)
-> 调用 unit 实例的 getHtmlString()将 element 转化为 html
-> 将 html 挂载到页面上.
-> 触发 mounted 事件,通知各 React 组件,HTML 挂载完毕.

ReactElement 格式
{type:(字符串/原生 DOM/自定义类),props:Object}

原生 DOM 元素 getHtmlString()
缓存 reactId
拼接字符串,对 className,style,onxxx,children 这些属性进行特殊处理,其他属性直接拼接为字符串.
classname:转为class,直接拼接
style:循环添加到style属性,如果有驼峰写法,将其转为"-"链接
onxxx:使用事件代理方式将其注册到根节点.
children: 递归调用createReactUnit拼接字符串,并将返回值拼接到父类的字符串中.

自定义类
实例化自定义类,将render()返回值作为渲染界面的html.
在render前后,update前后调用生命周期方法.为用户提供钩子.
其render()返回的ReactElement是文本/原生DOM节点.递归调用其getHtmlString方法即可.

domDiff

渲染 ReactElement 到页面中
DOMdiff 同层对比,元素属性变化直接更改 DOM,元素位置变化制作全局补丁包,全部计算完成应用补丁包.
setState 批处理更新,事件 begin 开启批处理,end 关闭批处理.
