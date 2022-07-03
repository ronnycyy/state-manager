import { useContext } from "react";
import ReactReduxContext from "./ReactReduxContext";

// filter: 筛选函数，如 (state) => state.counter, 返回总store里的counter仓库
function useSelector(filter) {
  // store 从哪来？
  // 你可能会说  import store from '../store'; 但是这是你自己定的啊，你写的是第三方库，每个项目的store目录不一样啊!
  // 所以不能用上面的方式。
  // 那应该用什么？ Provider。这就是 Provider 存在的意义。
  const context = useContext(ReactReduxContext);
  // { store: xxx(redux全局store) }
  // console.log('上下文', context);
  // 当初传给 Provider 的时候是用  <Provider store={{ store }}></Provider>, 所以这里要这么取。
  const state = context.store.getState();
  // 得到总体store的state，传给筛选函数，这样组件就能筛出自己想要的reducer管辖的state了。
  return filter(state);
}


export default useSelector;