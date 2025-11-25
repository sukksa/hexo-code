---
title: Class的基本用法
date: 2022-06-25 15:22:19
tags:
 - ES6
 - javaScript
categories: ES6
---

# Class的基本用法 #
Class 可以通过`extends`关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。
<!-- more -->

## extends关键字 ##
Class 可以通过`extends`关键字实现继承

```js
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        toString() {
            return "(" + this.x + ", " + this.y + ")";
        }
    }

    class ColorPoint extends Point {
        constructor(x, y, color) {
            super(x, y); // 调用父类的constructor(x, y)
            this.color = color;
        }

        toString() {
            return this.color + " " + super.toString(); // 调用父类的toString()
        }
    }
```

上面代码定义了一个`ColorPoint`类，该类通过`extends`关键字，继承了`Point`类的所有属性和方法。
`constructor`方法和`toString`方法之中，都出现了`super`关键字，它在这里表示父类的构造函数，用来新建父类的`this`对象。

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。
另一个需要注意的地方是，在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

## Object.getPrototypeOf() ##

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```js
	Object.getPrototypeOf(ColorPoint) === Point
	// true
```

因此，可以使用这个方法判断，一个类是否继承了另一个类。


## super ##

`super`这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

### 作为函数调用 ###
`super`作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次`super`函数。

```js
    class A {}

    class B extends A {
        constructor() {
            super()
        }
    }
```

子类`B`的构造函数之中的`super()`，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错

`super`虽然代表了父类`A`的构造函数，但是返回的是子类B的实例，即s`uper`内部的`this`指的是`B`，因此`super()`在这里相当于`A.prototype.constructor.call(this)`

```js
    class A {
        constructor() {
            console.log(new.target.name);
        }
    }
    class B extends A {
        constructor() {
            super();
        }
    }
    new A(); // A
    new B(); // B
```

`new.target`指向当前正在执行的函数。可以看到，在`super()`执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，`super()`内部的`this`指向的是B。 

作为函数时，`super()`只能用在子类的构造函数之中，用在其他地方就会报错

###作为对象使用 ###
`super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类

```js
    class A {
        p() {
            return 2
        }
    }

    class B extends A {
        constructor() {
            super()
            console.log(super.p()) // 2
        }
    }

    let b = new B()
```

上面代码中，子类B当中的`super.p()`，就是将`super`当作一个对象使用。这时，`super`在普通方法之中，指向`A.prototype`，所以`super.p()`就相当于`A.prototype.p()`。 
这里需要注意，由于`super`指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过`super`调用的，而定义在父类原型对象上的，`super` 就可以直接取到

```js
    class A {
        constructor() {
            this.p = 2
        }
    }
    A.prototype.x = 2

    class B extends A {
        p() {
            return super.p
        }
        x() {
            return super.x
        }
    }

    let b = new B()
    b.p() // undefined
    b.x() // 2
```

ES6 规定，在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。

```js
    class A {
        constructor() {
            this.x = 1
        }
        print() {
            console.log(this.x)
        }
    }

    class B extends A {
        constructor() {
            super()
            this.x = 2
        }
        m() {
            super.print()
        }
    }

    let b = new B()
    b.m() // 2
```

上面代码中，`super.print()`虽然调用的是`A.prototype.print()`，但是`A.prototype.print()`内部的`this`指向子类B的实例，导致输出的是2，而不是1。也就是说，实际上执行的是`super.print.call(this)`。

由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。

```js
    class A {
        constructor() {
            this.x = 1
        }
    }

    class B extends A {
        constructor() {
            super()
            this.x = 2
            super.x = 3
            console.log(super.x) // undefined
            console.log(this.x) // 3
        }
    }

    let b = new B()
```

上面代码中，`super.x`赋值为3，这时等同于对`this.x`赋值为3。而当读取`super.x`的时候，读的是`A.prototype.x`，所以返回`undefined`。

如果`super`作为对象，用在静态方法之中，这时`super`将指向父类，而不是父类的原型对象。

```js
    class Parent {
        static myMethod(msg) {
            console.log('static', msg)
        }

        myMethod(msg) {
            console.log('instance', msg)
        }
    }

    class Child extends Parent {
        static myMethod(msg) {
            super.myMethod(msg)
        }

        myMethod(msg) {
            super.myMethod(msg)
        }
    }

    Child.myMethod(1) // static 1

    let child = new Child()
    child.myMethod(2) // instance 2
```

上面代码中，`super`在静态方法之中指向父类，在普通方法之中指向父类的原型对象。

另外，在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类，而不是子类的实例。

```js
    class A {
        constructor() {
            this.x = 1
        }
        static print() {
            console.log(this.x)
        }
    }

    class B extends A {
        constructor() {
            super()
            this.x = 2
        }
        static m() {
            super.print()
        }
        m() {
            super.print()
        }
    }

    B.x = 3
    B.m() // 3
    new B().m() //TypeError: (intermediate value).print is not a function
```

静态方法`B.m`里面，`super.print`指向父类的静态方法。这个方法里面的`this`指向的是`B`，而不是`B`的实例，而普通方法`B.m()`中，由于`super`指向父类的原型对象`A.prototype`，其中没有` print()`这个方法，所以会报错

最后，由于对象总是继承其他对象的，所以可以在任意一个对象中，使用`super`关键字

```js
    let obj = {
        toString() {
            return "MyObject: " + super.toString()
        },
    }

    obj.toString() // MyObject: [object Object]
```



## 类的 `prototype` 属性和`__proto__`属性 ##

大多数浏览器的 ES5 实现之中，每一个对象都有`__proto__`属性，指向对应的构造函数的`prototype`属性。Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链。

1. 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。

2. 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属 性。

```js
class A {}

class B extends A {}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```


这样的结果是因为，类的继承是按照下面的模式实现的:

```js
	class A {}
	
	class B {}
	
	// B 的实例继承 A 的实例
	Object.setPrototypeOf(B.prototype, A.prototype)
	// 等同于B.prototype.__proto__ = A.prototype
	// B 继承 A 的静态属性
	
	Object.setPrototypeOf(B, A)
	// 等同于B.__proto__ = A

	const b = new B()
```

这两条继承链，可以这样理解: 作为一个对象，子类(B)的原型(`__proto__`属性)是父类(A)；作为一个构造函数，子类(B)的原型对象(`prototype`属性)是父类的原型对象(`prototype`属性)的实例

## 实例的` __proto__` 属性 ##
子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性。也就是说，子类的原型的原型，是父类的原型

```js
    class A {}
    class B extends A {}
    let a = new A()
    let b = new B()

	b.__proto__ === B.prototype //true
	b.__proto__.__proto__ === a.__proto__ //true
```

因此，通过子类实例的`__proto__.__proto__`属性，可以修改父类实例的行为

```js
    b.__proto__.__proto__.fun = function () {
        console.log("fun")
    }

    a.fun() // "fun"
```



## 原生构造函数的继承 ##
原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些。

- `Boolean()`
- `Number()`
- `String()`
- `Array()`
- `Date()`
- `Function()`
- `RegExp()`
- `Error()`
- `Object()`

以前，这些原生构造函数是无法继承的，比如，不能自己定义一个`Array`的子类。

```js
    function MyArray() {
        Array.apply(this, arguments);
    }

    MyArray.prototype = Object.create(Array.prototype, {
        constructor: {
            value: MyArray,
            writable: true,
            configurable: true,
            enumerable: true,
        },
    })
```

上面代码定义了一个继承 `Array` 的`MyArray`类。但是，这个类的行为与`Array`完全不一致。

```js
	let colors = new MyArray()
    colors[0] = 'red'
    colors.length // 0

    colors.length = 0
    colors[0] // "red"
```

之所以会发生这种情况，是因为子类无法获得原生构造函数的内部属性，通过`Array.apply()`或者分配给原型对象都不行。原生构造函数会忽略`apply`方法传入的`this`，也就是说，原生构造函数的`this`无法绑定，导致拿不到内部属性。 

ES5 是先新建子类的实例对象`this`，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。比如，`Array`构造函数有一个内部属性`[[DefineOwnProperty]]`，用来定义新属性时，更新`length`属性，这个内部属性无法在子类获取，导致子类的`length`属性行为不正常。 

下面的例子中，我们想让一个普通对象继承`Error`对象。

```js
	let e = {}
	
	Object.getOwnPropertyNames(Error.call(e))
	// [ 'stack' ]
	
	Object.getOwnPropertyNames(e)
	// []
```

上面代码中，我们想通过`Error.call(e)`这种写法，让普通对象e具有`Error`对象的实例属性。但是，`Error.call()`完全忽略传入的第一个参数，而是返回一个新对象，`e`本身没有任何变化。这证明了`Error.call(e)`这种写法，无法继承原生构造函数。

ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象`this`，然后再用子类的构造函数修饰`this`，使得父类的所有行为都可以继承。

下面是ES6中一个继承`Array`的例子。

```js
    class MyArray extends Array {
        constructor(...args) {
            super(...args)
        }
    }

    let arr = new MyArray();
    arr[0] = 12
    arr.length // 1

    arr.length = 0
    arr[0] // undefined
```

上面代码定义了一个`MyArray`类，继承了`Array`构造函数，因此就可以从`MyArray`生成数组的实例。这意味着，ES6 可以自定义原生数据结构(比如`Array`、`String`等)的子类，这是 ES5 无法做到的。 

上面这个例子也说明，`extends`关键字不仅可以用来继承类，还可以用来继承原生的构造函数。因此可以在原生数据结构的基础上，定义自己的数据结构。

下面就是定义了一个带版本功能的数组。

```js
    class VersionedArray extends Array {
        constructor() {
            super()
            this.history = [[]]
        }
        commit() {
            this.history.push(this.slice())
        }
        revert() {
            this.splice(0, this.length, ...this.history[this.history.length - 1])
        }
    }

    let x = new VersionedArray()

    x.push(1)
    x.push(2)
    x // [1, 2]
    x.history // [[]]

    x.commit()
    x.history // [[], [1, 2]]

    x.push(3)
    x // [1, 2, 3]
    x.history // [[], [1, 2]]

    x.revert()
    x // [1, 2]
```

上面代码中，`VersionedArray`会通过`commit`方法，将自己的当前状态生成一个版本快照，存入`history`属性。`revert`方法用来将数组重置为最新一次保存的版本。除此之外，`VersionedArray`依然是一个普通数组，所有原生的数组方法都可以在它上面调用。