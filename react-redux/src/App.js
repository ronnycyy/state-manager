// import { Provider } from 'react-redux';   // 原版 react-redux
import { Provider } from './react-redux';   // 我们自己写的 react-redux
import Counter from './components/Counter';
import store from './store';   // 就是 redux 的 store
import './App.css';


function App() {
  return (
    <div className="App">
      {/* ReactRedux.Provider 展开一个上下文，把子树包裹进 redux 里 */}
      <Provider store={store}>
        <Counter />
      </Provider>
    </div>
  );
}

export default App;
