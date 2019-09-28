import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import IndexPage from './routes/IndexPage';
import Products from "./routes/Products";
import Example from "./routes/Example.js";

//! 可以改进为动态路由
function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/products" exact component={Products} />
        <Route path="/example" exact component={Example} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
