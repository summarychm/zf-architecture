import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { TypeRootState } from "../../store/reducers";
import HomeAction from "$actions/Home";
import HomeHeader from "./HomeHeader";
import "./index.less";

function Home(props: any) {
	return (
		<>
			<HomeHeader
				setCurrentCategory={props.setCurrentCategory} 
				currentCategory={props.currentCategory} 
				toggleShow={props.toggleShow} 
				setToggleShow={props.setToggleShow}
				/>
			Home
			<br />
			<Link to="/mine">跳转到mine</Link>
		</>
	);
}
const mapStateToProps = (state: TypeRootState) => state.home;

export default connect(
	mapStateToProps,
	HomeAction,
)(Home);
