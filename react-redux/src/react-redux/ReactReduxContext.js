// redux 仓库作为 react 的 context 引入。
// 所以说，react-redux 还是基于 react 的 context API。
import { createContext } from 'react';

const ReactReduxContext = createContext({});


export default ReactReduxContext;
