import dva from 'dva';
import './index.css';

// 1. Initialize
// const app = dva();
const app = dva({
  initialState: {
    products: [
      {name: 'dva', id: 1},
      {name: 'antd', id: 2},
    ],
  },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
// app.model(require('./models/products').default);
require("./models").default.forEach(key => app.model(key.default));

// function importAll (r) {
//   r.keys().forEach(r);
// }
// importAll(require.context('./models/', true, /\.js$/));


// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
