---
title: set 与 map
date: 2021-12-18 09:11:59
tags:
 - ES6
 - javaScript
categories: ES6
---

# set 与 map #
## set ##
### 基本用法 ###
ES6 提供了新的数据结构 Set。它类似于数组，**但是成员的值都是唯一的，没有重复的值**。

Set 本身是一个构造函数，用来生成 Set 数据结构。

<!-- more -->

#### set 结构的声明 ####

```js
	let s = new Set()
	let s2 = new Set([1, 2, 3, 4])
```

#### set 的初始化 ####
Set 函数可以接受一个数组(或者具有 iterable 接口的其他数据结构)作为参数，用来初始化

```js
	let arr = [1, 2, 3, 4]
	let s = new Set(arr)

	let s2 = new Set()
	arr.forEach((x) => s.add(x))

	let s3 = new Set(document.querySelectorAll("div"))
```

#### set 转换为数组 ####
使用`...`扩展运算符或`Array.from`方法

```js
	let s = new Set([1, 2, 3, 4])
	let arr = [...s]
	let arr2 = Array.from(set)
```

因此有两种数组去重的方法

```js
    let s = new Set([1, 1, 2, 3, 4, 2])
    let arr = [...s]
    let arr2 = Array.from(s)
```



#### 注 ####
向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符(===)，主要的区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。 

```js
	let set = new Set()
	let a = NaN
	let b = NaN
	set.add(a)
	set.add(b)
	// Set {NaN}
```

上面代码向 Set 实例添加了两个NaN，但是只能加入一个。这表明，在 Set 内部，两个NaN是相等.另外，两个对象总是不相等的

```js
    let set = new Set()

    set.add({})
    set.size // 1

    set.add({})
    set.size // 2
```

### Set 实例的属性和方法 ###
属性：
- `Set.prototype.constructor`: 构造函数，默认就是Set函数。
- `Set.prototype.size`: 返回Set实例的成员总数。

方法：
Set 实例的方法分为两大类: 操作方法(用于操作数据)和遍历方法(用于遍历成员)。下面先介绍四个操作方法
- `add(value)`: 添加某个值，返回 Set 结构本身。 
- `delete(value)`: 删除某个值，返回一个布尔值，表示删除是否成功。 
- `has(value)`: 返回一个布尔值，表示该值是否为Set的成员。 
- `clear()`: 清除所有成员，没有返回值。

```js
    s.add(1).add(2).add(2)
    s.size // 2

    s.has(1) // true
    s.has(2) // true
    s.has(3) // false

    s.delete(2)
    s.has(2) // false
```

### 遍历操作 ###
Set 结构的实例有四个遍历方法，可以用于遍历成员。
- `keys()`: 返回键名的遍历器
- `values()`: 返回键值的遍历器
- `entries()`: 返回键值对的遍历器
- `forEach()`: 使用回调函数遍历每个成员

需要特别指出的是，**Set的遍历顺序就是插入顺序**。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

#### `keys()`，`values()`，`entries()`

以上三个方法的返回值都是遍历器对象。由于 Set 结构没有键名，只有键值(或者说键名和键值是同一个值)，所以`keys()`方法和`values()`方法的行为完全一致

```js
	let set = new Set(["red", "green", "blue"]);
	
	for (let item of set.keys()) {
	  console.log(item);
	}
	// red
	// green
	// blue
	
	for (let item of set.values()) {
	  console.log(item);
	}
	// red
	// green
	// blue
	
	for (let item of set.entries()) {
	  console.log(item);
	}
	// ["red", "red"]
	// ["green", "green"]
	// ["blue", "blue"]
```

上面代码中，`entries()`方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的`values`方法

```js
	Set.prototype[Symbol.iterator] === Set.prototype.values  // true
```

#### `forEach()`

Set 结构的实例与数组一样，也拥有`forEach`方法，用于对每个成员执行某种操作，没有返回值

```js
    set = new Set(["red", "bule", "black"])
    set.forEach((value, key) => console.log(key + " : " + value))
	// red : red
	// bule : bule
	// black : black
```

上面代码说明，`forEach`方法的参数就是一个处理函数。该函数的参数与数组的`forEach`一致，依次为键值、键名、集合本身(上例省略了该参数)。这里需要注意，Set 结构的键名就是键值(两者是同一个值)，因此第一个参数与第二个参数的值永远都是一样的。 
另外，`forEach`方法还可以有第二个参数，表示绑定处理函数内部的`this`对象

#### 遍历的应用

实现并集(Union)、交集(Intersect)和差集(Difference)

```js
    let s = new Set([1, 2, 3])
    let s2 = new Set([2, 3, 4])
    
    // 并集
    let union = new Set([...s, ...s2])
    //交集
    let intersect = new Set([...s].filter(num => s2.has(num)))
    //差集
    let difference = new Set([...s].filter(num => !s2.has(num)))
```

如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用`Array.from()`方法。 

```js
	// 方法一
	let set = new Set([1, 2, 3]);
	set = new Set([...set].map(val => val * 2));
	// set的值是2, 4, 6
	
	// 方法二
	let set = new Set([1, 2, 3]);
	set = new Set(Array.from(set, val => val * 2));
	// set的值是2, 4, 6
```

## map ##
JavaScript 的对象(Object)，本质上是键值对的集合(Hash 结构)，但是传统上只能用字符串当作键。这给它的使用带来了很大的限制

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值(包括对象)都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果您需要“键值对”的数据结构，Map 比 Object 更合适。
### 基本使用 ###
#### map 创建 ####
作为构造函数，Map 也可以接受一个数组作为参数。该**数组的成员是一个个表示键值对的数组**

```js
    let m = new Map([
        ["name", "tom"],
        ["age", 18]
    ])
	m.size //2
```

上面代码在新建 Map 实例时，就指定了两个键`name`和`age`，相当于下面代码

```ja
    let item = [
        ['name', 'tom'],
        ['age', 18],
    ]

    let m = new Map()
    item.forEach(([key, value]) => m.set(key, value))
```

不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。这就是说，Set和Map都可以用来生成新的 Map。

```js
    let s = new Set([
        ["name", "tom"],
        ["age", 18]
    ])
    
    let m = new Map(s)
	let m2 = new Map(m)
	console.log(m == m2) //false
```

同样的值的两个实例，在 Map 结构中被视为两个键

```js
    const map = new Map()

    const k1 = ['a']
    const k2 = ['a']

    map.set(k1, 111).set(k2, 222)

    map.get(k1) // 111
    map.get(k2) // 222
```

变量k1和k2的值是一样的，但是它们在 Map 结构中被视为两个键
由上可知，Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞(clash)的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名

### map 的属性和操作方法 ###
#### `size` 属性

`size`属性返回map的成员总数

```
 let map = new Map()
 map.set("foo", 1)
 map.set("bar", 2)
// map.size == 3
```

#### `set(key, value)`

`set`方法设置键名`key`对应的键值为value`，`然后返回整个 Map 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键

```js
 let m = new Map()
 let a = "abc"
 m.set(a, 3) //键是变量
 m.set("edition", 6) // 键是字符串
 m.set(262, "standard") // 键是数值
 m.set(undefined, "nah") // 键是 undefined
```

`set()`方法返回的是当前的Map对象，因此可以采用链式写法。

```js
let a = "abc"
const m = new Map().set(a, 3).set("edition", 6).set(262, "standard")
```

#### `get(key)`

`get()` 方法读取key所对应的键值

```js
 let map = new Map([
     ["foo", 1]
 ])
map.get("foo") // 1
```

#### `has(key)`

`has()`方法返回一个布尔值，表示某个键是否在当前 Map 对象之中

```js
 let map = new Map([
     ["foo", 1]
 ])
map.has("foo") // true
map.has("bar") //false
```

#### `delete(key)`

`delete()`方法删除某个键，返回`true`。如果删除失败，返回false

```js
 let map = new Map([
     ["foo", 1]
 ])
 map.delete("foo")
 console.log(map.has("foo")) // false
```

#### `clear()`

`clear()`方法清除所有成员，没有返回值

```js
let map = new Map([
     ["foo", 1],
     ["bar", 2]
 ])
 map.clear()
 map.size //0
```

### map 的遍历操作 ###
Map 结构原生提供三个遍历器生成函数和一个遍历方法。 
- `keys()`: 返回键名的遍历器。 
- `values()`: 返回键值的遍历器。 
- `entries()`: 返回所有成员的遍历器。 
- `forEach()`: 遍历 Map 的所有成员

```js
    let map = new Map([
        ["foo", 1],
        ["bar", 2]
    ])

    for (const key of map.keys()) {
        console.log(key)
    }
    // foo , bar 

    for (const value of map.values()) {
        console.log(value)
    }
    // 1 , 2

    for (const item of map.entries()) {
        console.log(item)
    }
    // ["foo", 1] , ["bar", 2]

    for (const [key, value] of map.entries()) {
      console.log(key, value)
    }
    // ["foo", 1] , ["bar", 2]

    // 等同于使用map.entries()
    for (const [key, value] of map) {
      console.log(key, value);
    }
    // ["foo", 1] , ["bar", 2]
```

上面代码最后的那个例子，表示 Map 结构的默认遍历器接口(`Symbol.iterator`属性)，就是`entries()`方法

```
	map[Symbol.iterator] === map.entries
	// true
```

结合数组的`map`方法、`filter`方法，可以实现 Map 的遍历和过滤(Map 本身没有`map`和`filter`方法)。

```js
	const map0 = new Map().set(1, "a").set(2, "b").set(3, "c")
	
	const map1 = new Map([...map0].filter(([k, v]) => k < 3))
	// 产生 Map 结构 {1 => 'a', 2 => 'b'}
	
	const map2 = new Map([...map0].map(([k, v]) => [k * 2, "_" + v]))
	// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

