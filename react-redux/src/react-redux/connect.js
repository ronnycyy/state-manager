import { useCallback } from 'react';
import ReactReduxContext from './ReactReduxContext';

function connect(mapStateToProps, mapDispatchToProps) {

  // 高阶组件: 接收用户的组件，返回合并了 state 和 dispatch 的组件
  return function (Component) {

    // 返回合并后的用户的组件，如 Counter.jsx
    return function (props) {

      // 把 state 和 dispatch 通过 props 给用户组件
      const renderChildren = useCallback((value) => {
        const state = value.store.getState();
        const dispatch = value.store.dispatch;
        /**
         * function mapStateToProps(state) {
              return {
                counter: state.counter
              }
           } 
        */
        const filterStates = mapStateToProps(state);
        /**
         * function mapDispatchToProps(dispatch) {
              return {
                increase: () => dispatch(increment()),
                decrease: () => dispatch(decrement()),
              }
            }
         */
        const filterDispatches = mapDispatchToProps(dispatch);

        return <Component {...props} {...filterStates} {...filterDispatches} />;
      }, [props]);


      return (
        // 给你 state 和 dispatch
        // 不用 useContext，换一种用法，用 Consumer。(Provider已经在祖先结点)
        <ReactReduxContext.Consumer>
          {
            // 这个 value 来自于 <Provider value={...}></Provider>
            // 用户的组件终于渲染
            (value) => renderChildren(value)
          }
        </ReactReduxContext.Consumer>
      )
    }

  }
}

export default connect;