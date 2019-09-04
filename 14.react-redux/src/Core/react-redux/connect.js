import React from 'react';
import {PureComponent} from "../react";
import {bindActionCreators} from "../redux";
import ReactReduxContext from './context';
// console.log("ReactReduxContext",ReactReduxContext)

// 负责将组件和store,action进行关联(HOC)
export default function (mapStateToProps, mapDispatchToProps) {
  return function (WrapperComponent) {// 要包裹的组件
    return class extends PureComponent { //返回全新的组件
      static contextType = ReactReduxContext;// 使用ReactReduxContext这个context
      constructor(props, context) {//利用React早期特性在constructor阶段获取context
        super(props);
        console.log("this.context", context, arguments)
        // 将完整的store交由用户自行映射,控制反转
        this.state = mapStateToProps(context.store.getState(), props);
        // 兼容dispatch为函数形式,支持传递props
        if (typeof mapDispatchToProps === 'function')
          this.boundActions = mapDispatchToProps(context.store.dispatch, props);
        else // 兼容dispatch为对象形式
          this.boundActions = bindActionCreators(mapDispatchToProps, context.store.dispatch)
      }
      componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => {
          this.setState(mapStateToProps(store.getState(), this.props))
        })
      }
      componentWillUnmount() {
        console.log("卸载")
        this.unsubscribe(); //取消订阅
      }
      render() {
        // 返回一个虚拟DOM, 需要提供输入输出这两个操作
        return <WrapperComponent {...this.state} {...this.boundActions} />
      }
    }
  }
};