---
title: react-hooks
date: 2026-05-31 13:49:21
tags:
 - react
---

# React Hooks

React 的核心是组件。v16.8 版本之前，组件的标准写法是类（class）。

任何一个组件，可以用类来写，也可以用钩子来写。下面是类的写法。

 ```javascript
class Welcome extends React.Component {
  render() {
    return <h1Hello, {this.props.name}</h1;
  }
}
 ```

再来看钩子的写法，也就是函数。

 ```javascript
function Welcome(props) {
  return <h1Hello, {props.name}</h1;
}
 ```

官方[推荐](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)使用钩子（函数），而不是类。因为钩子更简洁，代码量少，用起来比较"轻"，而类比较"重"。而且，钩子是函数，更符合 React 函数式的本质。

<!-- more -->

## 类和函数的差异

类组件和函数组件是有差异的。不同的写法，代表了不同的编程方法论。

**类（class）是数据和逻辑的封装。** 也就是说，组件的状态和操作方法是封装在一起的。如果选择了类的写法，就应该把相关的数据和操作，都写在同一个 class 里面。

**函数一般来说，只应该做一件事，就是返回一个值。** 如果你有多个操作，每个操作应该写成一个单独的函数。而且，数据的状态应该与操作方法分离。根据这种理念，React 的函数组件只应该做一件事情：返回组件的 HTML 代码，而没有其他的功能。这种只进行单纯的数据计算（换算）的函数，在函数式编程里面称为 **"纯函数"**（pure function）。

但是，这种写法有重大限制，必须是纯函数，不能包含状态，也不支持生命周期方法，因此无法取代类。

**React Hooks 的设计目的，就是加强版函数组件，完全不使用"类"，就能写出一个全功能的组件。**

## Hook 的含义

Hook 这个单词的意思是"钩子"。

**React Hooks 的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来。** React Hooks 就是那些钩子。

你需要什么功能，就使用什么钩子。React 默认提供了一些常用钩子，你也可以封装自己的钩子。

所有的钩子都是为函数引入外部功能，所以 React 约定，钩子一律使用 `use` 前缀命名，便于识别。你要使用 xxx 功能，钩子就命名为 useXxx。

| Hook                  | 用途                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `useState`            | 在函数组件中添加局部状态                                     |
| `useEffect`           | 执行副作用（数据获取、订阅、DOM 操作等），可替代生命周期方法 |
| `useContext`          | 订阅 React Context，方便跨组件共享数据                       |
| `useReducer`          | 对复杂状态逻辑使用 reducer 模式，类似 Redux                  |
| `useCallback`         | 记忆化回调函数，避免不必要的重新创建与渲染                   |
| `useMemo`             | 记忆化计算结果，性能优化                                     |
| `useRef`              | 持有可变引用（DOM 节点、保存任意可变值）                     |
| `useImperativeHandle` | 自定义暴露给父组件的实例值（配合 `forwardRef`）              |
| `useLayoutEffect`     | 与 `useEffect` 类似，但在浏览器绘制之前同步执行              |
| `useDebugValue`       | 在 React DevTools 中显示自定义 Hook 的标签                   |

## Hook 使用规则

1. **只在最顶层调用 Hook**
   不要在循环、条件或嵌套函数中调用 Hook，确保每次渲染时 Hook 的调用顺序一致。
2. **只在 React 函数中调用 Hook**
   即在 React 函数组件或自定义 Hook 中调用，不要在普通 JavaScript 函数里使用。

（React 官方提供了 ESLint 插件 `eslint-plugin-react-hooks` 来自动检测这些规则。）

### 这是为什么

当你写一个函数组件并用 `useState` 时：

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  // ...
}
```

`useState` 怎么知道这次渲染应该返回哪个状态？组件本身是一个普通函数，每次渲染都会重新执行，如果不在某个地方把状态“记住”，状态就会丢失。

React 的做法是：**将 Hooks 的状态链表存储在组件对应的 Fiber 节点上**（Fiber 是 React 内部代表组件实例的数据结构）。
每次组件渲染时，React 会根据当前正在渲染的 Fiber 节点，依次取出对应位置的 Hook 状态。

因此，`useState` 必须在 React 的渲染流程中被调用，这样 React 才能知道当前属于哪个组件实例，并把状态正确地取出或存入该实例对应的链表里。

如果在普通 JavaScript 函数里调用 Hook，React 就无法将其关联到任何 Fiber 节点，因为没有正在渲染的组件上下文，程序会直接报错。



当你在函数组件中多次调用 `useState` 或 `useEffect` 时，React 并没有在后台为你创建类似于 `{ countState: 0, nameState: 'Tom' }` 这样的键值对对象。相反，React 会将这些 Hook 按照它们在代码中**书写的先后顺序**，组装成一个**单向链表（Linked List）**。

当组件第一次渲染时，React 每解析到一个 Hook，就会在链表尾部追加一个节点：

> Fiber.memorizedState   --> [ Hook 1 (useState: count) ] --> [ Hook 2 (useState: name) ] --> [ Hook 3 (useEffect) ]

当组件因为状态改变而触发重新渲染（Re-render）时，函数组件会重新从头到尾执行一遍。

此时，React 的内部指针会重新回到这个链表的**头部**。每当执行到一行 Hook 代码，React 不会去问“这个状态叫什么名字”，而是直接取当前指针指向的链表节点的值。 随后，指针自动向后移动一步，指向下一个节点。

所以如果我们将 Hook 放在条件判断（如 `if` 语句）或循环中，就会导致**某次渲染时，部分 Hook 被跳过**。这会直接破坏链表的索引顺序，引发灾难性的状态串位。

```js
function MyComponent() {
  const [count, setCount] = useState(0);      // Hook 1
  // 错误：在条件语句中调用 Hook
  if (count > 0) {
    useEffect(() => { ... }, []);            // Hook 2 (条件性触发)
  }
  const [name, setName] = useState('Alice');  // Hook 3
}
```

首次渲染（`count` 为 `0`）

由于 `count > 0` 为 `false`，`if` 分支内部的 Hook 2 被跳过。React 构建的链表结构如下：

- **第 1 次调用：** 对应链表第 1 个节点（存储 `count`）
- **第 2 次调用：** 对应链表第 2 个节点（存储 `name`）

`count` 变为了 `1`，组件触发更新

此时 `count > 0` 为 `true`，`if` 分支内部的代码被执行。React 按照执行顺序去读取链表：

- **第 1 次调用 (`useState(0)`)：** 读取链表第 1 个节点 ── 成功拿到 `count` 的最新值 `1`。
- **第 2 次调用 (`useEffect(...)`)：** 此时执行到了 `if` 内部的 Hook。React 盲目信任顺序，直接读取链表的**第 2 个节点**。然而，这个节点在上一次渲染时存储的是 **`name` ('Alice')** 的数据！
- **第 3 次调用 (`useState('Alice')`)：** React 试图去读取链表的第 3 个节点，但上一次渲染根本没有生成第 3 个节点，此时内部指针直接指向 `null`，程序发生运行时崩溃（Runtime Error）。

一旦前面的 Hook 被跳过，后续所有 Hook 的执行顺序与链表节点的对应关系就会全部错位。**React 会把属于 A 状态的数据错误地赋值给 B 状态。**

### 为什么 React 不用 Key 寻址

为什么 React 不像 `Map` 一样，让开发者传一个唯一的 Key（例如 `useState('count', 0)`）来映射状态，这样不就不受顺序限制了吗？

- 在大型项目或多人协作中，不同开发者在同一个组件或自定义 Hook 中可能会无意间使用相同的 Key，导致状态被覆盖。
- Hooks 的终极目标是复用逻辑。如果采用 Key 机制，当你在同一个组件里多次调用同一个自定义 Hook 时（例如两次调用 `useFetch('/url')`），为了防止 Key 冲突，你必须手动为它们注入不同的 Key。

# useState()

`useState` 是 React 函数组件的状态钩子。它的核心职责是：在组件的多次“重渲染”（Re-render）生命周期之间，持久化（Persist）组件的内部状态，并提供一个触发视图更新的唯一入口。

在纯 JavaScript 中，普通局部变量会随着函数的执行结束而销毁，并在下一次函数执行时重新初始化。而 `useState` 能够突破函数作用域的限制，将状态托管给 React 底层的 Fiber 节点，从而让函数组件拥有了“记忆”能力。

```jsx
const [state, setState] = useState(initialState);
```

- `state`（状态变量）： 这是一个只读（Read-Only）的快照数据。在当前渲染周期内，它是不可变的（Immutable）。
- `setState`（状态更新函数）： 更新状态的函数，调用时会触发组件重新渲染
- `initialState`（初始状态）： 仅在组件第一次挂载（Mount）时生效的默认值。可以是任何类型（数字、字符串、对象、数组，甚至是函数 —— 惰性初始化）

## 异步批量更新

**调用 `setState` 不会立即改变当前执行流中的 `state` 变量。** 它的本质是向 React 提交一个“更新请求”，并触发下一次渲染。

```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // 打印出来的仍然是 0，而不是 1
};
```

每次渲染，`count` 都是一个特定时间点的“快照”。在 `handleClick` 函数被触发的那个渲染周期里，`count` 的值就是 `0`。改变状态会触发全新的下一次渲染，在下一次渲染的函数体中，`count` 才会变成 `1`。

同时 为了性能优化，React 会将同一个事件处理函数内的多个 `setState` 操作合并为一次重渲染，避免频繁触发 DOM 更新。

## 函数式状态更新 

当新的状态**高度依赖于前一次的状态**，或者在异步闭包（如 `setTimeout`）中需要获取最新状态时，应当向 `setState` 传入一个**回调函数**，而不是具体的值：

```jsx
// 假设 count 当前为 0
setCount(prevCount => prevCount + 1); // 接收最新状态，返回新状态
setCount(prevCount => prevCount + 1);

// 最终视图上 count 会变成 2。如果写成 setCount(count + 1)，最终只会是 1。
```

## 惰性初始化

如果初始状态需要经过复杂的计算（例如读取 localStorage、进行大量运算），可以直接传一个**函数**给 `useState`：

```jsx
const [data, setData] = useState(() => {
  const saved = localStorage.getItem('key');
  return saved ? JSON.parse(saved) : defaultValue;
});
```

这个函数**只在组件首次渲染时执行一次**，之后的渲染都会忽略它。如果直接写 `useState(func())`，则该表达式会在每次渲染时都执行（即使结果被丢弃），造成性能浪费。



当一个 `useState` 在 Mount 时被初始化，React 会在对应的 Hook 链表节点上挂载一个 `queue`（更新队列）对象。

每当你调用 `setState(x)` 时，React 并不会马上计算出最终结果，而是把 `x` 作为一个 `Update` 动作**推入该 Hook 节点的更新队列中**。当 React 调度器（Scheduler）开始处理该组件的重渲染时，会遍历这个队列，依次应用这些更新动作，最终计算出最新的状态值并付诸渲染。

# useEffect()

`useEffect` 是 React 函数组件的副作用（Side Effects）控制器。它的核心职责是：允许开发者在组件渲染流之外，执行声明式的、与外部系统同步的异步或命令式操作，并提供了一套完善的资源释放机制。

**副作用（Side Effect）** 是指一个函数在计算其返回值的过程中，对外部世界产生的可观测的变化。在 React 中，纯粹的渲染函数应该是一个没有副作用的纯函数（Pure Function）。

诸如 **API 数据请求、手动修改 DOM 树、设置定时器、记录日志、订阅外部数据源** 等操作，都不属于组件渲染的核心逻辑。`useEffect` 的存在，正是为了将这些“副作用”从组件的渲染主线程中抽离出来，保证渲染流的纯净性与可预测性。

## 语法

```jsx
useEffect(() => {
  // 1. 执行副作用逻辑（Effect）
  
  return () => {
    // 2. 清理资源逻辑（Cleanup）
  };
}, [dependencies]); // 3. 依赖项数组（Dependency Array）
```

依赖数组决定了副作用什么时候重新执行，React 调度器在每次重渲染后，会采用 `Object.is`比对当前渲染周期与上一次渲染周期的依赖项数组：

- 省略依赖项（不传数组）： 副作用在 **每次组件渲染完成（包括挂载与更新）后** 都会执行。这通常会导致严重的性能问题或死循环。
- 空依赖项数组 `[]`：副作用仅在 **组件首次挂载完成（Mount）时** 执行一次。这意味着该副作用不依赖任何组件状态的变更。
- 非空依赖项数组 `[a, b]`： 在首次挂载时，以及后续任何一次渲染中，只要 `a` 或 `b` 的**引用或值发生改变**，副作用就会在渲染完成后重新触发。

当依赖项改变触发组件重渲染时，React 的内部执行顺序如下：

1. 组件完成重渲染并更新 DOM。
2. 执行上一次渲染所产生的副作用的清理函数。（擦除旧的副作用）
3. 执行当前渲染所产生的新的副作用函数。（建立新的副作用）

## 清理函数

`useEffect` 允许返回一个函数作为清理器。清理器的执行并不是在组件销毁时才发生，React 会在两个时间点调用它：

1. 组件卸载时
2. 下一次副作用执行前

这是保证不产生内存泄漏的关键，比如清除定时器、取消订阅。

```jsx
useEffect(
  function () {
    const timer = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
    return () => clearInterval(timer)
  },
  [setCount],
)
```

如果组件已卸载，但之前的异步操作或订阅仍然存在，会导致错误或内存泄漏。

## 使用

### 依赖数组

Effect 里用到的所有组件内变量（props、state、派生值）都应该放到依赖数组中。React 通过 `Object.is` 比较依赖是否变化。不完整的依赖会导致 effect 拿到的变量是过时的闭包值。

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    setCount(c => c + 1); 
  }, 2000);
  return () => clearTimeout(timer);
}, []); // 依赖缺了 setCount
```

虽然 `[]` 和 `[setCount]` 都只是初始化时执行一次，相当于等价，但是 `eslint` 会警告。

### 数据获取

```jsx
useEffect(() => {
  let cancelled = false;
  async function fetchData() {
    const result = await api.get(userId);
    if (!cancelled) {
      setData(result);
    }
  }
  fetchData();
  return () => { cancelled = true; }; // 防止组件卸载后设置状态
}, [userId]);
```

在异步网络请求中，较早发出的请求可能由于网络延迟，比稍后发出的请求更晚返回，导致卸载后执行 `setState` 覆盖想要的数据。

**`useEffect` 获取数据时，为什么要额外创建一个 async 函数，而不能直接接收一个 async 函数？**

JavaScript 的 `async` 函数会隐式返回一个 Promise 对象，而 `useEffect` 的底层设计要求返回值必须是一个“纯粹的清理函数”或 `undefined`。两者的类型签名在底层发生了不可调和的冲突。

 **为什么 `useEffect` 不支持接收 Promise？**

资源清理必须是同步且即时发生的。当依赖项改变触发重渲染时，React 必须立刻执行上一次的清理函数，以切断过期的副作用（如取消订阅、清除定时器）。 如果 `useEffect` 接收了 async 函数，清理函数就必须等到这个 Promise 被 resolve 之后才能被获取并执行。此时，外部系统可能已经进入了全新的状态，这种异步延迟的清理会导致内存泄漏。

### 事件绑定

```jsx
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

组件初始化时，绑定 `resize` 事件，卸载组件解绑。

# useRef()

`useRef` 是 React 函数组件的“引用持有”钩子。它的核心职责是：在组件的整个生命周期内，跨越多次重渲染，持久化地持有同一个可变对象的引用，且该对象的属性变更**不会触发组件的视图重渲染**。

## 语法

`useRef` 返回一个普通的 JavaScript 对象，该对象有一个 `current` 属性。`useRef` 返回的 `refContainer` 对象的内存地址，在组件的整个生命周期内是绝对不变的。无论组件因为状态改变重新渲染了多少次，React 始终返回最初 Mount 时创建的同一个对象。虽然外层的对象引用不可变，但其唯一的属性 `.current` 是完全可变的。你可以随时对其进行读写操作（如 `refContainer.current = newValue`）。

```jsx
const refContainer = useRef(initialValue);
```

- `initialValue`：`current` 属性的初始值，可以是任何类型。
- `refContainer` 在每次渲染时都是**同一个对象引用**。

`useRef` 同样会在组件的 Hook 链表上创建一个节点，保存 `{ current: initialValue }` 这个对象。因为每次渲染返回的都是同一个内存对象，所以修改 `ref.current` 不会导致节点本身发生变化，React 自然也不会去触发重渲染。

## 用法

### 访问 DOM 元素

最常见的场景就是获取某个 DOM 元素的直接引用，进行聚焦、滚动、测量等操作。

```jsx
function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  const focusInput = () => {
    // 直接访问 DOM 元素并调用 focus 方法
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦输入框</button>
    </>
  );
}
```

- 通过 `ref` 属性将 `inputRef` 绑定到 `<input>` 元素上。
- 渲染完成后，`inputRef.current` 就指向那个真实的 DOM 节点。

### 保存任何可变值

你可以把 `useRef` 当成一个在多次渲染之间共享的“储物柜”，存放那些希望保持最新、但又不想触发渲染的值，例如：

- 定时器 ID
- 之前的状态（prevProps/prevState）
- 一个不需要响应式更新的数据副本

```jsx
function Timer() {
  const intervalRef = useRef(null);
  const [count, setCount] = useState(0);

  const start = () => {
    // 把定时器 ID 存在 ref 里，清理时用
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}
```

这里 `intervalRef.current` 存储定时器 ID，更新 `count` 会重渲染，但 `intervalRef` 中的值保持不变。

## 与 useState() 的区别

|              | useState             | useRef                                 |
| :----------- | :------------------- | -------------------------------------- |
| 触发重新渲染 | 是                   | 否                                     |
| 值的更新     | 异步、不可变（替换） | 同步、可变（直接修改 `.current`）      |
| 作用         | 驱动 UI 变化的数据   | 不需要体现在 UI 上的持久数据、DOM 引用 |
| 每次渲染     | 返回当前状态快照     | 返回同一个对象引用                     |

 判断数据是否应放在 ref 还是 state 的核心标准是：该数据变化时是否需要重新渲染界面。

React 的官方文档明确指出：**不要在渲染期间读取或写入 ref.current**（除了初始化）。组件的渲染过程可能会**被中断然后重新执行**。如果渲染时修改了 ref，那么这种修改可能会被多次应用，产生不可预测的结果。 一般在 useEffect / useLayoutEffect 内部，或者在 **事件处理函数** 内部对 `.current` 进行读写。

# useReducer()

`useReducer` 是 `useState` 的一种替代方案，它借鉴了 **Redux** 的 reducer 模式，用于管理**包含多个子值、或者下一个状态依赖前一个状态**的复杂状态。

它的核心思想是：把状态更新的逻辑从组件的事件处理函数中，**集中收敛到一个外部的纯函数（reducer）**中。

## 基本语法

```jsx
const [state, dispatch] = useReducer(reducer, initialState, init?);
```

- `state`：当前状态。通常是一个复杂的 JavaScript 对象（例如包含表单数据、加载状态、错误信息的复合体）。与 `useState` 一样，这里的状态同样不可变
- `dispatch`：一个函数，它是组件触发状态变更的**唯一方式**。调用它并传入 action 对象，如 `dispatch({ type: 'increment' })`，React 会将当前 state 和该 action 交给 reducer，用返回值作为新状态，并触发重渲染。
- `reducer`：形如 `(state, action) => newState` 的纯函数，负责根据 action 计算出新状态。`action` 通常包含两个标准属性：`type`：字符串常量，表示行为的唯一类型（如 `'FETCH_START'`）。`payload`：附带的业务数据负载（如 API 返回的数据包）。
- `initialState`：初始状态值 。
- `init`（可选）：惰性初始化函数，签名 `(initialArg) => initialState`，用于从传入的参数中计算初始状态。

当遇到以下情况时，`useReducer` 会比 `useState` 更合适：

1. **状态之间有复杂的依赖关系**

   例如表单有多个字段互相影响，使用多个 `useState` 容易产生多个分散的 `setXxx` 调用，且不易追踪整体逻辑。

2. **下一个状态强依赖前一个状态**

   在 `useState` 中必须用函数式更新 `setState(prev => ...)`，但若更新逻辑很复杂（如根据前一个状态的多个属性计算新状态），函数式更新会变得冗长。`useReducer` 直接在 reducer 函数中拿到最新的 `state`，编写逻辑更自然。

3. **需要将 dispatch 传递给深层子组件，避免回调重新创建**

   React 保证 `dispatch` 函数在组件生命周期内引用稳定（和 `useState` 的 setState 一样），所以它不用写进 `useCallback` 的依赖中，可安全传给子组件。

## 计数器示例

```jsx
import React, { useReducer } from 'react';

// 定义初始状态
const initialState = { count: 0, error: null };

// 编写 Reducer 纯函数
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: Math.max(0, state.count - 1) };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      // 遇到未定义的 Action 时抛出错误或返回原状态
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// 组件内部集成
function CounterComponent() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>当前计数: {state.count}</p>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      
      {/* 组件不直接修改状态，只通过 dispatch 宣告行为 */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>增加</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>减少</button>
      <button onClick={() => dispatch({ type: 'SET_ERROR', payload: '触发一次模拟错误' })}>
        报错
      </button>
    </div>
  );
}
```

更新逻辑全部在 `reducer` 里，组件本身只是通过 `dispatch` 发“命令”（action）。

## 惰性初始化

如果初始状态需要从 props 或其他数据中计算得出，你可以传入第三个参数 `init`：

```jsx
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // ...
}
```

 `init()` 接收当前的初始状态值，并将返回值作为最新的状态值返回给 `state`，`init(initialCount)` 只会在首次渲染时执行。

## 与 useState() 区别 

|                      | useState                         | useReducer                           |
| :------------------- | :------------------------------- | :----------------------------------- |
| 适用场景             | 简单独立的状态值                 | 复杂关联的状态、多个操作类型         |
| 更新方式             | 直接设置新值或函数式更新         | 派发 action，由 reducer 决定如何变化 |
| 逻辑位置             | 分散在事件处理函数中             | 集中在 reducer 纯函数中              |
| 下一个状态依赖前一个 | 必须使用函数式更新 `prev => ...` | 在 reducer 中直接接收最新 state      |

- 如果状态更新有**多种操作类型**（如增、删、改、重置），`useReducer` 更清晰。
- 如果只是简单的 toggle 或文本输入，`useState` 完全足够。

> 注：
>
> 1. **reducer 必须是纯函数**
>
>    不能在里面执行副作用（如网络请求、修改 DOM），副作用应放在 useEffect 中。
>
> 2. **action 通常是一个对象** { type, payload? }
>
>    这是约定俗成的惯例，但非强制。也可以自行定义 action 的结构，只要 reducer 能识别。
>
> 3. **dispatch 是稳定的引用**
>
>    与 useState 的 setState 一样，dispatch 不会在重渲染时变化，所以可以安全地传给子组件而无需 useCallback。
>
> 4. **状态更新是批处理的**
>
>    同 useState，多次 dispatch 在事件处理函数中会被批处理，React 会等到事件处理结束再统一应用所有更新。
>
> 5. **遵循 Hook 链表顺序**
>
>    useReducer 同样在组件的 Hook 链表中占据一个节点，按顺序存储状态。调用 dispatch 时，React 会标记更新，重渲染时按顺序读出状态，而不会重新调用 reducer 来计算当前状态（reducer 只在 dispatch 时运行）。

# useContext()

`useContext` 是 React 用于订阅和感知 React Context 变更的状态钩子。当我们需要跨越多个组件层级传递数据时，如果仍然通过 `props` 一层层传递（即“props 钻孔”），代码会变得繁琐且难以维护。

它的核心职责是：打破 React 传统的“单向数据流”中必须逐层传递 Props 的物理限制，允许深层子组件以声明式的方式，直接跳跃层级，订阅并获取祖先组件下发的全局或共享上下文数据。能直接在任意深度的子组件中读取到来自上层的数据。



- Provider 值变化会触发所有消费者重新渲染

  当 `<Context.Provider>` 的 `value` 属性发生改变时，所有调用了 `useContext(Context)` 的深层子组件都会被强制触发重新渲染（不管是否真的用到了变化部分）。 

## 基本语法

### 1. 创建 Context

```js
import { createContext } from 'react';

export const ThemeContext = createContext('light'); // 参数为默认值
```

### 2. 在上层提供数据（Provider）

```jsx
import { ThemeContext } from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

在组件树的某一个上级节点，使用 `<ThemeContext.Provider>` 包裹子组件，并通过 `value` 属性将实时状态广播出去。

### 3. 在任何子组件中消费（useContext）

```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Toolbar() {
  // 直接拿到 App 中提供的 theme 和 setTheme
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        切换主题
      </button>
    </div>
  );
}
```

`Toolbar` 内部不需要从父组件接收任何 `props`，只需引入上下文对象，传入 `useContext` 钩子，就能拿到全局主题并更新它。

## 与 `useReducer` 配合实现全局状态管理

```jsx
const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'login': return { ...state, user: action.payload };
    case 'logout': return { ...state, user: null };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null });
  return (
    <AppContext.Provider value={state, dispatch}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义 Hook，封装 useContext 调用
export function useApp() {
  const context = useContext(AppContext);
  if (context === undifined) throw new Error('AppContext must used AppProvider');
  return context;
}

```

任何在 `<AppProvider></AppProvider>` 包裹的子组件都可以调用 `useApp()` 获取 `state` 和 `dispatch` 。
