export default function createStore(reducer, initState) {
  let state = initState;
  let listeners = [];
  function subscribe(listener) {
    // 订阅
    listeners.push(listener);
  }
  function getState() {
    return state;
  }
  function dispatch(action) {
    // 通知用户定义的 reducer 得到新的状态
    state = reducer(state, action);
    // 发布 
    // 无论哪个小状态变化，都将全量通知
    for (let i = 0, len = listeners.length; i < len; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  return {
    subscribe,
    getState,
    dispatch
  }
}
