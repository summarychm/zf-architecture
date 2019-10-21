<template>
  <div id="container">
    <span style="color:red" >hello</span>
    world
  </div>
</template>
<script>
export default {
  el: '#app',
  mounted:function(){
    console.log(this)
    console.log('============ this.$vnode begin ====================');
    console.log(this.$vnode);
    console.log('============ this.$vnode end ======================');
  },
  // render: function (h) {
//   //  let vNode=h('div', { id: 'container' },
//   //           h('span', { style: { color: 'red' } }, 'hello'),
//   //           h('span', { style: { color: 'red' } }, 'hello')
//   //     );
    
//   let vNode=h('div',
//     Array.apply(null, { length: 20 }).map(function () {
//       return h('p', 'hi')
//     })
//   )
//   console.log(vNode);
//   return vNode;
// }
}
</script>