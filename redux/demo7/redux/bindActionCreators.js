/**
 * @param {Function} actionCreator 用户定义的 action 函数，比如 setName (Action)。
 * @param {Function} dispatch store.dispatch
 */
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  }
}

export default function bindActionCreators(actionCreators, dispatch) {
  const b = {};
  // for..in  遍历所有可枚举属性，它会把原型上的属性也找出来
  for (const key in actionCreators) {
    const action = actionCreators[key];
    if (typeof action === 'function') {
      b[key] = bindActionCreator(action, dispatch);
    }
  }
  return b;
}