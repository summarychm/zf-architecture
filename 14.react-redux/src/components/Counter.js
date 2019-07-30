import React from 'react';
import Counter1 from "./Counter1";
import Counter2 from "./Counter2";

export default class Counter extends React.Component {
  render() {
    return (<div>
      <Counter1 />
      <Counter2 amount={5} />
    </div>)
  }
}

