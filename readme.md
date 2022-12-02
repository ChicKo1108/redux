# Redux

## 安装

### Redux Toolkit

`Redux Toolkit`官方推荐的编写Redux逻辑的方法，简化了大多数 Redux 任务，防止了常见错误，并使编写 Redux 应用程序更加容易。

RTK 包含了有助于简化许多常见场景的工具，包括 配置 Store， 创建 reducer 并编写 immutable 更新逻辑， 甚至还包含 一次性创建整个 State 的 “Slice”。

```bash
yarn add @reduxjs/toolkit
```

### 创建一个react redux应用

```bash
npx create-react-app my-app --template redux
npx create-react-app my-app --template redux-typescript
yarn create vite my-app --template react
yarn create vite my-app --template react-ts
```

### redux 核心库

```bash
yarn add redux
```

## 基础示例

应用的整体全局状态应以对象数的方式存放于单个`store`。唯一改变状态树(`state tree`)的方法是创建`action`，一个描述了发生了什么的对象，并将其`dispatch`给store。要指定状态树如何响应action，可以编写`reducer`函数，这些函数根据旧的state和action来计算新的state。

```js
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
const actions = {
    increase: () => ({
        type: INCREASE,
    }),
    decrease: () => ({
        type: DECREASE,
    }),
}

// 创建一个包含应用程序 state 的 Redux store。
// 它的 API 有 { subscribe, dispatch, getState }.
const store = createStore(reducers);

// 可以使用 subscribe() 来更新UI以相应state的更改。
// 通常你会使用试图绑定库（如React Redux）而不是直接使用subscribe()。
store.subscribe(() =>
    console.log(store.getState())
);

store.dispatch(actions.decrease());
store.dispatch(actions.increase());
```

需要使用action这个普通对象来描述发生了什么，而不是直接改变state。然后编写一个reducer的特殊函数，来决定如何基于action来更新整个应用的状态树。

在典型的Redux程序中，只有一个store以及一个跟reducer函数。随着应用程序的增长，您可以将跟reducer拆分为较小的reducer，分别在状态树的不同部分上进行运行。

### 使用Redux Toolkit示例

```js
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
```

## 基础概念

### Action

`action`是一个具有`type`字段的普通JavaScript对象。你可以将action视为描述应用程序中发生了什么的事件。

type字段是一个字符串，给这个action一个描述性的名字，比如"todos/todoAdded"。通常把字符串定义为“域/事件名称”，第一个部分是这个action所属的特征或类别，第二部分是发生的具体事情。

action对象可以有其他字段，包含有关发生的事情的附加信息。按照惯例将信息放在名为`payload`的字段中。

一个典型的aciton对象如下：

```js
const todoAdded = {
    type: 'todos/todoAdded',
    payload: 'Buy milk',
};
```

### Action Creator

`action creator`是一个创建并返回action的对象的函数，作用是不必每次都手动编写action对象。

```js
const addTodo = (todo) => ({
    type: 'todos/todoAdded',
    payload: todo,
});
```

### Reducer

`reducer`是一个函数，接收当前的`state`和一个`action`对象，必要时决定如何更新状态，并返回新状态。reducer就是一个事件监听器，它根据接收到的action（事件）类型处理事件。

Reducer必须符合以下规则：

- 仅使用state和action参数计算新的状态值
- 禁止直接修改state，必须通过复制现有的state并对复制的进行更改（不可变更新 immutable updates）
- 禁止任何异步逻辑、依赖随机值或导致其他“副作用”的代码

Reducer函数内部逻辑通常遵循一下步骤：

- 检查reducer是否关心这个action
  - 如果是，则复制state，使用新值更新state副本，返回新state
- 如果不是，返回原来的state

```js
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
    if (action.type === 'counter/increment') {
        return {
            ...state,
            value: state.value + 1,
        };
    }
    return state;
}
```

### Store

当前Redux应用的state存在一个明外store的对象中。

store是通过传入一个reducer来创建的，并且拥有一个名为`getState`的方法。

```js
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: counterReducer });

console.log(store.getState());
```

### Dispatch

store有一个方法叫`dispatch`，更新state的唯一方法是调用`store.dispatch`并传入一个action对象。

```js
const increment = () => {
  return {
    type: 'counter/increment'
  }
}

store.dispatch(increment())

console.log(store.getState())
```

### Selector

`Selector`函数可以从store状态树中提取指定的片段。随着应用越来越大，会遇到应用程序的不同部分需要读取系统的数据，selector可以避免重复这样的读取逻辑。

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
```

## Redux数据流

redux是单项数据流

- 初始启动：
  - 使用最顶层的root reducer函数创建store
  - store调用一次root reducer，并将返回值保存为他的初始state
  - 视图首次渲染时，访问当前的state，决定要呈现的内容。同时监听store的更新，以便他们可以知道state是否已更改
- 更新环节：
  - 应用中发生了某些事情
  - dispatch一个action到store
  - store用之前的state和当前的action运行reducer函数，保存新的state
  - store通知所有订阅过的视图，通知他们store发生更新
  - 订阅过store的视图检查是否需要重新渲染数据

![Redux数据流示意图](https://cn.redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

## React-Redux

### 自定义hooks

#### useSelector

`useSelector` hooks让我们的组件从Redux的store状态树中提取它需要的任何数据

前面提到，我们可以编写“selector”函数，它以`state`作为参数并返回状态树的一部分。

组件不能直接与store进行对话。但是，useSelector负责为我们在幕后与Redux store对话。如果我们传入一个selector函数，它会为我们调用`someSelector(store.getState())`，并返回结果。

因此，我们可以通过执行以下操作获取store中的计算值：

```js
const count = useSelector(selectCount);
```

除此以外，我们不是只能使用已导出的selector。我们也可以编写内联参数：

```js
const countPlus2 = useSelecotr(state => state.count.value + 2);
```

每当一个action被dispatch并且store更新时，`useSelector`将重新运行我们的selector函数。如果选择器返回值与上次不同，`useSelector`将确保组件会重新渲染。

#### UseDispatch

使用`useDispatch`来dispatch action。

```js
const dispatch = useDispatch();
```

使用时直接传入action即刻：

```js
<button onClick={() => dispatch(incement())}> + </button>
```

### state 与 redux store

并不是应用程序中的所有状态都要放入redux store中。**全局状态应放在redux store中，而只在一个地方用到的状态应该放到组件的state中**。

如果你不确定该放在哪里，这里有一些常用的经验法则，用于确定应该将哪种数据放入 Redux：

- 应用程序的其他部分是否关心这些数据？
- 你是否需要能够基于这些原始数据创建进一步的派生数据？
- 是否使用相同的数据来驱动多个组件？
- 能够将这种状态恢复到给定的时间点（即时间旅行调试）对你是否有价值？
- 是否要缓存数据（即，如果数据已经存在，则使用它的状态而不是重新请求它）？
- 你是否希望在热重载视图组件（交换时可能会丢失其内部状态）时保持此数据一致？

此外，大多数表单的state不应该保存在redux中。相反，在编辑表单的时候把数据存放到表单组件中，当用户提交表单的时候再dispatch action来更新store。

### Providing Store

在组件中，我们使用`useSelector`和`useDispatch`两个hooks与redux store进行通信。奇怪的是，我们并没有导入store，那么这些hooks怎么知道要与哪个store对话呢？

事实上，为了让hooks能正常工作，我们需要使用`<Provider>`组件在幕后传递Redux store，以便它们可以正常访问它。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
)
```

使用`<Provider>`包裹整个`<App>`，并传入store：`<Provider store={store}>`。这样就在任何地方调用`useSelector`和`useDispatch`的组件都可以访问Provider绑定的store了。