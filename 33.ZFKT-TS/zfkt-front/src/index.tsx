import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, Redirect } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { Provider } from "react-redux";
// import { ConfigProvider } from "antd";

import "../public/css/common.less";
import store from "./store";
import history from "./store/history";

import Home from "./pages/Home";
import Mine from "./pages/Mine";
import Profile from "./pages/Profile";

import FootTab from './component/FootTab';

window.store=store;
const App = () => {
	return (
		<Provider store={store}>
			<Router history={history}>
				<main className="main-container">
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/mine" exact component={Mine} />
						<Route path="/profile" exact component={Profile} />
					</Switch>
				</main>
				<FootTab />
			</Router>
		</Provider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
