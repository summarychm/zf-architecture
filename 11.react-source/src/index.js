import React from './react';

let element = React.createElement('button', {
  id: 'sayBtn',
  onClick: () => {
    alert("1");
  }
}, 'say', React.createElement('b',null, 'Hello'))

React.render(element, window.root);