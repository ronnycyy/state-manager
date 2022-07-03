export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);

  // 最后合并好的 reducer
  return function combine(state = {}, action) {

    // 所有的 action, 都是执行这个 combine 函数，改变整体的 state。(感觉状态管理不够细，有点捞)

    const nextState = {}
    // 遍历所有 reducer
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];  // counterReducer, infoReducer
      // 某个 reducer 的旧库
      const prevStateForKey = state[key];
      // 执行动作，状态改变，得到该 reducer 的新库
      const nextStateForKey = reducer(prevStateForKey, action);
      // reducer的key和state的key要保持一致
      // 该 reducer 的保存到一份新的总状态里
      nextState[key] = nextStateForKey;
    }
    return nextState;
  }
}