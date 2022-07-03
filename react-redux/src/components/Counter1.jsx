// 手写 useSelector, useDispatch 的组件

import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';   // 原版 hooks
import { useSelector, useDispatch } from '../react-redux';   // 自己实现一套 hooks 
import { decrement, increment } from '../store';

function Counter() {
  const dispatch = useDispatch();  // 得到 store.dispatch
  const counter = useSelector(state => state.counter);   // 在整体store中，选择出 counter 这个 state。

  return (
    <div>
      <span>{counter.value}</span>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
    </div>
  )
}

export default Counter;
