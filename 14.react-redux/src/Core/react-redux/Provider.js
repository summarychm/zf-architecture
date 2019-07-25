import React from "react";
import ReactReduxContext from './context';

export default class extends React.Component {
  static contextType=ReactReduxContext;
  render(){
    // 将store传递给contextAPI,并渲染children
    <ReactReduxContext.Provider value={this.props.store}>
  {this.props.children}
    </ReactReduxContext.Provider>
    
  }
}
