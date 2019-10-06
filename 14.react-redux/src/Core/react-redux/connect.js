import React from 'react';
import ReactReduxContext from "./context";
import {bindActionCreators} from "../redux";

export default (mapStateToProps, mapDispatchToProps) => {
  return WrappedComponent => {
    return class extends React.Component {
      render() {
        return (
          <ReactReduxContext.Consumer>
            {context => {
              const {dispatch, state} = context;
              let filterProps = {};
              // 处理 mapStateToProps
              if (isFunction(mapStateToProps))
                filterProps = {...filterProps, ...mapStateToProps(state, this.props)}
              // 处理 mapDispatchToProps
              if (isFunction(mapDispatchToProps)) {
                //优化,mapDispatchToProps 返回值始终不变
                this.dpMemory = this.dpMemory || mapDispatchToProps(dispatch, this.props);
                filterProps = {...filterProps, ...this.dpMemory}
              }
              else {// 兼容dispatch为对象形式
                filterProps = {
                  ...filterProps,
                  ...bindActionCreators(mapDispatchToProps, dispatch)
                }
              }
              const combindProps = {...this.props, ...filterProps};
              // 缓存preProps和PreComponent
              if (!this.preProps || !shallowEqual(this.preProps, combindProps)) {
                this.preProps = combindProps;
                this.preComponent = <WrappedComponent {...combindProps} />
              }
              return this.preComponent;
            }}
          </ReactReduxContext.Consumer>
        )
      }
    }
  }
}
function shallowEqual(prev, next) {
  const nextKeys = Object.keys(next);
  const prevKeys = Object.keys(prev);
  if (nextKeys.length !== prevKeys.length) return false;
  for (const key of nextKeys) {
    if (next[key] !== prev[key])
      return false;
  }
  return true;
}

function isFunction(obj) {
  return typeof obj === 'function'
}
