import React from 'react';
import {bindActionCreators} from "../redux";
import ReactReduxContext from './context';
// 负责将组件和store进行关联(HOC)
// 接收mapStateToProps和mapDispatchToProps两个处理函数
export default function (mapStateToProps, mapDispatchToProps) {
  // 接收要包裹的组件
  return function (WrapperComponent) {
    // 返回包裹后的新组件
    return class extends React.Component {
      static contextType = ReactReduxContext;
      constructor(props, context) {
        super(props);
        // debugger
        // 将完整的store交由用户自行映射
        this.state = mapStateToProps(context.store.getState(),props);
        if (typeof mapDispatchToProps === 'function') { // 兼容dispatch为函数形式,支持传递props
          this.boundActions = mapDispatchToProps(context.store.dispatch,props);
        } else // 兼容dispatch为对象形式
          this.boundActions = bindActionCreators(mapDispatchToProps, context.store.dispatch)
      }
      componentDidMount() {
        const {
          store
        } = this.context;
        this.unsubscribe = store.subscribe(() => {
          this.setState(mapStateToProps(store.getState(),this.props))
        })
      }
      componentWillUnmount() {
        this.unsubscribe(); //取消订阅
      }
      render() {
        // 返回一个虚拟DOM
        // 需要提供输入输出这两个操作
        return <WrapperComponent {
          ...this.state
        } {
          ...this.boundActions
        }
        />
      }
    }
  }
};