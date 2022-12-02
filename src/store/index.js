import { configureStore, createStore } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    count: 0,
}

const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

/**
 * 这是一个 reducer 函数：接受当前 state 值和描述“发生了什么”的 action 对象，它返回一个新的 state 值。
 * reducer 函数签名是 : (state, action) => newState
 *
 * Redux state 应该只包含普通的 JS 对象、数组和原语。
 * 根状态值通常是一个对象。 重要的是，不应该改变 state 对象，而是在 state 发生变化时返回一个新对象。
 *
 * 你可以在 reducer 中使用任何条件逻辑。 在这个例子中，我们使用了 switch 语句，但这不是必需的。
 * 
 */
const reducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INCREASE:
            return {
                ...state,
                count: state.count + 1,
            }
        case DECREASE:
            return {
                ...state,
                count: state.count - 1,
            }
        default:
            return state;
    }
}

// action是描述要发生了什么的对象。
export const actions = {
    increase: () => ({
        type: INCREASE,
    }),
    decrease: () => ({
        type: DECREASE,
    }),
}

// 创建一个包含应用程序 state 的 Redux store。
// 它的 API 有 { subscribe, dispatch, getState }.
export const store = createStore(reducers);

// 可以使用 subscribe() 来更新UI以相应state的更改。
// 通常你会使用试图绑定库（如React Redux）而不是直接使用subscribe()。
store.subscribe(() =>
    console.log(store.getState())
);

store.dispatch(actions.decrease());
store.dispatch(actions.increase());