const initState = {
  count: 0
}

export default function reducer(state, action) {
  if (!state) {
    state = initState;
  }
  switch (action.type) {
    case "ADD": {
      return {
        ...state,
        count: state.count + 1
      }
    }
    case "REDUCE": {
      return {
        ...state,
        count: state.count - 1
      }
    }
    default: {
      return state;
    }
  }
}