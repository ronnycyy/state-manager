/**
 * @param {Function} actionCreator 用户定义的 action 函数，比如 setName 函数。
 * @param {Function} dispatch store.dispatch
 */
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(null, arguments));
  }
}

export default function bindActionCreators(actionCreators, dispatch) {
  const b = {};
  // for..in  遍历所有可枚举属性，它会把原型上的属性也找出来，只不过 Object.prototype 上的属性是不可枚举的，所以没出来。
  for (const key in actionCreators) {
    const action = actionCreators[key];
    if (typeof action === 'function') {
      b[key] = bindActionCreator(action, dispatch);
    }
  }
  return b;
}