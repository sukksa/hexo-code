---
title: state
date: 2026-01-17 16:47:40
tags:
 - react
---

组件通常需要根据交互更改屏幕上显示的内容。输入表单应该更新输入字段，单击轮播图上的“下一个”应该更改显示的图片，单击“购买”应该将商品放入购物车。组件需要“记住”某些东西：当前输入值、当前图片、购物车。在 React 中，这种组件特有的记忆被称为 **state**。

<!-- more -->

## 为什么要使用 state

props 是来自组件外部的数据，是无法更改的，如果一个组件需要保存自己的数据该怎么办？并随着时间保持它？或者是让我们的应用程序具有交互性，由于某个操作而更改 UI ?

这就是 state 的作用， 基本上就是一个组件的数据可以随着时间的推移而保持，我们由 state 来获取数据。可以认为 state 作为组件的内存，随着组件的创建而创建，随着组件的卸载而销毁。

用户产生的每一条数据都是一个 state ，每当更新 state 时，react 都会重新渲染，生成新的组件视图，到用户界面上就是更改 UI 。

以下是一个渲染雕塑图片的组件。点击 “Next” 按钮应该显示下一个雕塑并将 `index` 更改为 `1`，再次点击又更改为 `2`，以此类推。但这个组件现在**不起作用**

```jsx
import { sculptureList } from './data.js'

export default function Gallery() {
  let index = 0

  function handleClick() {
    index = index + 1
  }

  let sculpture = sculptureList[index]
  return (
    <>
      <button onClick={handleClick}>Next</button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
    </>
  )
}
```

`handleClick()` 事件处理函数正在更新局部变量 `index`。但存在两个原因使得变化不可见：

1. **局部变量无法在多次渲染中持久保存。** 当 React 再次渲染这个组件时，它会从头开始渲染——不会考虑之前对局部变量的任何更改。
2. **更改局部变量不会触发渲染。** React 没有意识到它需要使用新数据再次渲染组件。

要使用新数据更新组件，需要做两件事：

1. **保留** 渲染之间的数据。
2. **触发** React 使用新数据渲染组件（重新渲染）。

[`useState`](https://zh-hans.react.dev/reference/react/useState) Hook 提供了这两个功能：

1. **State 变量** 用于保存渲染间的数据。
2. **State setter 函数** 更新变量并触发 React 再次渲染组件。

> Hooks ——以 `use` 开头的函数——只能在组件或[自定义 Hook](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks) 的最顶层调用。你不能在条件语句、循环语句或其他嵌套函数内调用 Hook。Hook 是函数，但将它们视为关于组件需求的无条件声明会很有帮助。在组件顶部 “use” React 特性，类似于在文件顶部“导入”模块。

## 添加一个 state 变量 

要添加 state 变量，先从文件顶部的 React 中导入 `useState`：

```js
import { useState } from 'react';
```

将`let index = 0`修改为

```js
const [index, setIndex] = useState(0);
```

`index` 是一个 state 变量，`setIndex` 是对应的 setter 函数。

> 这里的 `[` 和 `]` 语法称为[数组解构](https://zh.javascript.info/destructuring-assignment)，它允许你从数组中读取值。 `useState` 返回的数组总是正好有两项。

以下展示了它们在 `handleClick()` 中是如何共同起作用的：

```js
function handleClick() {
  setIndex(index + 1);
}
```

##  `useState` 

当你调用 [`useState`](https://zh-hans.react.dev/reference/react/useState) 时，你是在告诉 React 你想让这个组件记住一些东西：

```js
const [index, setIndex] = useState(0);
```

在这个例子里，你希望 React 记住 `index`。

`useState` 的唯一参数是 state 变量的**初始值**。在这个例子中，`index` 的初始值被`useState(0)`设置为 `0`。

每次你的组件渲染时，`useState` 都会给你一个包含两个值的数组：

1. **state 变量** (`index`) 会保存上次渲染的值。
2. **state setter 函数** (`setIndex`) 可以更新 state 变量并触发 React 重新渲染组件。

以下是实际发生的情况：

```js
const [index, setIndex] = useState(0);
```

1. **组件进行第一次渲染。** 因为你将 `0` 作为 `index` 的初始值传递给 `useState`，它将返回 `[0, setIndex]`。 React 记住 `0` 是最新的 state 值。
2. **你更新了 state**。当用户点击按钮时，它会调用 `setIndex(index + 1)`。 `index` 是 `0`，所以它是 `setIndex(1)`。这告诉 React 现在记住 `index` 是 `1` 并触发下一次渲染。
3. **组件进行第二次渲染**。React 仍然看到 `useState(0)`，但是因为 React *记住* 了你将 `index` 设置为了 `1`，它将返回 `[1, setIndex]`。
4. 以此类推！

**在同一组件的每次渲染中，Hooks 都依托于一个稳定的调用顺序**。这在实践中很有效，因为如果你遵循上面的规则（“只在顶层调用 Hooks”），Hooks 将始终以相同的顺序被调用。

在 React 内部，为每个组件保存了一个数组，其中每一项都是一个 state 对。它维护当前 state 对的索引值，在渲染之前将其设置为 “0”。每次调用 useState 时，React 都会为你提供一个 state 对并增加索引值。

一个简单的 useState 实现：

```js
let componentHooks = []
let currentHookIndex = 0

// useState 在 React 中是如何工作的（简化版）
function useState(initialState) {
  let pair = componentHooks[currentHookIndex]
  if (pair) {
    // 这不是第一次渲染
    // 所以 state pair 已经存在
    // 将其返回并为下一次 hook 的调用做准备
    currentHookIndex++
    return pair
  }

  // 这是我们第一次进行渲染
  // 所以新建一个 state pair 然后存储它
  pair = [initialState, setState]

  function setState(nextState) {
    // 当用户发起 state 的变更，
    // 把新的值放入 pair 中
    pair[0] = nextState
    updateDOM()
  }

  // 存储这个 pair 用于将来的渲染
  // 并且为下一次 hook 的调用做准备
  componentHooks[currentHookIndex] = pair
  currentHookIndex++
  return pair
}
```

## State 是隔离且私有的 

State 是屏幕上组件实例内部的状态。换句话说，**如果你渲染同一个组件两次，每个副本都会有完全隔离的 state**！改变其中一个不会影响另一个。

在这个例子中， `Gallery` 组件以同样的逻辑被渲染了两次。

```js
import Gallery from './Gallery.js'

export default function Page() {
  return (
    <div className='Page'>
      <Gallery />
      <Gallery />
    </div>
  )
}
```

这就是 state 与声明在模块顶部的普通变量不同的原因。 State 不依赖于特定的函数调用或在代码中的位置，它的作用域“只限于”屏幕上的某块特定区域。你渲染了两个 `<Gallery />` 组件，所以它们的 state 是分别存储的。

还要注意 `Page` 组件“不知道”关于 `Gallery` state 的任何信息，甚至不知道它是否有任何 state。与 props 不同，**state 完全私有于声明它的组件**。父组件无法更改它。这使你可以向任何组件添加或删除 state，而不会影响其他组件。

如果你希望两个画廊保持其 states 同步怎么办？在 React 中执行此操作的正确方法是从子组件中*删除* state 并将其添加到离它们最近的共享父组件中。

> - 当一个组件需要在多次渲染间“记住”某些信息时使用 state 变量。
> - State 变量是通过调用 `useState` Hook 来声明的。
> - Hook 是以 `use` 开头的特殊函数。它们能让你 “hook” 到像 state 这样的 React 特性中。
> - Hook 可能会让你想起 import：它们需要在非条件语句中调用。调用 Hook 时，包括 `useState`，仅在组件或另一个 Hook 的顶层被调用才有效。
> - `useState` Hook 返回一对值：当前 state 和更新它的函数。
> - 你可以拥有多个 state 变量。在内部，React 按顺序匹配它们。
> - State 是组件私有的。如果你在两个地方渲染它，则每个副本都有独属于自己的 state。

## state 如同一张快照

### 设置 state 会触发渲染 

你可能会认为你的用户界面会直接对点击之类的用户输入做出响应并发生变化。在 React 中，它的工作方式与这种思维模型略有不同。在上一页中，你看到了来自 React 的[设置 state 请求重新渲染](https://zh-hans.react.dev/learn/render-and-commit#step-1-trigger-a-render)。这意味着要使界面对输入做出反应，你需要设置其 state。

在这个例子中，当你按下 “send” 时，`setIsSent(true)` 会通知 React 重新渲染 UI：

```jsx
import { useState } from 'react'

export default function Form() {
  const [isSent, setIsSent] = useState(false)
  const [message, setMessage] = useState('Hi!')
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        setIsSent(true)
        sendMessage(message)
      }}>
      <textarea placeholder='Message' value={message} onChange={e => setMessage(e.target.value)} />
      <button type='submit'>Send</button>
    </form>
  )
}

function sendMessage(message) {
  // ...
}
```

当单击按钮时会发生以下情况：

1. 执行 `onSubmit` 事件处理函数。
2. `setIsSent(true)` 将 `isSent` 设置为 `true` 并排列一个新的渲染。
3. React 根据新的 `isSent` 值重新渲染组件。

[“正在渲染”](https://zh-hans.react.dev/learn/render-and-commit#step-2-react-renders-your-components) 就意味着 React 正在调用你的组件——一个函数。你从该函数返回的 JSX 就像是在某个时间点上 UI 的快照。它的 props、事件处理函数和内部变量都是 **根据当前渲染时的 state** 被计算出来的。

### 渲染会及时生成一张快照 

与照片或电影画面不同，你返回的 UI “快照”是可交互的。它其中包括类似事件处理函数的逻辑，这些逻辑用于指定如何对输入作出响应。React 随后会更新屏幕来匹配这张快照，并绑定事件处理函数。因此，按下按钮就会触发你 JSX 中的点击事件处理函数。

当 React 重新渲染一个组件时：

1. React 会再次调用你的函数
2. 函数会返回新的 JSX 快照
3. React 会更新界面以匹配返回的快照

state 不同于在你的函数返回之后就会消失的普通变量。state 实际上“活”在 React 本身中——就像被摆在一个架子上！——位于你的函数之外。当 React 调用你的组件时，它会为特定的那一次渲染提供一张 state 快照。你的组件会在其 JSX 中返回一张包含一整套新的 props 和事件处理函数的 UI 快照 ，其中所有的值都是 **根据那一次渲染中 state 的值** 被计算出来的！

在这个例子中，你可能会以为点击“+3”按钮会调用 `setNumber(number + 1)` 三次从而使计数器递增三次。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

每次点击只会让 `number` 递增一次！

**设置 state 只会为下一次渲染变更 state 的值**。在第一次渲染期间，`number` 为 `0`。这也就解释了为什么在 **那次渲染中的** `onClick` 处理函数中，即便在调用了 `setNumber(number + 1)` 之后，`number` 的值也仍然是 `0`：

```
<button onClick={() => {

  setNumber(number + 1);

  setNumber(number + 1);

  setNumber(number + 1);

}}>+3</button>
```

以下是这个按钮的点击事件处理函数通知 React 要做的事情：

1.  `setNumber(number + 1)`：`number` 是  `0` 所以 `setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。
2.  `setNumber(number + 1)`：`number` 是  `0` 所以 `setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。
3.  `setNumber(number + 1)`：`number` 是  `0` 所以 `setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。

尽管你调用了三次 `setNumber(number + 1)`，但在 **这次渲染的** 事件处理函数中 `number` 会一直是 `0`，所以你会三次将 state 设置成 `1`。这就是为什么在你的事件处理函数执行完以后，React 重新渲染的组件中的 `number` 等于 `1` 而不是 `3`。

你还可以通过在心里把 state 变量替换成它们在你代码中的值来想象这个过程。由于 **这次渲染** 中的 state 变量 `number` 是 `0`，其事件处理函数看起来会像这样：

```jsx
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

对于下一次渲染来说，`number` 是 `1`，因此 **那次渲染中的** 点击事件处理函数看起来会像这样：

```jsx
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

这就是为什么再次点击按钮会将计数器设置为 `2`，下次点击时会设为 `3`，依此类推。

### 异步事件中的 state 

在下边的例子中，给`alert` 添加一个定时器，使得它在组件重新渲染**之后**才触发，又会怎样呢？是会显示 “0” 还是 “5” ？

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

当你点击 `button` 时：

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

到提示框运行时，React 中存储的 state 可能已经发生了更改，但它是使用用户与之交互时状态的快照进行调度的！

**一个 state 变量的值永远不会在一次渲染的内部发生变化，** 即使其事件处理函数的代码是异步的。在 **那次渲染的** `onClick` 内部，`number` 的值即使在调用 `setNumber(number + 5)` 之后也还是 `0`。它的值在 React 通过调用你的组件“获取 UI 的快照”时就被“固定”了。

**React 会使 state 的值始终“固定”在一次渲染的各个事件处理函数内部**。你无需担心代码运行时 state 是否发生了变化。

## 把 state 更新加入队列

设置组件 state 会把一次重新渲染加入队列。但有时你可能会希望在下次渲染加入队列之前对 state 的值执行多次操作。

### React 会对 state 更新进行批处理 

```jsx
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

每一次渲染的 state 值都是固定的，因此无论你调用多少次 `setNumber(1)`，在第一次渲染的事件处理函数内部的 `number` 值总是 `0` ：

```jsx
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

但是这里还有另外一个影响因素需要讨论。**React 会等到事件处理函数中的** 所有 **代码都运行完毕再处理 state 更新。** 这就是重新渲染只会发生在所有这些 `setNumber()` 调用 **之后** 的原因。

这让你可以更新多个 state 变量——甚至来自多个组件的 state 变量——而不会触发太多的 [重新渲染](https://zh-hans.react.dev/learn/render-and-commit#re-renders-when-state-updates)。但这也意味着只有在你的事件处理函数及其中任何代码执行完成 **之后**，UI 才会更新。这种特性也就是 **批处理**

### 在下次渲染前多次更新同一个 state 

这是一个不常见的用例，但是如果你想在下次渲染之前多次更新同一个 state，你可以像 `setNumber(n => n + 1)` 这样传入一个根据队列中的前一个 state 计算下一个 state 的 **函数**，而不是像 `setNumber(number + 1)` 这样传入 **下一个 state 值**。这是一种告诉 React “用 state 值做某事”而不是仅仅替换它的方法。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}

```

在这里，`n => n + 1` 被称为 **更新函数**。当你将它传递给一个 state 设置函数时：

1. React 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理。
2. 在下一次渲染期间，React 会遍历队列并给你更新之后的最终 state。

下面是 React 在执行事件处理函数时处理这几行代码的过程：

1. `setNumber(n => n + 1)`：`n => n + 1` 是一个函数。React 将它加入队列。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个函数。React 将它加入队列。
3. `setNumber(n => n + 1)`：`n => n + 1` 是一个函数。React 将它加入队列。

当你在下次渲染期间调用 `useState` 时，React 会遍历队列。之前的 `number` state 的值是 `0`，所以这就是 React 作为参数 `n` 传递给第一个更新函数的值。然后 React 会获取你上一个更新函数的返回值，并将其作为 `n` 传递给下一个更新函数，以此类推：

| 更新队列     | `n`  | 返回值      |
| ------------ | ---- | ----------- |
| `n => n + 1` | `0`  | `0 + 1 = 1` |
| `n => n + 1` | `1`  | `1 + 1 = 2` |
| `n => n + 1` | `2`  | `2 + 1 = 3` |

React 会保存 `3` 为最终结果并从 `useState` 中返回。

### 如果你在替换 state 后更新 state 会发生什么 

这个事件处理函数会怎么样？你认为 `number` 在下一次渲染中的值是什么？

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

这是事件处理函数告诉 React 要做的事情：

1. `setNumber(number + 5)`：`number` 为 `0`，所以 `setNumber(0 + 5)`。React 将 *“替换为 `5`”* 添加到其队列中。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个更新函数。 React 将 **该函数** 添加到其队列中。

在下一次渲染期间，React 会遍历 state 队列：

| 更新队列     | `n`           | 返回值      |
| ------------ | ------------- | ----------- |
| “替换为 `5`” | `0`（未使用） | `5`         |
| `n => n + 1` | `5`           | `5 + 1 = 6` |

React 会保存 `6` 为最终结果并从 `useState` 中返回。

你可能已经注意到，`setState(x)` 实际上会像 `setState(n => x)` 一样运行，只是没有使用 `n`

### 如果你在更新 state 后替换 state 会发生什么 

 `number` 在下一次渲染中的值是什么？

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

以下是 React 在执行事件处理函数时处理这几行代码的过程：

1. `setNumber(number + 5)`：`number` 为 `0`，所以 `setNumber(0 + 5)`。React 将 *“替换为 `5`”* 添加到其队列中。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个更新函数。React 将该函数添加到其队列中。
3. `setNumber(42)`：React 将 *“替换为 `42`”* 添加到其队列中。

在下一次渲染期间，React 会遍历 state 队列：

| 更新队列      | `n`           | 返回值      |
| ------------- | ------------- | ----------- |
| “替换为 `5`”  | `0`（未使用） | `5`         |
| `n => n + 1`  | `5`           | `5 + 1 = 6` |
| “替换为 `42`” | `6`（未使用） | `42`        |

然后 React 会保存 `42` 为最终结果并从 `useState` 中返回。

总而言之，以下是你可以考虑传递给 `setNumber` state 设置函数的内容：

- **一个更新函数**（例如：`n => n + 1`）会被添加到队列中。
- **任何其他的值**（例如：数字 `5`）会导致“替换为 `5`”被添加到队列中，已经在队列中的内容会被忽略。

事件处理函数执行完成后，React 将触发重新渲染。在重新渲染期间，React 将处理队列。更新函数会在渲染期间执行，因此 **更新函数必须是 [纯函数](https://zh-hans.react.dev/learn/keeping-components-pure)** 并且只 **返回** 结果。不要尝试从它们内部设置 state 或者执行其他副作用。

## 更新 state 中的对象

state 中可以保存任意类型的 JavaScript 值，包括对象。但是，你不应该直接修改存放在 React state 中的对象。相反，当你想要更新一个对象时，你需要创建一个新的对象（或者将其拷贝一份），然后将 state 更新为此对象。

### 将 state 视为只读的 

你可以在 state 中存放任意类型的 JavaScript 值。

```jsx
const [x, setX] = useState(0);
```

到目前为止，你已经尝试过在 state 中存放数字、字符串和布尔值，这些类型的值在 JavaScript 中是不可变（immutable）的，这意味着它们不能被改变或是只读的。你可以通过替换它们的值以触发一次重新渲染。

```jsx
setX(5);
```

state `x` 从 `0` 变为 `5`，但是数字 `0` 本身并没有发生改变。在 JavaScript 中，无法对内置的原始值，如数字、字符串和布尔值，进行任何更改。

现在考虑 state 中存放对象的情况：

```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });
```

从技术上来讲，可以改变对象自身的内容。**当你这样做时，就制造了一个 mutation**：

```jsx
position.x = 5;
```

然而，虽然严格来说 React state 中存放的对象是可变的，但你应该像处理数字、布尔值、字符串一样将它们视为不可变的。因此你应该替换它们的值，而不是对它们进行修改。

换句话说，应该 **把所有存放在 state 中的 JavaScript 对象都视为只读的**。

在下面的例子中，我们用一个存放在 state 中的对象来表示指针当前的位置。当你在预览区触摸或移动光标时，红色的点本应移动。但是实际上红点仍停留在原处：

```jsx
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

问题出在下面这段代码中。

```jsx
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

这段代码直接修改了上一次渲染中分配给 `position` 的对象。但是因为并没有使用 state 的设置函数，React 并不知道对象已更改。所以 React 没有做出任何响应。这就像在吃完饭之后才尝试去改变要点的菜一样。虽然在一些情况下，直接修改 state 可能是有效的，但我们并不推荐这么做。你应该把在渲染过程中可以访问到的 state 视为只读的。

在这种情况下，为了真正地触发一次重新渲染，**你需要创建一个新对象并把它传递给 state 的设置函数**：

```jsx
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

通过使用 `setPosition`，你在告诉 React：

- 使用这个新的对象替换 `position` 的值
- 然后再次渲染这个组件

> #### 使用展开语法复制对象 
>
> 如果只想改变对象的其中一个值，可以使用 `...` 复制整个对象，只更改需要变更的属性。
>
> ```jsx
> onPointerMove={e => {
> setPosition({
> ...position,
>  y: e.clientY
> });
> }}
> ```
>
> 只能在竖直方向移动

### 更新一个嵌套对象 

考虑下面这种结构的嵌套对象：

```jsx
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

如果你想要更新 `person.artwork.city` 的值，用 mutation 来实现的方法非常容易理解：

```jsx
person.artwork.city = 'New Delhi';
```

但是在 React 中，你需要将 state 视为不可变的！为了修改 `city` 的值，你首先需要创建一个新的 `artwork` 对象（其中预先填充了上一个 `artwork` 对象中的数据），然后创建一个新的 `person` 对象，并使得其中的 `artwork` 属性指向新创建的 `artwork` 对象：

```jsx
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

或者，写成一个函数调用：

```jsx
setPerson({
  ...person, // 复制其它字段的数据 
  artwork: { // 替换 artwork 字段 
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
  }
});
```

###  Immer

如果你的 state 有多层的嵌套，你或许应该考虑 [将其扁平化](https://zh-hans.react.dev/learn/choosing-the-state-structure#avoid-deeply-nested-state)。但是，如果你不想改变 state 的数据结构，你可能更喜欢用一种更便捷的方式来实现嵌套展开的效果。[Immer](https://github.com/immerjs/use-immer) 是一个非常流行的库，它可以让你使用简便但可以直接修改的语法编写代码，并会帮你处理好复制的过程。通过使用 Immer，你写出的代码看起来就像是你“打破了规则”而直接修改了对象：

```jsx
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

尝试使用 Immer:

1. 运行 `npm install use-immer` 添加 Immer 依赖
2. 用 `import { useImmer } from 'use-immer'` 替换掉 `import { useState } from 'react'`

> #### 为什么在 React 中不推荐直接修改 state？ 
>
> - **调试**：如果你使用 `console.log` 并且不直接修改 state，你之前日志中的 state 的值就不会被新的 state 变化所影响。这样你就可以清楚地看到两次渲染之间 state 的值发生了什么变化
> - **优化**：React 常见的 [优化策略](https://zh-hans.react.dev/reference/react/memo) 依赖于如果之前的 props 或者 state 的值和下一次相同就跳过渲染。如果你从未直接修改 state ，那么你就可以很快看到 state 是否发生了变化。如果 `prevObj === obj`，那么你就可以肯定这个对象内部并没有发生改变。
> - **新功能**：我们正在构建的 React 的新功能依赖于 state 被 [像快照一样看待](https://zh-hans.react.dev/learn/state-as-a-snapshot) 的理念。如果你直接修改 state 的历史版本，可能会影响你使用这些新功能。
> - **需求变更**：有些应用功能在不出现任何修改的情况下会更容易实现，比如实现撤销/恢复、展示修改历史，或是允许用户把表单重置成某个之前的值。这是因为你可以把 state 之前的拷贝保存到内存中，并适时对其进行再次使用。如果一开始就用了直接修改 state 的方式，那么后面要实现这样的功能就会变得非常困难。
> - **更简单的实现**：React 并不依赖于 mutation ，所以你不需要对对象进行任何特殊操作。它不需要像很多“响应式”的解决方案一样去劫持对象的属性、总是用代理把对象包裹起来，或者在初始化时做其他工作。这也是 React 允许你把任何对象存放在 state 中——不管对象有多大——而不会造成有任何额外的性能或正确性问题的原因。

## 更新 state 中的数组

数组是另外一种可以存储在 state 中的 JavaScript 对象，它虽然是可变的，但是却应该被视为不可变。同对象一样，当你想要更新存储于 state 中的数组时，你需要创建一个新的数组（或者创建一份已有数组的拷贝值），并使用新数组设置 state。

### 在没有 mutation 的前提下更新数组 

在 JavaScript 中，数组只是另一种对象。[同对象一样](https://zh-hans.react.dev/learn/updating-objects-in-state)，**你需要将 React state 中的数组视为只读的**。这意味着你不应该使用类似于 `arr[0] = 'bird'` 这样的方式来重新分配数组中的元素，也不应该使用会直接修改原始数组的方法，例如 `push()` 和 `pop()`。

相反，每次要更新一个数组时，你需要把一个**新**的数组传入 state 的 setting 方法中。为此，你可以通过使用像 `filter()` 和 `map()` 这样不会直接修改原始值的方法，从原始数组生成一个新的数组。然后你就可以将 state 设置为这个新生成的数组。

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

|          | 避免使用 (会改变原始数组)     | 推荐使用 (会返回一个新数组）  |
| -------- | ----------------------------- | ----------------------------- |
| 添加元素 | `push`，`unshift`             | `concat`，`[...arr]` 展开语法 |
| 删除元素 | `pop`，`shift`，`splice`      | `filter`，`slice`             |
| 替换元素 | `splice`，`arr[i] = ...` 赋值 | `map`                         |
| 排序     | `reverse`，`sort`             | 先将数组复制一份              |

或者，你可以[使用 Immer](https://zh-hans.react.dev/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) ，这样你便可以使用表格中的所有方法了。

### 向数组中添加元素 

`push()` 会直接修改原始数组，而你不希望这样：

```jsx
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>添加</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

相反，你应该创建一个 **新** 数组，其包含了原始数组的所有元素 **以及** 一个在末尾的新元素。这可以通过很多种方法实现，最简单的一种就是使用 `...` [数组展开](https://zh-hans.react.dev/a-javascript-refresher#array-spread) 语法：

```jsx
setArtists( // 替换 state
  [ // 是通过传入一个新数组实现的
    ...artists, // 新数组包含原数组的所有元素
    { id: nextId++, name: name } // 并在末尾添加了一个新的元素
  ]
);
```

数组展开运算符还允许你把新添加的元素放在原始的 `...artists` 之前：

```jsx
setArtists([
  { id: nextId++, name: name },
  ...artists // 将原数组中的元素放在末尾
]);
```

这样一来，展开操作就可以完成 `push()` 和 `unshift()` 的工作，将新元素添加到数组的末尾和开头。

### 从数组中删除元素 

从数组中删除一个元素最简单的方法就是将它**过滤出去**。换句话说，你需要生成一个不包含该元素的新数组。这可以通过 `filter` 方法实现，例如：

```jsx
import { useState } from 'react'

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye' },
  { id: 2, name: 'Louise Nevelson' },
]

export default function List() {
  const [artists, setArtists] = useState(initialArtists)

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button
              onClick={() => {
                setArtists(artists.filter(a => a.id !== artist.id))
              }}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
```

`artists.filter(s => s.id !== artist.id)` 表示“创建一个新的数组，该数组由那些 ID 与 `artists.id` 不同的 `artists` 组成”。换句话说，每个 artist 的“删除”按钮会把 *那一个* artist 从原始数组中过滤掉，并使用过滤后的数组再次进行渲染。注意，`filter` 并不会改变原始数组。

### 转换数组 

如果你想改变数组中的某些或全部元素，你可以用 `map()` 创建一个**新**数组。你传入 `map` 的函数决定了要根据每个元素的值或索引（或二者都要）对元素做何处理。

在下面的例子中，一个数组记录了两个圆形和一个正方形的坐标。当你点击按钮时，仅有两个圆形会向下移动 100 像素。这是通过使用 `map()` 生成一个新数组实现的。

```jsx
import { useState } from 'react'

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
]

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(initialShapes)

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // 不作改变
        return shape
      } else {
        // 返回一个新的圆形，位置在下方 50px 处
        return {
          ...shape,
          y: shape.y + 50,
        }
      }
    })
    // 使用新的数组进行重渲染
    setShapes(nextShapes)
  }

  return (
    <>
      <button onClick={handleClick}>所有圆形向下移动！</button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
            background: 'purple',
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            borderRadius: shape.type === 'circle' ? '50%' : '',
            width: 20,
            height: 20,
          }}
        />
      ))}
    </>
  )
}
```

### 替换数组中的元素 

想要替换数组中一个或多个元素是非常常见的。类似 `arr[0] = 'bird'` 这样的赋值语句会直接修改原始数组，所以在这种情况下，你也应该使用 `map`。

要替换一个元素，请使用 `map` 创建一个新数组。在你的 `map` 回调里，第二个参数是元素的索引。使用索引来判断最终是返回原始的元素（即回调的第一个参数）还是替换成其他值：

```jsx
import { useState } from 'react'

let initialCounters = [0, 0, 0]

export default function CounterList() {
  const [counters, setCounters] = useState(initialCounters)

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // 递增被点击的计数器数值
        return c + 1
      } else {
        // 其余部分不发生变化
        return c
      }
    })
    setCounters(nextCounters)
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button
            onClick={() => {
              handleIncrementClick(i)
            }}>
            +1
          </button>
        </li>
      ))}
    </ul>
  )
}
```

### 向数组中插入元素 

有时，你也许想向数组特定位置插入一个元素，这个位置既不在数组开头，也不在末尾。为此，你可以将数组展开运算符 `...` 和 `slice()` 方法一起使用。`slice()` 方法让你从数组中切出“一片”。为了将元素插入数组，你需要先展开原数组在插入点之前的切片，然后插入新元素，最后展开原数组中剩下的部分。

下面的例子中，插入按钮总是会将元素插入到数组中索引为 `1` 的位置。

```jsx
import { useState } from 'react'

let nextId = 3
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye' },
  { id: 2, name: 'Louise Nevelson' },
]

export default function List() {
  const [name, setName] = useState('')
  const [artists, setArtists] = useState(initialArtists)

  function handleClick() {
    const insertAt = 1 // 可能是任何索引
    const nextArtists = [
      // 插入点之前的元素：
      ...artists.slice(0, insertAt),
      // 新的元素：
      { id: nextId++, name: name },
      // 插入点之后的元素：
      ...artists.slice(insertAt),
    ]
    setArtists(nextArtists)
    setName('')
  }

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleClick}>插入</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  )
}
```

### 其他改变数组的情况 

总会有一些事，是你仅仅依靠展开运算符和 `map()` 或者 `filter()` 等不会直接修改原值的方法所无法做到的。例如，你可能想翻转数组，或是对数组排序。而 JavaScript 中的 `reverse()` 和 `sort()` 方法会改变原数组，所以你无法直接使用它们。

**可以先拷贝这个数组，再改变这个拷贝后的值。**

```jsx
import { useState } from 'react'

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
]

export default function List() {
  const [list, setList] = useState(initialList)

  function handleClick() {
    const nextList = [...list]
    nextList.reverse()
    setList(nextList)
  }

  return (
    <>
      <button onClick={handleClick}>翻转</button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  )
}
```

在这段代码中，你先使用 `[...list]` 展开运算符创建了一份数组的拷贝值。当你有了这个拷贝值后，你就可以使用像 `nextList.reverse()` 或 `nextList.sort()` 这样直接修改原数组的方法。你甚至可以通过 `nextList[0] = "something"` 这样的方式对数组中的特定元素进行赋值。

然而，**即使你拷贝了数组，你还是不能直接修改其内部的元素**。这是因为数组的拷贝是浅拷贝——新的数组中依然保留了与原始数组相同的元素。因此，如果你修改了拷贝数组内部的某个对象，其实你正在直接修改当前的 state。举个例子，像下面的代码就会带来问题。

```jsx
const nextList = [...list];
nextList[0].seen = true; // 问题：直接修改了 list[0] 的值
setList(nextList);
```

虽然 `nextList` 和 `list` 是两个不同的数组，**`nextList[0]` 和 `list[0]` 却指向了同一个对象**。因此，通过改变 `nextList[0].seen`，`list[0].seen` 的值也被改变了。这是一种 state 的 mutation 操作，应该避免这么做！你可以用类似于更新嵌套的 JavaScript 对象的方式解决这个问题——拷贝想要修改的特定元素，而不是直接修改它。下面是具体的操作。

## 更新数组内部的对象 

对象并不是 *真的* 位于数组“内部”。可能他们在代码中看起来像是在数组“内部”，但其实数组中的每个对象都是这个数组“指向”的一个存储于其它位置的值。这就是当你在处理类似 `list[0]` 这样的嵌套字段时需要格外小心的原因。其他人的艺术品清单可能指向了数组的同一个元素！

**当你更新一个嵌套的 state 时，你需要从想要更新的地方创建拷贝值，一直这样，直到顶层。** 让我们看一下这该怎么做。

在下面的例子中，两个不同的艺术品清单有着相同的初始 state。他们本应该互不影响，但是因为一次 mutation，他们的 state 被意外地共享了，勾选一个清单中的事项会影响另外一个清单：

```jsx
import { useState } from 'react'

let nextId = 3
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
]

export default function BucketList() {
  const [myList, setMyList] = useState(initialList)
  const [yourList, setYourList] = useState(initialList)

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = myList.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen }
      }
      return artwork
    })
    setMyList(myNextList)
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList]
    const artwork = yourNextList.find(a => a.id === artworkId)
    artwork.seen = nextSeen
    setYourList(yourNextList)
  }

  return (
    <>
      <h1>艺术愿望清单</h1>
      <h2>我想看的艺术清单：</h2>
      <ItemList artworks={myList} onToggle={handleToggleMyList} />
      <h2>你想看的艺术清单：</h2>
      <ItemList artworks={yourList} onToggle={handleToggleYourList} />
    </>
  )
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type='checkbox'
              checked={artwork.seen}
              onChange={e => {
                onToggle(artwork.id, e.target.checked)
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  )
}
```

在 `handleToggleYourList` 中，因为直接修改了已经有的对象，而其他对象又引用了这个对象，导致修改这个已有的对象时，会导致其他对象也发生变化。显然这是错误的。

```jsx
function handleToggleYourList(artworkId, nextSeen) {
  const yourNextList = [...yourList]
  const artwork = yourNextList.find(a => a.id === artworkId)
  artwork.seen = nextSeen // 问题：直接修改了已有的元素
  setYourList(yourNextList)
}
```

虽然 `yourNextList` 这个数组是新的，但是其**内部的元素本身**与原数组 `yourList` 是相同的。因此，修改 `artwork.seen`，其实是在修改**原始的** artwork 对象。而这个 artwork 对象也被 `myList` 使用，这样就带来了 bug。如果你避免直接修改 state，它们就会消失。

使用 `map` 在没有 mutation 的前提下将一个旧的元素替换成更新的版本。 `handleToggleMyList` 通过 `map` 重新组成了一个数组，与 `yourList` 中的 artwork 指向不同的地址，所以在 `handleToggleMyList` 中就是正常的。

```jsx
function handleToggleMyList(artworkId, nextSeen) {
  const myNextList = myList.map(artwork => {
    if (artwork.id === artworkId) {
      return { ...artwork, seen: nextSeen }
    }
    return artwork
  })
  setMyList(myNextList)
}
```

### 使用 Immer 编写简洁的更新逻辑 

在没有 mutation 的前提下更新嵌套数组可能会变得有点重复。[就像对对象一样](https://zh-hans.react.dev/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- 通常情况下，你应该不需要更新处于非常深层级的 state 。如果你有此类需求，你或许需要[调整一下数据的结构](https://zh-hans.react.dev/learn/choosing-the-state-structure#avoid-deeply-nested-state)，让数据变得扁平一些。
- 如果你不想改变 state 的数据结构，你也许会更喜欢使用 [Immer](https://github.com/immerjs/use-immer) ，它让你可以继续使用方便的，但会直接修改原值的语法，并负责为你生成拷贝值。

下面是用 Immer 来重写的艺术愿望清单的例子：

```jsx
import { useState } from 'react'
import { useImmer } from 'use-immer'

let nextId = 3
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
]

export default function BucketList() {
  const [myList, updateMyList] = useImmer(initialList)
  const [yourList, updateYourList] = useImmer(initialList)

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a => a.id === id)
      artwork.seen = nextSeen
    })
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a => a.id === artworkId)
      artwork.seen = nextSeen
    })
  }

  return (
    <>
      <h1>艺术愿望清单</h1>
      <h2>我想看的艺术清单：</h2>
      <ItemList artworks={myList} onToggle={handleToggleMyList} />
      <h2>你想看的艺术清单：</h2>
      <ItemList artworks={yourList} onToggle={handleToggleYourList} />
    </>
  )
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type='checkbox'
              checked={artwork.seen}
              onChange={e => {
                onToggle(artwork.id, e.target.checked)
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  )
}

```

请注意当使用 Immer 时，**类似 `artwork.seen = nextSeen` 这种会产生 mutation 的语法不会再有任何问题了：**

```jsx
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

这是因为你并不是在直接修改原始的 state，而是在修改 Immer 提供的一个特殊的 `draft` 对象。同理，你也可以为 `draft` 的内容使用 `push()` 和 `pop()` 这些会直接修改原值的方法。在幕后，Immer 总是会根据你对 `draft` 的修改来从头开始构建下一个 state。这使得你的事件处理程序非常的简洁，同时也不会直接修改 state。
