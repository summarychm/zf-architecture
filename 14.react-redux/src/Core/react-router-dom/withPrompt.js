import React from 'react';
import RouterContext from './context';

export default function (Component) {
  return class extends React.Component {
    static contextType = RouterContext;
    settle = (when, message) => {
      let history = this.context.history;
      if (when) history.block(message);
      else history.block(null);
    }
    render() {
      return <Component {...this.props} settle={this.settle} />
    }
    componentWillUnmount() {
      this.context.history.block(null);
    }
  }
}