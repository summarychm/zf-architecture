import React from "react";
import {connect} from 'react-redux';

import actions from '../store/actions/counter';
const Counter = ({number, add, addAsync, dec}) => {
  return (<>
    <p>{number}</p>
    <button onClick={add}>自加一</button>
    <button onClick={addAsync} >异步自加一</button>
    <button onClick={dec}>减一</button>
  </>)
}
// export default Counter;
export default connect(state => state.counter, actions)(Counter);