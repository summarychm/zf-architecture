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

const App = () => {
	return (
		<Provider store={store}>
			<Router history={history}>
				<>
					<main className="main-container">
						<Switch>
							<Route path="/" exact component={Home} />
							{/* <Route path="/mine" component={mine} />
        <Route path="/profile" component={Profile} /> */}
						</Switch>
					</main>
					{/* <FootTab /> */}
				</>
			</Router>
		</Provider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
