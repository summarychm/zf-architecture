import React from "react";
import {Redirect, Route} from "../Core/react-router-dom";
import * as local from "../utils/local";
/**
 1. 渲染一个Route组件,使用Route的render参数形式
 2. 在render中通过props和自身逻辑来判断是否显示.
 3. 验证通过就显示传入的组件,如果不通过则跳转到login页面
 */
// 使用render-props的方式实现可控渲染
export default function Authorized({component: Component, ...rest}) {
	// rest用于透传各种route参数如path等
	return (<Route {...rest} render={props => (
		local.getItem("logined",null)
			// 这里的props是Route组件自身的props而非外层函数组件的props
			? <Component {...props} />
			: <Redirect to={{pathname: "/login", state: {from: props.location.pathname}}} />
	)} />)
}
