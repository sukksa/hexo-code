---
title: Promise
date: 2022-10-03 22:48:08
tags:
 - ES6
 - javaScript
categories: ES6
---


# Promise  #
## Promise 是什么

### 理解 Promise ###

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。 

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件(通常是一个异步操作)的结果。

- 从语法上看：`Promise`是一个构造函数 (自己身上有`all`、`reject`、`resolve`这几个方法，原型上有`then`、`catch`等方法)
- 功能上看：`promise`对象用来封装一个异步操作并可以获取其成功/失败的结果值

<!-- more -->

### Promise 的三种状态
实例对象promise中的一个属性 `PromiseState`，用于存放 `Promise` 的三种状态 `pending` `resolved/fullfilled` `rejected`

1. `pending` 变为 `resolved`/`fullfilled`
2. `pending` 变为 `rejected`

注：

- 对象的状态不受外界影响
- 只有这两种，且一个 `promise` 对象只能改变一次
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果
- 无论成功还是失败，都会有一个结果数据。成功的结果数据一般称为 `value`，而失败的一般称为 `reason`。

### Promise对象的值

实例对象`promise`的另一个值 `PromiseResult`
保存着对象 成功/失败 的值（`value`/`reason`）

### Promise 的基本使用

```js
const promise = new Promise(function (resolve, reject) {
    // ... some code
    if (/* 异步操作成功 */ ) {
        resolve(value)
    } else {
        reject(reason)
    }
})
```

`Promise`构造函数接受**一个函数**（执行器函数）作为参数，该函数的**两个参数**分别是`resolve`和`reject`。它们是**两个函数**，由 JavaScript 引擎提供，不用自己部署。

`resolve`函数的作用是，将`Promise`对象的状态从“未完成”变为“成功”（即从 `pending` 变为 `resolved`），在**异步操作成功**时调用，并将异步操作的结果，作为参数`value`传递出去；
`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”（即从 `pending` 变为 `rejected`），在**异步操作失败**时调用，并将异步操作报出的错误，作为参数`error`/`reason`传递出去。

`Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数

```
Promise.then(
    function (value) {
        // success
    },
    function (reason) {
        // failure
    }
)
```

`then`方法可以接受**两个回调函数**作为参数。

- 第一个回调函数`onResolved()`是`Promise`对象的状态变为`resolved`时调用
- 第二个回调函数`onRejected()`是`Promise`对象的状态变为`rejected`时调用
- 这两个函数都是可选的，不一定要提供。它们都接受`Promise`对象传出的值作为参数

例：

```
// 创建一个新的p对象promise
const p = new Promise((resolve, reject) => {
    // 执行器函数
    // 执行异步操作任务
    setTimeout(() => {
        const time = Date.now()
        // 如果当前时间是偶数代表成功，否则失败
        if (time % 2 == 0) {
            // 如果成功，调用resolve(value)
            resolve('成功的数据，time=' + time)
        } else {
            // 如果失败，调用reject(reason)
            reject('失败的数据，time=' + time)
        }
    }, 1000)
})

p.then(
    (value) => {
        // 接收得到成功的value数据 onResolved
        console.log('成功的回调', value) // 成功的回调 成功的数据，time=1615015043258
    },
    (reason) => {
        // 接收得到失败的reason数据 onRejected
        console.log('失败的回调', reason) // 失败的回调 失败的数据，time=1615014995315
    }
)

```

> .then() 和执行器(executor)同步执行，.then() 中的回调函数异步执行

##  为什么要使用 Promise

### 指定回调函数的方式更加灵活

ES5：必须在启动异步任务前指定

```
// 1. 纯回调的形式
// 成功的回调函数
function successCallback(result) {
    console.log('声音文件创建成功：' + result)
}
// 失败的回调函数
function failureCallback(error) {
    console.log('声音文件创建失败：' + error)
}
// 必须先指定回调函数，再执行异步任务
createAudioFileAsync(audioSettings, successCallback, failureCallback) 
// 回调函数在执行异步任务（函数）前就要指定

```

promise：启动异步任务 => 返回promise对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定)

```
// 2. 使用Promise
const promise = createAudioFileAsync(audioSettings) // 执行2秒
setTimeout(() => {
  promise.then(successCallback, failureCallback) // 也可以获取
}, 3000)
```

### 支持链式调用，可以解决回调地狱问题

#### 什么是回调地狱

>  回调函数嵌套调用，外部回调函数异步执行的结果是其内部嵌套的回调函数执行的条件

```
doSomething(function(result) {
  	doSomethingElse(result, function(newResult) {
   		doThirdThing(newResult, function(finalResult) {
      		console.log('Got the final result:' + finalResult)
    	}, failureCallback)
 	 }, failureCallback)
}, failureCallback)
```

**回调地狱的缺点**

1. 不便于阅读
2. 不便于异常处理

#### 使用 promise 的链式调用解决回调地狱

```
doSomething()
    .then((result) => doSomethingElse(result))
    .then((newResult) => doThirdThing(newResult))
    .then((finalResult) => {
        console.log('Got the final result:' + finalResult)
    })
    .catch(failureCallback)
```

#### 回调地狱的终极解决方案 async/await

```
async function request() {
    try {
        const result = await doSomething()
        const newResult = await doSomethingElse(result)
        const finalResult = await doThirdThing(newResult)
        console.log('Got the final result:' + finalResult)
    } catch (error) {
        failureCallback(error)
    }
}
```

## Promise 相关方法

### Promise 构造函数：`Promise(executor) {}`

- `executor` 函数：**同步执行** `(resolve, reject) => {}`
- `resolve` 函数：内部定义成功时调用的函数 `resove(value)`
- `reject` 函数：内部定义失败时调用的函数 `reject(reason)`

`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

`resolve`函数的作用是，将`Promise`对象的状态从“未完成”变为“成功”(即从 `pending` 变为 `resolved`)，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去

`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”(即从 `pending` 变为 `rejected`)，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

> `executor` 是执行器，会在 `Promise` 内部立即同步回调，异步操作 `resolve`/`reject` 就在 `executor` 中执行

### Promise.prototype.then ()

`p.then(onResolved, onRejected)`

指定两个回调（成功+失败）

- `onResolved` 函数：成功的回调函数 `(value) => {}`
- `onRejected` 函数：失败的回调函数 `(reason) => {}`

`then()`的作用是为 `Promise` 实例添加状态改变时的回调函数。`then`方法的第一个参数是`resolved`状态的回调函数，第二个参数(可选)是`rejected`状态的回调函数。

`then`方法返回的是一个新的`Promise`实例(注意，不是原来那个`Promise`实例)。因此可以采用链式写法，即`then`方法后面再调用另一个`then`方法。

> 指定用于得到成功 `value` 的成功回调和用于得到失败 `reason` 的失败回调，返回一个新的 `promise` 对象

### Promise.prototype.catch()

`p.catch(onRejected)`

指定失败的回调

- `onRejected` 函数：失败的回调函数 `(reason) => {}`

```js
new Promise((resolve, reject) => {
    // excutor执行器函数
    setTimeout(() => {
        if (/* 异步操作成功 */) {
            resolve('成功的数据') // resolve()函数
        } else {
            reject('失败的数据') //reject()函数
        }
    }, 1000)
})
    .then((value) => {
        // onResolved()函数
        console.log(value) // 成功的数据
    })
    .catch((reason) => {
        // onRejected()函数
        console.log(reason) // 失败的数据
    })
```

> 这是`then()` 的语法糖，相当于 `then(undefined, onRejected)`

### Promise.resolve()

`Promise.resolve(value)`

- `value`：将被 `Promise` 对象解析的参数，也可以是一个成功或失败的 `Promise` 对象

- `return` ：返回一个带着给定值解析过的 `Promise` 对象，如果参数本身就是一个 `Promise` 对象，则直接返回这个 `Promise` 对象。

`Promise.resolve`方法的参数分成四种情况。

1. 参数是一个`Promise`实例

   如果参数是 Promise 实例，那么`Promise.resolve`将不做任何修改、原封不动地返回这个实例。

   ```
   let p2 = Promise.resolve(
       new Promise((resolve, reject) => {
           // resolve('OK') // 成功的Promise
           reject('Error')
       })
   )
   console.log(p2) // Promise {<rejected>: 'Error'}
   p2.catch((reason) => {
       console.log(reason) // Error
   })
   ```

2. 参数是一个`thenable`对象

   `thenable`对象指的是具有`then`方法的对象，比如下面这个对象。

   ```js
   let thenable = {
   	then: function (resolve, reject) {
           resolve(42)
   	},
   }
   ```

   `Promise.resolve`方法会将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then`方法。

   ```js
   let thenable = {
     then: function (resolve, reject) {
       resolve(42)
     },
   }
   
   let p1 = Promise.resolve(thenable);
   p1.then(function (value) {
     console.log(value); // 42
   })
   ```

   上面代码中，`thenable`对象的`then`方法执行后，对象`p1`的状态就变为`resolved`，从而立即执行最后那个`then`方法指定的回调函数，输出 42。

3. 参数不是具有`then`方法的对象，或根本就不是对象

   如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 Promise 对象，状态为`resolved`。

   ```js
   const p = Promise.resolve("Hello");
   
   p.then(function (s) {
     console.log(s);
   });
   // Hello
   ```

   上面代码生成一个新的 Promise 对象的实例`p`。由于字符串`Hello`不属于异步操作(判断方法是字符串对象不具有 then 方法)，返回 Promise 实例的状态从一生成就是`resolved`，所以回调函数会立即执行。`Promise.resolve`方法的参数，会同时传给回调函数。

4. 不带有任何参数

   `Promise.resolve`方法允许调用时不带参数，直接返回一个`resolved`状态的 Promise 对象。

   所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用`Promise.resolve`方法。

   ```js
   const p = Promise.resolve();
   
   p.then(function () {
     // ...
   })
   ```

   上面代码的变量`p`就是一个 Promise 对象。

   需要注意的是，立即`resolve`的 Promise 对象，是在本轮“事件循环”(event loop)的结束时，而不是在下一轮“事件循环”的开始时。

   ```js
   setTimeout(function () {
     console.log("three")
   }, 0)
   
   Promise.resolve().then(function () {
     console.log("two")
   })
   
   console.log("one")
   
   // one
   // two
   // three
   ```

   

   上面代码中，`setTimeout(fn, 0)`在下一轮“事件循环”开始时执行，`Promise.resolve()`在本轮“事件循环”结束时执行，`console.log('one')`则是立即执行，因此最先输出

###  Promise.reject()

`Promise.resolve(reason)`

- `reason`：失败的原因
- `return`：返回一个失败的 `promise` 对象，该实例的状态为`rejected`。

```
let p = Promise.reject(521)
let p2 = Promise.reject('iloveyou')
let p3 = Promise.reject(
    new Promise((resolve, reject) => {
        resolve('OK')
    })
)

console.log(p) // Promise {<rejected>: 521}
console.log(p2) // Promise {<rejected>: 'iloveyou'}
console.log(p3) // Promise {<rejected>: Promise}

```

注：

- `Promise.resolve()`/`Promise.reject()` 方法就是一个语法糖
- 用来快速得到`Promise`对象

```
//产生一个成功值为1的promise对象
new Promise((resolve, reject) => {
    resolve(1)
})
//相当于
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = Promise.reject(3)

p1.then((value) => {
    console.log(value)
}) // 1
p2.then((value) => {
    console.log(value)
}) // 2
p3.catch((reason) => {
    console.log(reason)
}) // 3
```

###  Promise.all() 

`Promise.all(iterable)`

- `iterable`：包含 n 个 `promise` 的可迭代对象，如 `Array` 或 `String`
- `return`：返回一个新的 `promise`，只有所有的 `promise` 都成功才成功，只要有一个失败了就直接失败

成功：

```
let p1 = new Promise((resolve, reject) => {
    resolve('OK')
})
let p2 = Promise.resolve('Success')
let p3 = Promise.resolve('Oh Yeah')

const result = Promise.all([p1, p2, p3])
console.log(result) // Promise {<pending>}
                       [[PromiseResult]]: Array(3)
                        0: "OK"
                        1: "Success"
                        2: "Oh Yeah"
                        length: 3
```

失败：

```
let p1 = new Promise((resolve, reject) => {
    resolve('OK')
})
let p2 = Promise.reject('Error')
let p3 = Promise.resolve('Oh Yeah')

const result = Promise.all([p1, p2, p3])
console.log(result) //Promise {<pending>}
						[[PromiseResult]]: "Error"
```

###  Promise.race()

`Promise.race(iterable)`

- `iterable`：包含 n 个 `promise` 的可迭代对象，如 `Array` 或 `String`
- `return`：返回一个新的 `promise`，第一个完成的 `promise` 的结果状态就是最终的结果状态
  **谁先完成就输出谁(不管是成功还是失败)**

```
const pRace = Promise.race([p1, p2, p3])
// 谁先完成就输出谁(不管是成功还是失败)
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 1000)
})
const p2 = Promise.resolve(2)
const p3 = Promise.reject(3)

pRace.then(
    (value) => {
        console.log('race onResolved()', value)
    },
    (reason) => {
        console.log('race onRejected()', reason)
    }
)
//race onResolved() 2
```

###  Promise.prototype.finally()

`finally()` 方法返回一个`Promise`。在`promise`结束时，无论结果是`resolved`或者是`rejected`，都会执行指定的回调函数。这为在`Promise`是否成功完成后都需要执行的代码提供了一种方式，避免了同样的语句需要在`then()`和`catch()`中各写一次的情况。

`finally`本质上是`then`方法的特例。

```
promise.finally(() => {
    // 语句
})

// 等同于
promise.then(
    (result) => {
        // 语句
        return result
    },
    (error) => {
        // 语句
        throw error
    }
)
```

实例：

```
// resolve 的值是 undefined
Promise.resolve(2).then(
    () => {},
    () => {}
)

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(
    () => {},
    () => {}
)

// reject 的值是 3
Promise.reject(3).finally(() => {})
```

##  Promise 的相关问题

###  如何改变 promise 的状态

1. `resolve(value)`：如果当前是 `pending` 就会变为 `resolved``
2. ``reject(reason)`：如果当前是 `pending` 就会变为 `rejected`
3. 抛出异常：如果当前是 `pending` 就会变为 `rejected`

```
const p = new Promise((resolve, reject) => {
    //resolve(1) // promise变为resolved成功状态
    //reject(2) // promise变为rejected失败状态
    throw new Error('出错了') // 抛出异常，promise变为rejected失败状态，reason为抛出的error
})
p.then(
    (value) => {},
    (reason) => {
        console.log('reason', reason)
    }
)
// reason Error
```

###  一个 promise 指定多个成功/失败回调函数，都会调用吗

当 `promise` **改变**为对应状态时**都会调用**

```
const p = new Promise((resolve, reject) => {
    //resolve(1)
    reject(2)
})
p.then(
    (value) => {},
    (reason) => {
        console.log('reason', reason)
    }
)
p.then(
    (value) => {},
    (reason) => {
        console.log('reason2', reason)
    }
)
// reason 2
// reason2 2
```

### 改变 promise 状态和指定回调函数谁先谁后

> 都有可能，常规是先指定回调再改变状态，但也可以先改状态再指定回调

- 如何先改状态再指定回调

  1. 在执行器中直接调用 `resolve()`/`reject()`

  1. 延迟更长时间才调用 `then()`

	```
  let p = new Promise((resolve, reject) => {
    // setTimeout(() => {
    resolve('OK')
    // }, 1000); // 有异步就先指定回调，否则先改变状态
    })
  
    p.then(
        (value) => {
            console.log(value)
        },
        (reason) => {}
    )
    
  ```
  
- 什么时候才能得到数据？
  
  1. 如果先指定的回调，那当状态发生改变时，回调函数就会调用得到数据
  2. 如果先改变的状态，那当指定回调时，回调函数就会调用得到数据
  
  ```
  new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(1) // 改变状态
      }, 1000)
  }).then(
      // 指定回调函数 （先指定）
      (value) => {},
      (reason) => {}
  )
  ```
  
  此时，先指定回调函数，保存当前指定的回调函数；后改变状态(同时指定数据)，然后异步执行之前保存的回调函数。
  
  ```
  new Promise((resolve, reject) => {
      resolve(1) // 改变状态
  }).then(
      // 指定回调函数
      (value) => {},
      (reason) => {}
  )
  
  这种写法，先改变的状态(同时指定数据)，后指定回调函数(不需要再保存)，直接异步执行回调函数
```


###  promise.then() 返回的新 promise 的结果状态由什么决定

- 简单表达：由 `then()` 指定的回调函数执行的结果决定

```
let p = new Promise((resolve, reject) => {
    resolve('ok')
})
//执行 then 方法
let result = p.then(
    (value) => {
        console.log(value) //ok
    },
    (reason) => {
        console.warn(reason)
    }
)
console.log(result)
// Promise {<pending>}
// [[Prototype]]: Promise
// [[PromiseState]]: "fulfilled"
// [[PromiseResult]]: undefined
```

- 详细表达

1. 如果抛出异常，新 `promise` 变为 `rejected`，`reason` 为抛出的异常

```
  let p = new Promise((resolve, reject) => {
      resolve('ok')
  })
  //执行 then 方法
  let result = p.then(
      (value) => {
          //1. 抛出错误
          throw '出了问题'
      },
      (reason) => {
          console.warn(reason)
      }
  )
  console.log(result)
  	// Promise {<pending>}
          [[Prototype]]: Promise
          [[PromiseState]]: "rejected"
          [[PromiseResult]]: "出了问题
```
2. 如果返回的是非 `promise` 的任意值，新 `promise` 变为 `resolved`，`value` 为返回的值

```
	let p = new Promise((resolve, reject) => {
	    resolve('ok')
	})
	//执行 then 方法
	let result = p.then(
	    (value) => {
	        //2. 返回结果是非 Promise 类型的对象
	        return 521
	    },
	    (reason) => {
	        console.warn(reason)
	    }
	)
	
	console.log(result)
		// Promise {<pending>}
	        [[Prototype]]: Promise
	        [[PromiseState]]: "fulfilled"
	        [[PromiseResult]]: 521
```

3. 如果返回的是另一个新 `promise`，此 `promise` 的结果就会成为新 `promise` 的结果

```
	let p = new Promise((resolve, reject) => {
	    resolve('ok')
	})
	//执行 then 方法
	let result = p.then(
	    (value) => {
	        //3. 返回结果是 Promise 对象
	        return new Promise((resolve, reject) => {
	            // resolve('success');
	            reject('error')
	        })
	    },
	    (reason) => {
	        console.warn(reason)
	    }
	)
	
	console.log(result)
		// Promise {<pending>}
	        [[Prototype]]: Promise
	        [[PromiseState]]: "rejected"
	        [[PromiseResult]]: "error"
```

例：
	
```
	new Promise((resolve, reject) => {
	    resolve(1)
	})
	    .then(
	        (value) => {
	            console.log('onResolved1()', value)
	            //return 2                   // onResolved2() 2
	            //return Promise.resolve(3)  // onResolved2() 3
	            //return Promise.reject(4)   // onRejected2() 4
	            //throw 5                    // onRejected2() 5
	        },
	        (reason) => {
	            console.log('onRejected1()', reason)
	        }
	    )
	    .then(
	        (value) => {
	            console.log('onResolved2()', value)
	        },
	        (reason) => {
	            console.log('onRejected2()', reason)
	        }
	    )
	// onResolved1() 1
	// onResolved2() undefined
	// Promise {<fulfilled>: undefined}
	// 对应输出如上所示
```

​	

### promise 如何串联多个操作任务？

1. `promise` 的 `then()` 返回一个新的 `promise`，可以并成 `then()` 的链式调用
2. 通过 `then` 的链式调用串联多个同步/异步任务

```
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('OK')
    }, 1000)
})

p.then((value) => {
    return new Promise((resolve, reject) => {
    	console.log('value') // OK
        resolve('success')
    })
})
    .then((value) => {
        console.log(value) // success
    })
    .then((value) => {
        console.log(value) // undefined
    })
// OK success undefined
```

例：

```
new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('执行任务1(异步)')
        resolve(1)
    }, 1000)
})
    .then((value) => {
        console.log('任务1的结果', value)
        console.log('执行任务2(同步)')
        return 2 // 同步任务直接return返回结果
    })
    .then((value) => {
        console.log('任务2的结果', value)
        return new Promise((resolve, reject) => {
            // 异步任务需要包裹在Promise对象中
            setTimeout(() => {
                console.log('执行任务3(异步)')
                resolve(3)
            }, 1000)
        })
    })
    .then((value) => {
        console.log('任务3的结果', value)
    })
// 执行任务1(异步)
// 任务1的结果 1
// 执行任务2(同步)
// 任务2的结果 2
// 执行任务3(异步)
// 任务3的结果 3

```

### Promise 异常穿透(传透)

1. 当使用 `promise` 的 `then` 链式调用时，可以在最后指定失败的回调
2. 前面任何操作出了异常，都会传到最后失败的回调中处理

```
new Promise((resolve, reject) => {
    //resolve(1)
    reject(1)
})
    .then((value) => {
        console.log('onResolved1()', value)
        return 2
    })
    .then((value) => {
        console.log('onResolved2()', value)
        return 3
    })
    .then((value) => {
        console.log('onResolved3()', value)
    })
    .catch((reason) => {
        console.log('onRejected1()', reason)
    })
// onRejected1() 1
```

相当于这种写法：多写了很多`reason => {throw reason}`

```
new Promise((resolve, reject) => {
    //resolve(1)
    reject(1)
})
    .then(
        (value) => {
            console.log('onResolved1()', value)
            return 2
        },
        (reason) => {
            throw reason
        } // 抛出失败的结果reason
    )
    .then(
        (value) => {
            console.log('onResolved2()', value)
            return 3
        },
        (reason) => {
            throw reason
        } // 抛出失败的结果reason
    )
    .then(
        (value) => {
            console.log('onResolved3()', value)
        },
        (reason) => {
            throw reason
        } // 抛出失败的结果reason
    )
    .catch((reason) => {
        console.log('onRejected1()', reason)
    })
// onRejected1() 1
```

所以失败的结果是一层一层处理下来的，最后传递到 `catch` 中。

注：将 `reason => {throw reason}` 替换为 `reason => Promise.reject(reason)` 也是一样的

### 中断 promise 链

当使用 `promise` 的 `then` 链式调用时，在中间中断，不再调用后面的回调函数

办法：在回调函数中返回一个 `pending` 状态的 `promise` 对象

```
new Promise((resolve, reject) => {
    //resolve(1)
    reject(1)
})
    .then((value) => {
        console.log('onResolved1()', value)
        return 2
    })
    .then((value) => {
        console.log('onResolved2()', value)
        return 3
    })
    .then((value) => {
        console.log('onResolved3()', value)
    })
    .catch((reason) => {
        console.log('onRejected1()', reason)
    })
    .then(
        (value) => {
            console.log('onResolved4()', value)
        },
        (reason) => {
            console.log('onRejected2()', reason)
        }
    )
// onRejected1() 1
// onResolved4() undefined
```

为了在 `catch` 中就中断执行，可以这样写：

```
new Promise((resolve, reject) => {
    //resolve(1)
    reject(1)
})
    .then((value) => {
        console.log('onResolved1()', value)
        return 2
    })
    .then((value) => {
        console.log('onResolved2()', value)
        return 3
    })
    .then((value) => {
        console.log('onResolved3()', value)
    })
    .catch((reason) => {
        console.log('onRejected1()', reason)
        return new Promise(() => {}) // 返回一个pending的promise
    })
    .then(
        (value) => {
            console.log('onResolved4()', value)
        },
        (reason) => {
            console.log('onRejected2()', reason)
        }
    )
// onRejected1() 1
```

在 `catch` 中返回一个新的 `promise`，且这个 `promise` 没有结果。

由于，返回的新的 `promise` 结果决定了后面 `then` 中的结果，所以后面的 `then` 中也没有结果。

这就实现了中断 `promise链`的效果。
