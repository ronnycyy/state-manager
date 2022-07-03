import { useContext } from "react";
import ReactReduxContext from "./ReactReduxContext";

function useDispatch() {
  // const context = useContext(ReactReduxContext);
  // return context.store.dispatch;
  // 只是上面这么写，没有 Provider.jsx 配合的话，查看 Redux DevTools 状态已经变了，但是组件没有重新渲染，界面不刷新。
  // 那么，怎么样让组件重新渲染？
  // 我们知道，要让组件重新渲染，有两种方法:
  // 1. 让 props/state 发生变化
  // 2. 让祖先组件重新渲染
  // 由于组件 props/state 是用户定义的不好控制，所以我们应该让祖先组件重新渲染。
  // 哪个祖先组件？  Provider。
  const context = useContext(ReactReduxContext);
  return context.store.dispatch;
}

export default useDispatch;