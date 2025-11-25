---
title: let与const
date: 2021-10-30 18:02:40
tags:
 - ES6
 - javaScript
categories: ES6
---

# let与conset #

在ES6中引入了变量声明的两种方式，let 与 conset 
- let 用来声明变量
- conset 用来声明常量
<!-- more -->

## let命令 ##

### 基本用法 ###
ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。

	    {
            let a = 10
            var b = 1
        }

        a // ReferenceError: a is not defined.
        b // 1

上面代码在代码块之中，分别用let和var声明了两个变量。然后在代码块之外调用这两个变量，结果let声明的变量报错，var声明的变量返回了正确的值。这表明，let声明的变量只在它所在的代码块有效。

例：通过定时器每秒打印0-4

        for(var i = 0; i < 5; i++){
            setTimeout(function(){
                alert(i)
            },1000)
        }
		// 5 5 5 5 5 
因为ES5之前没有块级作用域的概念，所以循环定时器、回调函数执行时的 i 定义在`window`中，当回调函数执行时，会向上级作用域中寻找到`window.i `此时 `i === 5`，故

        for(let i = 0; i < 5; i++){
            setTimeout(function(){
                alert(i)
            },1000)
        }
		// 0 1 2 3 4
在块级作用域中，使用`let`定义 i , 相当于在每个块级作用域中定义了一个i，回调函数不必在全局作用域中寻找i的值

            for (let i = 0; i < 5; i++) {
                setTimeout(function () {
                    alert(i)
                }, 1000)
            } 
            {
                let i = 0
                setTimeout(function () {
                    alert(i)
                }, 1000)
            } 
            {
                let i = 1
                setTimeout(function () {
                    alert(i)
                }, 1000)
            }

### 不存在变量提升 ###
var命令会发生”变量提升“现象，即变量可以在声明之前使用，值为undefined。
而let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

        // var 的情况
        console.log(foo) // 输出undefined
        var foo = 2

        // let 的情况
        console.log(bar) // 报错ReferenceError
        let bar = 2

### 不允许重复声明 ###
`let` 不允许在相同作用域内，重复声明同一个变量。`var`可以
    
	    // 报错
        function fun1() {
            let a = 10
            var a = 1
        }

        // 报错
        function fuc2() {
            let a = 10
            let a = 1
        }
	
		// 正常
        function fu() {
            var a = 10
            var a = 1
        }

## conset命令 ##
### 基本用法 ###
`const` 声明一个只读的常量。一旦声明，常量的值就不能改变，一般用 `conset` 声明的常量用大写表示


		const PI = 3.1415
		PI // 3.1415
		
		PI = 3
		// TypeError: Assignment to constant variable.

const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值
 
		const ITEM
		// SyntaxError: Missing initializer in const declaration

const的作用域与let命令相同: 只在声明所在的块级作用域内有效。
 
		if (true) {
		  const MAX = 5
		}
		console.log(MAX) //ReferenceError: MAX is not defined

### conset的本质 ###
- const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动

- 对于**简单类型的数据**(数值、字符串、布尔值)，值就保存在变量指向的那个内存地址，因此等同于常量

- 对于**复合类型的数据**(主要是对象和数组)，变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的(即总是指向另一个固定的地址)，至于它指向的数据结构是不是可变的，就完全不能控制了

        const ARR = ["1", "2", "3", "4"]
        ARR.push("5")
        console.log(ARR) //['1', '2', '3', '4', '5']

        ARR = ["a", "b", "c"] //TypeError: Assignment to constant variable.
对于数组和对象的元素修改, 不算做对常量的修改, 不会报错，因为conset 只能**确保对象所指向的地址不能改变**，而地址的内容就无法保证了

## 块级作用域 ##
### 为什么需要块级作用域 ###
ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

- 第一种场景，内层变量可能会覆盖外层变量。

        var tmp = new Date()

        function fun() {
            console.log(tmp)
            if (false) {
                var tmp = "hello world"
            }
        }

        fun(); // undefined
	上面代码的原意是，if代码块的外部使用外层的 `tmp` 变量，内部使用内层的 `tmp` 变量。但是，函数`fun()`执行后，输出结果为 `undefined`，原因在于变量提升，导致内层的 `tmp` 变量覆盖了外层的 `tmp` 变量。 

- 第二种场景，用来计数的循环变量泄露为全局变量。

		for(var i = 0; i < 5; i++){
            setTimeout(function(){
                alert(i)
            },1000)
        }
		// 5 5 5 5 5 	

	上面代码中i定义为全局变量，导致回调函数执行时，使用的是全局作用域中的 i


### ES6 的块级作用域 ###
用let命令新增了块级作用域，外层作用域无法获取到内层作用域，内层作用域能获取到外层作用域声明的变量


     	{
            let a = "aa" 
            {
                console.log(a) // aa
            }
        }

        {
            console.log(b)  // ReferrenceError
            {
                let b = "bb" 
            }
        }
同时内层作用域可以定义外层作用域的同名变量

      {
        let a = "Hello World"
        {
          let a = "Hello World"
        }
      }

### 块级作用域与函数声明 ###

运行环境：ES6浏览器。

可实现的行为：
1. 允许在块级作用域内声明函数
2. 函数声明类似于var， 即会提升到全局作用域或函数作用域的头部
3. 函数声明还会提升到所有块级作用域的头部

        function func() {
            console.log('outside')
        }
        (function () {
            // var Func = undefined;
            if (false) {
                function func() {
                    console.log('inside')
                }
            }
            func() //Uncaught TypeError: func is not a function
        })() //报错

考虑到环境导致的差异太大，应该避免在块级作用域中声明函数，如果需要，应该写成函数表达式的形式，而不是函数声明语句

ES6的块级作用域允许声明函数的规则只在使用大括号的情况下成立：

        'use strict'
        if (true) {
            function Func1() {} // 不报错  
        }
        if (true)
            function Func2() {} // 报错
			// In strict mode code, functions can only be declared 
				 at top level or inside a block.