// 时间中间件

const timeMiddleware = (store) => (next) => (action) => {
  // console.log('[⏰]', new Date().toLocaleTimeString());
  console.log('time next前');
  next(action);
  console.log('time next后');
}

export default timeMiddleware;