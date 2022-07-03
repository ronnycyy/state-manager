// 错误处理中间件

const exceptionMiddleware = (store) => (next) => (action) => {
  try {
    console.log('错误处理');
    next(action);
  } catch (e) {
    console.error('错误报告', e);
  }
}

export default exceptionMiddleware;