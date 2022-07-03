// 日志中间件

const loggerMiddleware = (store) => (next) => (action) => {
  // console.log('[ prev state ]  ', store.getState());
  // console.log('[ action ] ', action);
  console.log('log next前');
  // next 是原本 redux 的 store.dispatch。
  // 相当于: 往 redux 的 dispatch 流程中插入了一段逻辑。
  next(action);
  // console.log('[ next state ]  ', store.getState());
  console.log('log next后');
}

export default loggerMiddleware;