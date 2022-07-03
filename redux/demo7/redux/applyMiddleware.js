import compose from './compose.js';

const applyMiddleware = function (...middlewares) {
  return function (oldCreateStore) {

    // return 的这个玩意儿其实是 createStore 函数
    return function (reducer, initState) {
      const store = oldCreateStore(reducer, initState);
      const simpleStore = { getState: store.getState };
      // 中间件依次执行，结果放到链中，形成数组
      const chain = middlewares.map(m => m(simpleStore));
      const dispatch = compose(...chain)(store.dispatch);

      return {
        ...store,
        dispatch
      }
    }
  }
}

export default applyMiddleware;