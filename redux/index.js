/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose(...funcs) {
  console.log('compose', funcs);
  if (funcs.length === 0) {
    return (arg) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  // a 相当于之前所有组合好的函数, b 是本次要组合的函数, 
  // 比如: ((...args) => f(g(...args)), h) => (...args) => f(g(h(...args)))
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function a() {
  console.log('a');
}
function b() {
  console.log('b');
}
function c() {
  console.log('c');
}

const fn = compose(a, b, c);
fn();