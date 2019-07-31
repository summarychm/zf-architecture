import React from "react";
import * as types from "./constants"
import {HashRouter } from "../react-router-dom";
import { Router } from "react-router";
import { ReactReduxContext } from "../react-redux";
// 订阅路由变化,发生变化则向store派发LOCATION_CHANGE(非用户手动触发),修改state
// 将组件内共用的history传递给react-router库的Router组件
export default class ConnectedRouter extends React.Component{
  static contextType=ReactReduxContext;
  componentDidMount(){
    this.unListen=this.props.history.listen((location,action)=>{
      this.context.store.dispatch({
        type:types.LOCATION_CHANGE,
        payload:{location,action}
      })
    })
  }
  // <Router history={this.props.history}>{this.props.children}</Router>
  componentWillUnmount(){
    this.unListen()
  }
  render(){
    return (
      <Router history={this.props.history}>{this.props.children}</Router>
    )
  }
  
}