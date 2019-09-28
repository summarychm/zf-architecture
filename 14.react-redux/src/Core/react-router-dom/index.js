// import BrowserRouter from "./BrowserRouter";
// import HashRouter from "./HashRouter";
// import Link from "./Link";
// import Prompt from "./Prompt";
// import Redirect from "./Redirect";
// import Route from "./Route";
// import Switch from "./Switch";
// import withPrompt from "./withPrompt";
// import withRouter from "./withRouter";
// export {HashRouter, BrowserRouter, Route, Link, Switch, Redirect, withRouter, withPrompt, Prompt};
console.log(require)
const context = require.context("./", false, /\.js$/);
var ceshi = context
  .keys()
  .filter((item) => item != "index.js")
  .map((key) => context(key));
console.log(ceshi);

// require("./modules").default.forEach(key => app.model(key.default))

