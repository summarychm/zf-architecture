import React from 'react';
import RouterContext from './context';
// 对pushState进行包装(AOP)
(function (history) {
  var pushState = history.pushState;
  history.pushState = function (state, title, path) {
    pushState.call(history, state, title, path); // 调用原生的pushState方法
    window.onpushstate && window.onpushstate(state, path); //调用用户自定义的包装函数
  }
})(window.history)

export default class BrowserRouter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      location: {pathname: '/', state: null}
    }
    this.block = null;
  }
  componentWillMount() {
    window.onpopstate=window.onpushstate = (state, pathname) => {
      this.setState({
        location: {
          ...this.state.location,
          pathname,
          state
        }
      });
    }
  }
  componentDidMount(){
    window.history.pushState("", "", window.location.pathname);
  }
  render() {
    let that = this;
    let value = {
      location: that.state.location,
      history: {
        createHref(to) {

          let href = "";
          if (typeof to === "object") href += to.pathname;
          else if (typeof to === "string") href += to;
          else href += "/";
          return href;
        },
        push(to) {
          if (that.block) {
            if (window.confirm(that.block(that.state.location)))
              return;
          }
          if (typeof to === "object") {
            let {pathname, state} = to;
            window.history.pushState(state, pathname, pathname);
          } else
            window.history.pushState("", to, to);
        },
        block(message) {
          that.block = message;
        },
        unblock() {
          that.block = null;
        }
      }
    }
    return (
      <RouterContext.Provider value={value} >{this.props.children}</RouterContext.Provider>
    )
  }
}