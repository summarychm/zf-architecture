import React from "react";
import * as types from "./constants"
import {HashRouter} from "../react-router-dom";
import {Router} from "react-router";
//从react-redux中获取ContextType.
import {ReactReduxContext} from "../react-redux";

// 订阅路由变化,发生变化则向store派发LOCATION_CHANGE(非用户手动触发),修改state
export default class ConnectedRouter extends React.Component {
  static contextType = ReactReduxContext;
  componentDidMount() {
    // 监控historyChange,派发action
    this.unListen = this.props.history.listen((location, action) => {
      //从上下文中获取redux的store,同步路由信息.
      this.context.store.dispatch({
        type: types.LOCATION_CHANGE,
        payload: {location, action}
      })
    })
  }
  // <Router history={this.props.history}>{this.props.children}</Router>
  componentWillUnmount() {
    this.unListen()
  }
  render() {
    // 将组件内共用的history传递给react-router库的Router组件
    return (
      <Router history={this.props.history}>{this.props.children}</Router>
    )
  }

}