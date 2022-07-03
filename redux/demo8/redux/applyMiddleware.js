import compose from './compose.js';

// dispatch 的时候，依次执行所有的 middleware。
const applyMiddleware = function (...middlewares) {

  // 返回这个函数，给 createStore.js 里的 rewriteCreateStoreFunction 调用，再返回一个新的 createStore 函数
  return function (oldCreateStore) {

    // 这个玩意儿是新的 createStore 函数，把中间件嵌入到 dispatch 流程中。
    return function (reducer, initState) {
      const store = oldCreateStore(reducer, initState);
      const simpleStore = { getState: store.getState };

      // 中间件先依次执行一遍，转成 (next) => xxx, 结果放到链中，形成数组
      // 每一个 middleware 变成一个 m(simpleStore) 的执行结果 ----> 一个函数: (next) => (action) => {...}
      // [
      //  (next) => (action) => {...log...}, 
      //  (next) => (action) => {...exception...},
      //  ...
      // ]
      const chain = middlewares.map(m => m(simpleStore));
      // 现在中间件已经变成了 (next) => (action) => xxx 这个鬼样子, 然后 compose 从右到左把中间件组合起来，过程如下:

      // ex, time, log 三个转成 (next) => .. 的中间件
      // (...args) => ex(time(log(...args))) 传入 store.dispatch，然后执行，返回 ex(time(log(store.dispatch))) 的执行结果, 执行过程是:

      // 1. log 中间件 ”(next) => (action) => xxx“ 执行，返回一个函数，作为 next 给 time 中间件
      // ex(time(   (action) => {..log1..., store.dispatch, ..log2...}       ))

      // 2. time 中间件执行，返回一个函数，作为 next 给 exception 中间件
      // ex(   (action) => {..time..}   )

      // 3. 最后返回一个函数，给 dispatch
      // (action) => { 错误处理(next之前)...,  time中间件执行传过来的函数(action) => {...} (next),  xxx(next之后)  }

      // 所以，在 dispatch 的时候，中间件根据传入 applyMiddleware 的顺序，从左往右，按洋葱模型🧅执行。(左1左2左3左3左2左1)
      const dispatch = compose(...chain)(store.dispatch);

      console.log('dispatch', dispatch);

      return {
        ...store,
        dispatch
      }
    }
  }
}

export default applyMiddleware;
