import React from 'react';
import dva,{connect} from './dva';

let app=new dva();
app.model({
  namespace:"counter",
  state:{number:0},
  reducers:{
    add(state=0,{payload=1}){
      return {number:state.number+payload}
    }
  }
});
const Counter=connect(state=>state.counter)(props=>(<>
  <p>{props.number}</p>
  <button onClick={()=>props.dispatch({type:"counter/add",payload:6})}>+</button>
</>));
app.router(()=><Counter/>);
app.start("#root");
