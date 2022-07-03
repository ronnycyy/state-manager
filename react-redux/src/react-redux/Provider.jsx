/**
 * Provider 到底是什么东西？
 *
 * Provider 就是一个组件。它接收一个 store 作为属性，同时会将 children 属性无差别渲染。
 */

import React, { useEffect, useState } from 'react';
import ReactReduxContext from './ReactReduxContext';

function Provider({ store, children }) {

  // 利用一个空的组件状态，完成 Provider 的强制渲染。
  const [, setForceUpdate] = useState({});

  useEffect(() => {

    // 为了配合 useDispatch，store 变化时，让 Provider 重新渲染。
    const unsubscribe = store.subscribe(() => {
      console.log('总状态', store.getState());
      setForceUpdate({});
    });

    // 组件销毁时，退订。
    return () => unsubscribe();

  }, [store]);

  return (
    // React Context Provider 的 value 把 store 接收进来。 
    // 事实上， react-redux 的 value 除了 store 还有两个属性: getServerState 和 subscription, 不过它们是和 SSR 相关的，此处忽略。
    // forceUpdate 之后，这里更新前的 { store: store } 和更新后的 { store: store } 是两个不同地址的对象，所以会重新渲染 Provider 子树。
    // TODO: 看下卡颂的 React 性能优化
    <ReactReduxContext.Provider value={{ store }}>
      {/* 无差别渲染子树 */}
      {children}
    </ReactReduxContext.Provider>
  )
}

export default Provider;
