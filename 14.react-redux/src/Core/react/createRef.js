export function createRef() {
	return { current: {} };
}
export function forwardRef(funcComponent) {
	return function(props) {
    // React中ref属性不让使用,这里使用自定义的myRef属性
		return funcComponent(props, props.myRef);
	};
}
