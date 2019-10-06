import React from 'react';
import {ReactReduxContext} from "./context";


export default class extends React.PureComponent {
	constructor(props) {
		super(props);
		const {store} = props;
		console.log('============ store begin ====================');
		console.log(store.getState());
		console.log('============ store end ======================');
		if (store == null)
			throw new Error(`<Provider>组件内必须包含store`);
		this.state = {
			state: store.getState(),
			dispatch: store.dispatch
		}
		store.subscribe(() => {
			console.log("arg", arguments)
			this.setState({state: store.getState()})
		})
	}
	render() {
		return (
			<ReactReduxContext.Provider value={this.state} >
				{React.Children.only(this.props.children)}
			</ReactReduxContext.Provider>
		)
	}
}