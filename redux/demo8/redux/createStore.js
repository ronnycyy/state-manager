export default function createStore(reducer, initState, rewriteCreateStoreFunction) {
  if (rewriteCreateStoreFunction) {
    const newCreateStore = rewriteCreateStoreFunction(createStore);
    return newCreateStore(reducer, initState);
  }

  let state = initState;
  let listeners = [];
  function subscribe(listener) {
    // 订阅
    listeners.push(listener);
    // 取消订阅
    return function unsubscribe(listener) {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  function getState() {
    return state;
  }

  function dispatch(action) {
    console.log('洋葱模型🧅最内层: dispatch 触发🔥', action);
    // 通知用户定义的 reducer 得到新的状态
    state = reducer(state, action);
    // 发布 
    // 无论哪个小状态变化，都将全量通知
    for (let i = 0, len = listeners.length; i < len; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // 执行所有的 reducer，使得 `以reducer为key的每个store`，在总状态里初始化。
  // 使用 symbol 避免和用户的 action.type 重名
  dispatch({ type: Symbol('__init_store__') });
  /**
   * 实现一个 Symbol?
   * 
   * function MySymbol(name) {
   *    const obj = Object.create({
   *      toString: function() {
   *         return name;
   *      }
   *    })
   *    return obj;
   * }
   */


  function replaceReducer(nextReducer) {
    reducer = nextReducer;
    dispatch({ type: Symbol('__init_store__') });
  }

  return {
    subscribe,
    getState,
    dispatch,
    replaceReducer,
  }
}
