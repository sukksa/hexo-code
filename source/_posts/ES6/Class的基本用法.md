---
title: Class的基本用法
date: 2022-06-24 15:11:40
tags:
 - ES6
 - javaScript
categories: ES6
---

# Class的基本用法 #

ES6 提供了更接近传统语言的写法，引入了 Class(类)这个概念，作为对象的模板。通过class关键字，可以定义类。 
基本上，ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
<!-- more -->

## 简介 ##
JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子。

	    function Obj(x, y) {
            this.x = x
            this.y = y
        }

        Obj.prototype.add = function () {
            return this.x + this.y
        }

        let num = new Obj(1, 2)

上面的代码用 ES6 的class改写，就是下面这样

        class Obj {
            constructor(x, y){
                this.x = x
                this.y = y
            }
            add() {
                return this.x + this.y
            }
        } 

上面代码定义了一个“类”，可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象

`obj` 类除了构造方法，还定义了一个 `add()` 方法。注意，定义“类”的方法的时候，前面不需要加上`function`这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。

ES6 的类，完全可以看作构造函数的另一种写法,类的数据类型就是函数，类本身就指向构造函数。

		class Obj {
		  // ...
		}
		
		typeof Obj // "function"
		Obj === Obj.prototype.constructor // true

构造函数的 `prototype` 属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的 `prototype` 属性上面

        class Obj {
			constructor(){	}
	        add() {	}
        } 
		//等同于
		Obj.prototype = {
			constructor(){	},
            add() {	}
		}
因此在类的实例上调用方法。相当于调用原型上的方法。

## constructor方法 ##
`constructor`方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加

		class Obj {}
		
		// 等同于
		class Obj {
		  constructor() {}
		}
上面代码中，定义了一个空的类 `Obj`，JavaScript 引擎会自动为它添加一个空的`constructor`方法。 `constructor`方法默认返回实例对象(即`this`)，完全可以指定返回另外一个对象

        class Foo {
            constructor(){
                return {}
            }
        }
        new Foo() instanceof Foo  // flase

`constructor` 函数返回一个全新的对象，结果导致实例对象不是Foo类的实例

**注**：类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，构造函数不用`new`也可以执行。

## new操作符 ##
众所周知，在JS中，new的作用是通过构造函数来创建一个实例对象

实际上，`new` 操作符帮我们做了这些事
1. 帮我们创建了一个空对象，例如：obj；
2. 将空对象原型的内存地址__proto__指向函数的原型对象；
3. 利用函数的call方法，将原本指向window的绑定对象this指向了obj。（这样一来，当我们向函数中再传递实参时，对象的属性就会被挂载到obj上。）
4. 利用函数返回对象obj。


	    function Foo(name) {
            this.name = name
        }
        let foo = new Foo("aaa")

		//等价于
	    function Foo(name) {
            this.name = name
            return this 			   //4
        }
        let obj = {} 				  //1
        obj.__proto__ = Foo.prototype  //2
        // Foo.call(obj, 'aaa')
        let foo = Foo.call(obj, 'aaa') //3
**注**：类的构造函数与普通构造函数之间的区别是，调用构造函数必须使用`new` 操作符。而普通构造函数如果不使用 `new` 调用，name就会以全局的 `this` （通常是 `window`）作为内部对象。调用类构造函数时如果忘记使用 `new` 则会报错。
 
## 类的实例对象 ##
与 ES5 一样，实例的属性除非显式定义在其本身(即定义在this对象上)，否则都是定义在原型上(即定义在class上)。 

		//定义类
		class Point {
		  constructor(x, y) {
		    this.x = x
		    this.y = y
		  }
		
		  toString() {
		    return "(" + this.x + ", " + this.y + ")"
		  }
		}
		
		let point = new Point(2, 3)
		
		point.toString() // (2, 3)
		
		point.hasOwnProperty("x") // true
		point.hasOwnProperty("y") // true
		point.hasOwnProperty("toString") // false
		point.__proto__.hasOwnProperty("toString") // true

上面代码中，`x`和`y`都是实例对象`point`自身的属性(因为定义在`this`变量上)，所以`hasOwnProperty`方法返回`true`，而`toString`是原型对象的属性(因为定义在`Point`类上)，所以`hasOwnProperty`方法返回`false`。这些都与 ES5 的行为保持一致。

与 ES5 一样，类的所有实例共享一个原型对象。

		let p1 = new Point(2, 3)
		let p2 = new Point(3, 2)
		
		p1.__proto__ === p2.__proto__	//true

上面代码中，`p1`和`p2`都是`Point`的实例，它们的原型都是P`oint.prototype`，所以`__proto__`属性是相等的。

这也意味着，可以通过实例的`__proto__`属性为“类”添加方法。

> __proto__ 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 `Object.getPrototypeOf` 方法来获取实例对象的原型，然后再来为原型添加方法/属性。

## Class表达式 ##

与函数一样，类也可以使用表达式的形式定义

		const MyClass = class Me {
		  getClassName() {
		    return Me.name
		  }
		}

上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是`MyClass`而不是`Me`，`Me`只在 Class 的内部代码可用，指代当前类。如果类的内部没用到的话，可以省略 `Me`

		let inst = new MyClass()
		inst.getClassName() // Me
		Me.name // ReferenceError: Me is not defined

采用 Class 表达式，可以写出立即执行的 Class。

		let person = new (class {
		  constructor(name) {
		    this.name = name
		  }
		
		  sayName() {
		    console.log(this.name)
		  }
		})("张三")
		
		person.sayName() // "张三"


## Class 的取值函数(getter)和存值函数(setter) ##
与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

        class MyClass {
            constructor() {
                // ...
            }
            get prop() {
                return "getter"
            }
            set prop(value) {
                console.log("setter: " + value)
            }
        }

        let inst = new MyClass()

        inst.prop = 123  // setter: 123

        inst.prop  // 'getter'

上面代码中，`prop`属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

存值函数和取值函数是设置在属性的 `Descriptor` 对象上的

		class CustomHTMLElement {
		  constructor(element) {
		    this.element = element
		  }
		
		  get html() {
		    return this.element.innerHTML
		  }
		
		  set html(value) {
		    this.element.innerHTML = value
		  }
		}
		
		let descriptor = Object.getOwnPropertyDescriptor(
		  CustomHTMLElement.prototype,
		  "html"
		);
		
		"get" in descriptor // true
		"set" in descriptor // true
上面代码中，存值函数和取值函数是定义在`html`属性的描述对象上面，这与 ES5 完全一致

## Class 的 Generator 方法 ##

如果某个方法之前加上星号(*)，就表示该方法是一个 Generator 函数。 

		class Foo {
		  constructor(...args) {
		    this.args = args;
		  }
		  *[Symbol.iterator]() {
		    for (let arg of this.args) {
		      yield arg;
		    }
		  }
		}
		
		for (let x of new Foo("hello", "world")) {
		  console.log(x);
		}
		// hello
		// world

上面代码中，`Foo`类的`Symbol.iterator`方法前有一个星号，表示该方法是一个 `Generator` 函数。
`Symbol.iterator`方法返回一个`Foo`类的默认遍历器，`for...of`循环会自动调用这个遍历器

## Class 的静态方法 ##
类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

		class Foo {
			static classMethod() {
				return "hello"
			}
		}
		
		Foo.classMethod() // 'hello'
		
		let foo = new Foo()
		foo.classMethod() // TypeError: foo.classMethod is not a function

`Foo`类的`classMethod`方法前有`static`关键字，表明该方法是一个静态方法，可以直接在`Foo`类上调用`Foo.classMethod()`，而不是在`Foo`类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法

注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。

        class Foo {
            static bar() {
                this.baz()
            }
            static baz() {
                console.log("hello")
            }
            baz() {
                console.log("world")
            }
        }

        Foo.bar() // hello

静态方法`bar`调用了`this.baz`，这里的`this`指的是`Foo`类，而不是`Foo`的实例，等同于调用`Foo.baz`。另外，从这个例子还可以看出，静态方法可以与非静态方法重名

父类的静态方法，可以被子类继承

        class Foo {
            static classMethod() {
                return "hello"
            }
        }

        class Bar extends Foo {}

        Bar.classMethod(); // 'hello'

并且，静态方法也是可以从`super`对象上调用的。

        class Foo {
            static classMethod() {
                return "hello"
            }
        }

        class Bar extends Foo {
            static classMethod() {
                return super.classMethod() + ", too"
            }
        }

        Bar.classMethod() // "hello, too"

## Class 的静态属性 ##
类的静态属性只要在上面的实例属性写法前面，加上static关键字就可以了。 

        class MyClass {
            static myStaticProp = 'aa'

            constructor() {
                console.log(MyClass.myStaticProp) // 'aa'
            }
        }