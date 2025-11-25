---
title: node
date: 2021-11-18 19:18:41
tags:
 - node
categories: node
---


## node简介 ##
Node是对ES标准一个实现，Node也是一个JS引擎，通过Node可以使js代码在服务器端执行，Node仅仅对ES标准进行了实现，所以在Node中不包含DOM 和 BOM
<!-- more -->
## node的模块化

在Node中，一个js文件就是一个模块

每一个js文件中的js代码都是独立运行在一个函数中而不是全局作用域，所以一个模块的中的变量和函数在其他模块中无法访问

### CommonJS

模块就是一个js文件，在模块内部任何变量或其他对象都是私有的，不会暴露给外部模块。

在CommonJS模块化规范中，在模块内部定义了一个`module`对象，`module`对象内部存储了当前模块的基本信息，同时`module`对象中有一个属性名为`exports`，`exports`用来指定需要向外部暴露的内容。只需要将需要暴露的内容设置为`exports`或`exports`的属性，其他模块即可通过`require`来获取这些暴露的内容。

#### 加载模块

使用 `require()` 方法，可以加载需要的内置模块、用户自定义模块、第三方模块进行使用。

**注意**：使用 `require()` 方法加载其它模块时，会执行被加载模块中的代码。

```
// 加载内置 fs 模块
const fs = require('fs')

// 加载自定义模块
const m = require('./myModule.js')

// 加载第三方模块
const moment = require('moment')

// 通过解构赋值按需加载模块
const { a, b } = require('./myModule.js')
```

#### module 对象

在每个 .js 自定义模块中都有一个 module 对象，它里面存储了和当前模块有关的信息，打印如下

```js
console.log(module)

// output
Module {
  id: '.',
  path: 'D:\\study\\nodejs\\moudle',
  exports: {},
  parent: null,
  filename: 'D:\\study\\nodejs\\moudle\\myMoudle.js',
  loaded: false,
  children: [],
  paths: [
    'D:\\study\\nodejs\\moudle\\node_modules',
    'D:\\study\\nodejs\\node_modules',
    'D:\\study\\node_modules',
    'D:\\node_modules'
  ]
}
```

#### module.exports对象

在自定义模块中，可以使用 `module.exports` 对象，将模块内的成员共享出去，供外界使用。

外界用 `require()` 方法 导入自定义模块时，得到的就是 `module.exports` 所指向的对象。

```js
const a = 10
const b = 20
const obj = { name: "孙悟空" }

module.exports.a = a
module.exports.b = b

// const {a, b} = require("./m.js")
```

```js
const a = 10
const b = 20
const obj = { name: "孙悟空" }

module.exports = { a, b, obj}

// const {a, b, obj} = require("./m.js")
```

默认情况下，Node.js会将以下内容视为CommonJS模块：

1. 使用`.cjs`为扩展名的文件
2. 当前的`package.json`的`type`属性为`commonjs`时，扩展名为`.js`的文件
3. 当前的`package.json`不包含`type`属性时，扩展名为`.js`的文件
4. 文件的扩展名是`mjs、cjs、json、node、js`以外的值时（`type`不是`module`时）

#### exports 对象

由于 `module.exports` 单词写起来比较复杂，为了简化向外共享成员的代码，Node 提供了 `exports` 对象。

 默认情况 下 ， `exports` 和 `module.exports` 指向同一个对象 。最终共享的结果，还是以 `module.exports` 指向的对象为准

```js
console.log(module.exports === exports) // true
```

```
const a = 10
const b = 20
const obj = { name: "孙悟空" }

exports.a = a
exports.b = b

// const {a, b} = require("./m.js")
```

#### exports 和 module.exports 的使用误区

时刻谨记，`require()` 模块时，得到的永远是 `module.exports` 指向的对象

```js
exports.obj = { name: '孙悟空' }

module.exports = {
  a: 10,
  b: 20,
}

// const m = require("./m.js")
// console.log(m) // { a: 10, b: 20 }
```

 **注意：**为了防止混乱，建议不要在同一个模块中同时使用 `exports` 和 `module.exports`

#### 文件作为模块

当我们加载一个自定义的文件模块时，模块的路径必须以`/、./`或`../`开头。如果不以这些开头，node会认为你要加载的是核心模块或`node_modules`中的模块。

当我们要加载的模块是一个文件模块时，CommonJS规范会先去寻找该文件，比如：`require("./m1")`时，会首先寻找名为m1的文件。如果这个文件没有找到，它会自动为文件添加扩展名然后再查询。扩展名的顺序为：`js、json、node`。

还是上边的例子，如果没有找到m1，则会按照顺序搜索`m1.js、m1.json、m1.node`哪个先找到则返回哪个，如果都没有找到则报错。

#### 文件夹作为模块

当我们使用一个文件夹作为模块时，文件夹中必须有一个模块的主文件。如果文件夹中含有`package.json`文件且文件中设置`main`属性，则`main`属性指定的文件会成为主文件，导入模块时就是导入该文件。如果没有`package.json`，则node会按照`index.js`、`index.node`的顺序寻找主文件。

#### Node_modules

如果我们加载的模块没有以`/、./`或`../`开头，且要加载的模块不是核心模块，node会自动去node_modules目录下去加载模块。

node会先去当前目录下的node_modules下去寻找模块，找到则使用，没找到则继续去上一层目录中寻找，以此类推，知道找到根目录下的node_modules为止。

比如，当前项目的目录为：`'C:\Users\lilichao\Desktop\Node-Course\myProject\node_modules'`，则模块查找顺序依次为：

```
‘C:\Users\lilichao\Desktop\Node-Course\node_modules’,
‘C:\Users\lilichao\Desktop\node_modules’,
‘C:\Users\lilichao\node_modules’,
‘C:\Users\node_modules’,
‘C:\node_modules’
```

#### 模块的包装

每一个CommonJS模块在执行时，外层都会被套上一个函数：

```js
(function(exports, require, module, __filename, __dirname) {
	// 模块代码会被放到这里
})
```

所以我们之所以能在CommonJS模块中使用`exports`、`require`并不是因为它们是全局变量。它们实际上以参数的形式传递进模块的。

`exports`，用来设置模块向外部暴露的内容

`require`，用来引入模块的方法

`module`，当前模块的引用

`__filename`，模块的路径

`__dirname`，模块所在目录的路径

### ES模块化

2015年随着ES6标准的发布，ES的内置模块化系统也应运而生，并且在Node.js中同样也支持ES标准的模块化。

需要注意的是，Node.js默认并不支持ES模块化，如果需要使用可以采用两种方式。

方式一，直接将所有的`js`文件修改为`mjs`扩展名。

方式二，修改`package.json`中type属性为`module`。

#### 导出

```js
// 导出变量（命名导出）
export let name1, name2, …, nameN; 
export let name1 = …, name2 = …, …, nameN; 

// 导出函数（命名导出）
export function functionName(){...}

// 导出类（命名导出）
export class ClassName {...}

// 导出一组
export { name1, name2, …, nameN }

// 重命名导出
export { variable1 as name1, variable2 as name2, …, nameN }

// 解构赋值后导出
export const { name1, name2: bar } = o

// 默认导出
export default expression
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// 聚合模块
export * from …; // 将其他模块中的全部内容导出（除了default）
export * as name1 from …; // ECMAScript® 2O20 将其他模块中的全部内容以指定别名导出
export { name1, name2, …, nameN } from …; // 将其他模块中的指定内容导出
export { import1 as name1, import2 as name2, …, nameN } from …; // 将其他模块中的指定内容重命名导出
export { default, … } from …; 
```

#### 引入

```
// 引入默认导出
import defaultExport from "module-name"

// 将所有模块导入到指定命名空间中
import * as name from "module-name"

// 引入模块中的指定内容
import { export1 } from "module-name"
import { export1 , export2 } from "module-name"

// 以指定别名引入模块中的指定内容
import { export1 as alias1 } from "module-name"
import { export1 , export2 as alias2 , [...] } from "module-name"

// 引入默认和其他内容
import defaultExport, { export1 [ , [...] ] } from "module-name"
import defaultExport, * as name from "module-name"

// 引入模块
import "module-name"
```

