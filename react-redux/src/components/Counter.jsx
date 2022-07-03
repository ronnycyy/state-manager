// 手写 connect 的组件

import React from 'react';
// import { connect } from 'react-redux';   // 原版 hooks
import { connect } from '../react-redux';   // 自己实现一套 hooks 
import { decrement, increment } from '../store';

function Counter({ counter, increase, decrease }) {
  console.log("Counter", counter);
  return (
    <div>
      <span>{counter.value}</span>
      <button onClick={() => increase()}>increment</button>
      <button onClick={() => decrease()}>decrement</button>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return {
    increase: () => dispatch(increment()),
    decrease: () => dispatch(decrement()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
