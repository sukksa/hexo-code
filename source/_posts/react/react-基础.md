---
title: react 基础
date: 2026-01-11 11:18:45
tags:
 - react
---

## 将 Props 传递给组件

React 组件使用 *props* 来互相通信。每个父组件都可以提供 props 给它的子组件，从而将一些信息传递给它。可以通过它们传递任何 JavaScript 值，包括对象、数组和函数。

首先，将一些 props 传递给子组件 `Avatar`。例如，传递两个 props：`person`（一个对象）和 `size`（一个数字）：

```jsx
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

React 组件函数接受一个参数，一个 `props` 对象，并解构为单独的属性：

```jsx
function Avatar({ person, size = 100 }) {
  const src = `https://i.imgur.com/${person.imageId}.jpg`
  return <img className='avatar' src={src} alt='Lin Lanying' width={size} height={size} />
}
```

有时候，传递 props 会变得非常重复：当父组件想将一些porps传递到原封不动传递到子组件时，因为这些组件不直接使用他们本身的任何 props，可以使用更简洁的“展开”语法：

```jsx
function Father(props) {
  return (
    <div className="card">
      <Child {...props} />
    </div>
  );
}
```

## 将 JSX 作为子组件传递 

嵌套浏览器内置标签是很常见的：

```html
<div>
  <img />
</div>
```

有时你会希望以相同的方式嵌套自己的组件：

```html
<Card>
  <Avatar />
</Card>
```

当你将内容嵌套在 JSX 标签中时，父组件将在名为 `children` 的 prop 中接收到该内容。例如，下面的 `Card` 组件将接收一个被设为 `<Avatar />` 的 `children` prop 并将其包裹在 div 中渲染：

```jsx
function Avatar({ person, size = 100 }) {
  const src = `https://i.imgur.com/${person.imageId}.jpg`
  return <img className='avatar' src={src} alt='Lin Lanying' width={size} height={size} />
}

function Card({ children, name }) {
  return (
    <div className='card'>
      <h3>{name}</h3>
      {children}
    </div>
  )
}

export default function Profile() {
  return (
    <Card name='card'>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2',
        }}
      />
    </Card>
  )
}
```

可以将带有 `children` prop 的组件看作有一个“洞”，可以由其父组件使用任意 JSX 来“填充”。在 React 中，`children` 属性就是 Vue 的默认插槽 (`<slot />`) 的对应物。React 会自动将这些内容作为一个名为 `children` 的 prop 传递给该组件。

若组件包含两个元素以上，`children` 会作为一个数组接受所有的元素。

> - 要传递 props，请将它们添加到 JSX，就像使用 HTML 属性一样。
> - 要读取 props，请使用 `function Avatar({ person, size })` 解构语法。
> - 你可以指定一个默认值，如 `size = 100`，用于缺少值或值为 `undefined` 的 props 。
> - 你可以使用 `<Avatar {...props} />` JSX 展开语法转发所有 props，但不要过度使用它！
> - 像 `<Card><Avatar /></Card>` 这样的嵌套 JSX，将被视为 `Card` 组件的 `children` prop。
> - Props 是只读的时间快照：每次渲染都会收到新版本的 props。
> - 你不能改变 props。当你需要交互性时，你可以设置 state。

## 条件渲染

### 条件返回 JSX 

假设有一个 `PackingList` 组件，里面渲染多个 `Item` 组件，每个物品可标记为打包与否：

可以用 [if/else 语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/if...else) 去判断：

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

如果 `isPacked` 属性是 `true`，这段代码会**返回一个不一样的 JSX**。

在一些情况下，你不想有任何东西进行渲染。比如，你不想显示已经打包好的物品。但一个组件必须返回一些东西。这种情况下，你可以直接返回 `null`。

```jsx
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

### 三目运算符（`? :`） 

JavaScript 有一种紧凑型语法来实现条件判断表达式——[条件运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 又称“三目运算符”。

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

> 或许你认为第一个可能会创建两个不同的 `<li>` “实例”。但 JSX 元素不是“实例”，因为它们没有内部状态也不是真实的 DOM 节点。它们只是一些简单的描述，所以上面这两个例子事实上是完全相同的。

### 与运算符（`&&`） 

你会遇到的另一个常见的快捷表达式是 [JavaScript 逻辑与（`&&`）运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The logical AND ( %26%26 ) operator,it returns a Boolean value.)。在 React 组件里，通常用在当条件成立时，你想渲染一些 JSX，**或者不做任何渲染**。使用 `&&`，可以实现仅当 `isPacked` 为 `true` 时，渲染勾选符号。

```jsx
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

当 [JavaScript && 表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND) 的左侧（我们的条件）为 `true` 时，它则返回其右侧的值。但条件的结果是 `false`，则整个表达式会变成 `false`。在 JSX 里，React 会将 `false` 视为一个“空值”，就像 `null` 或者 `undefined`，这样 React 就不会在这里进行任何渲染。

> **切勿将数字放在 `&&` 左侧.**
>
> JavaScript 会自动将左侧的值转换成布尔类型以判断条件成立与否。然而，如果左侧是 `0`，整个表达式将变成左侧的值（`0`），React 此时则会渲染 `0` 而不是不进行渲染。
>
> 例如，一个常见的错误是 `messageCount && <p>New messages</p>`。其原本是想当 `messageCount` 为 0 的时候不进行渲染，但实际上却渲染了 `0`。
>
> 为了更正，可以将左侧的值改成布尔类型：`messageCount > 0 && <p>New messages</p>`。

## 列表循环

对于列表项可以通过 [`map()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 或 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 这样的方法来渲染出一个组件列表。

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          因{person.accomplishment}而闻名世界
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

如果想让每个列表项都输出多个 DOM 节点而非一个的话，该怎么做呢？

Fragment 语法的简写形式 `<> </>` 无法接受 key 值，所以只能要么把生成的节点用一个 `<div>` 标签包裹起来，要么使用长一点但更明确的 `<Fragment>` 写法：

```
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

这里的 Fragment 标签本身并不会出现在 DOM 上，这串代码最终会转换成 `<h1>`、`<p>`、`<h1>`、`<p>`…… 的列表。

### 如何设定 `key` 值 

不同来源的数据往往对应不同的 key 值获取方式：

- **来自数据库的数据：** 如果你的数据是从数据库中获取的，那你可以直接使用数据表中的主键，因为它们天然具有唯一性。
- **本地产生数据：** 如果你数据的产生和保存都在本地（例如笔记软件里的笔记），那么你可以使用一个自增计数器，[`crypto.randomUUID()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto/randomUUID) 或者一个类似 [`uuid`](https://www.npmjs.com/package/uuid) 的库来生成 key。

### key 需要满足的条件 

- **key 值在兄弟节点之间必须是唯一的。** 不过不要求全局唯一，在不同的数组中可以使用相同的 key。
- **key 值不能改变**，否则就失去了使用 key 的意义！所以千万不要在渲染时动态地生成 key。

### React 中为什么需要 key？ 

设想一下，假如你桌面上的文件都没有文件名，取而代之的是，你需要通过文件的位置顺序来区分它们———第一个文件，第二个文件，以此类推。也许你也不是不能接受这种方式，可是一旦你删除了其中的一个文件，这种组织方式就会变得混乱无比。原来的第二个文件可能会变成第一个文件，第三个文件会成为第二个文件……

React 里需要 key 和文件夹里的文件需要有文件名的道理是类似的。它们（key 和文件名）都让我们可以从众多的兄弟元素中唯一标识出某一项（JSX 节点或文件）。而一个精心选择的 key 值所能提供的信息远远不止于这个元素在数组中的位置。即使元素的位置在渲染的过程中发生了改变，它提供的 `key` 值也能让 React 在整个生命周期中一直认得它。

> 你可能会想直接把数组项的索引当作 key 值来用，实际上，如果你没有显式地指定 `key` 值，React 确实默认会这么做。但是数组项的顺序在插入、删除或者重新排序等操作中会发生改变，此时把索引顺序用作 key 值会产生一些微妙且令人困惑的 bug。
>
> 与之类似，请不要在运行过程中动态地产生 key，像是 `key={Math.random()}` 这种方式。这会导致每次重新渲染后的 key 值都不一样，从而使得所有的组件和 DOM 元素每次都要重新创建。这不仅会造成运行变慢的问题，更有可能导致用户输入的丢失。所以，使用能从给定数据中稳定取得的值才是明智的选择。
>
> 有一点需要注意，组件不会把 `key` 当作 props 的一部分。Key 的存在只对 React 本身起到提示作用。如果你的组件需要一个 ID，那么请把它作为一个单独的 prop 传给组件： `<Profile key={id} userId={id} />`。
