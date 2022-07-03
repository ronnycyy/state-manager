// 时间中间件

const timeMiddleware = (store) => (next) => (action) => {
  console.log('[⏰]', new Date().toLocaleTimeString());
  return next(action);
}

export default timeMiddleware;