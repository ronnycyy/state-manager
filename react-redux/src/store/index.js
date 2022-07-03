/**
 * 构建`计数器`仓库 📦
*/

import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterInitState = {
  value: 0
}

// redux-toolkit 的配置，产生官方推荐写法的 reducer, action
export const counterSlice = createSlice({
  name: 'counter',
  initialState: counterInitState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// reducer
const counterReducer = counterSlice.reducer;
// 为该 reducer 配置好的 action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions;


// 产生官方推荐写法的 store
const store = configureStore({
  reducer: {
    counter: counterReducer,
    // 下面可以有多个 reducer，分别管理自己的 state。
  },
});

export default store;

// // 订阅
// store.subscribe(() => console.log(store.getState()));

// // 发起 action
// store.dispatch(increment());
// store.dispatch(decrement());
// store.dispatch(incrementByAmount(2));

