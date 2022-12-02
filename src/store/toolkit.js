import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0,
    },
    reducers: {
        increase: state => {
            // Redux Toolkit 允许在 reducers 中编写 "mutating" 逻辑。
            // 它实际上并没有改变 state，因为使用的是 Immer 库，检测到“草稿 state”的变化并产生一个全新的
            // 基于这些更改的不可变的 state。
            state.value += 1;
        },
        decrease: state => {
            state.value -= 1;
        }
    }
});

export const { increase, decrease } = counterSlice.actions;

const store = configureStore({
    reducer: counterSlice.reducer,
});

store.subscribe(() => console.log(store.getState()));

// 将我们所创建的 action 对象传递给 `dispatch`
store.dispatch(increase());
store.dispatch(decrease());