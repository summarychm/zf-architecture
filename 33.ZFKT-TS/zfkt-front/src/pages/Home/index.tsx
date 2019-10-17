import React from "react";
import { Link } from "react-router-dom";
function Home(props: any) {
	return (
		<>
			Home<br/>
			<Link to="/mine"> 跳转到mine</Link>
		</>
	);
}

export default Home;
