export default function createStore(initState) {
  let state = initState;
  let listeners = [];
  function subscribe(listener) {
    // 订阅
    listeners.push(listener);
  }
  function getState() {
    return state;
  }
  function changeState(newState) {
    state = newState;
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
    changeState
  }
}
