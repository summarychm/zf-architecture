import React from "react";
import { Icon } from "antd";
import { Transition } from "react-transition-group";

import "./index.less";
import { EnumCategory } from "$types/common";

interface iProps {
	currentCategory: string;
	setCurrentCategory: Function;
  toggleShow: boolean;
  setToggleShow:Function
}

const duration = 300;
const defaultStyle = {
	opacity: 0,
	display: "none",
};

// 生成category
function genCategory(currentCategory: string) {
	let result = [];
	for (const item in EnumCategory) {
		result.push(
			<li data-type={item} key={item} className={currentCategory === item ? "active" : ""}>
				{item}
			</li>
		);
	}
	return result;
}
export default function HomeHeader(props: iProps) {
	let { currentCategory, setCurrentCategory,toggleShow,setToggleShow } = props;
	return (
		<div className="home-header">
			<div className="header-logo">
				{/* <img src="http://img.zhufengpeixun.cn/zfkelogo.png" /> */}
				<Icon type="bars" onClick={e=>setToggleShow(!toggleShow)} />
        {toggleShow}
			</div>
			<ul style={{}} onClick={(e:React.MouseEvent<HTMLUListElement>)=>{
        setCurrentCategory((e.target as HTMLUListElement).dataset.type)
        }}>
				{genCategory(currentCategory)}
			</ul>
		</div>
	);
}

// class HomeHeader extends React.Component<iProps, iState> {
// 	constructor(props: any) {
// 		super(props);
// 		this.state = {
// 			in: false,
// 		};
// 	}
// 	toggleShow = () => {
// 		this.setState({
// 			in: !this.state.in,
// 		});
// 	};
// 	render() {
// 		return (
// 			<div className="home-header">
// 				<div className="header-logo">
// 					<img src="http://img.zhufengpeixun.cn/zfkelogo.png" />
// 					<Icon type="bars" onClick={this.toggleShow} />
// 				</div>
//         <ul style={{}}>
//           <li data-type={EnumCategory.all} className={this.} >全部</li>
//         </ul>
// 			</div>
// 		);
// 	}
// }
// export default HomeHeader;

// interface iState {
// 	in: boolean;
// }
