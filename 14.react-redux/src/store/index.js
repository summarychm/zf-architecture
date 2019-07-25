import {createStore} from '../Core/redux';
import reducer from './reducers';
let store = createStore(reducer);
export default store;