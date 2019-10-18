import React from "react";
import { Icon } from "antd";
import { Transition } from "react-transition-group";

import { EnumCategory } from "$types/common";
import "./index.less";
import logoImg from "$assets/image/zfkelogo.png";
// import logoImg from "../../../../public/image/zfkelogo.png";
 

interface iProps {
	currentCategory: string;
	setCurrentCategory: Function;
	toggleShow: boolean;
	setToggleShow: Function;
}

// header 动画相关
const duration = 300;
const defaultStyle = {
	opacity: 0,
	display: "none",
	transition: `all ${duration}ms ease-in-out`
};
const transitionStyle = {
	entering: { opacity: 1, display: "block" },
	entered: { opacity: 1, display: "block" },
	exiting: { opacity: 0, display: "none" },
	exited: { opacity: 0, display: "none" },
	unmounted: { opacity: 0, display: "none" },
};

// 生成category
function genCategory(currentCategory: string) {
	let result = [];
	for (const item in EnumCategory) {
		result.push(
			<li data-type={item} key={item} className={currentCategory === item ? "active" : ""}>
				{item}
			</li>,
		);
	}
	return result;
}
export default function HomeHeader(props: iProps) {
	let { currentCategory, setCurrentCategory, toggleShow, setToggleShow } = props;
	return (
		<div className="home-header">
			<div className="header-logo">
				<img src={logoImg} />
				<Icon type="bars" onClick={(e) => setToggleShow(!toggleShow)} />
				{toggleShow}
			</div>
			<Transition in={toggleShow} timeout={duration}>
				{(state) => (
					<ul style={{ ...defaultStyle, ...transitionStyle[state] }} 
					className="header-category"
					onClick={(e: React.MouseEvent) => setCurrentCategory((e.target as HTMLUListElement).dataset.type)}>
						{genCategory(currentCategory)}
					</ul>
				)}
			</Transition>
		</div>
	);
}