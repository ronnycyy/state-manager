import React, { FC } from 'react';
import './App.css';
// import { atom, useRecoilState, useRecoilValue, selector } from 'recoil';   // 原版 recoil
import { atom, useRecoilState, useRecoilValue, selector } from './recoil';  // 我们写的 recoil

// textState 的类型，由 default -> Atom -> Stateful 推断出来。
// 返回: 输入文本 (原子状态) 
const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: 'default text', // default value (aka initial value)
});

// 得到 atom 的状态，衍生出新的状态
// 返回: 输入文本的长度
const charCountState = selector({
  key: 'charCountState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  },
});

// 用 FC 写得正规一点
const App: FC = () => {
  const [text, setText] = useRecoilState(textState);
  const count = useRecoilValue(charCountState);

  const onClick = () => {
    setText(Math.random().toString());
  }

  return (
    <div className="App">
      <h1>原子状态: {text}</h1>
      <h3>衍生状态: {count}</h3>
      <hr />
      <button onClick={onClick}>改变原子状态</button>
    </div>
  );
}

export default App;
