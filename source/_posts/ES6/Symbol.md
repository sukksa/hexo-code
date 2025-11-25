---
title: Symbol
date: 2021-11-11 14:08:35
tags:
 - ES6
 - javaScript
categories: ES6
---

# Symbol #

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。如在对象中添加一个方法，这个方法名有可能导致重名，引起冲突

ES6 引入了一种新的原始数据类型 `Symbol`，表示独一无二的值。它是 JavaScript 语言的第七种数据类型

对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 `Symbol` 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突
<!-- more -->

## 基本使用 ##

声明方式:

        let s = Symbol()
        console.log(s, typeof s) // Symbol() 'symbol'

`Symbol` 函数前不能使用 `new` 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 `Symbol` 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型

`Symbol`函数可以接受一个字符串作为参数，表示对 `Symbol` 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分

        let s1 = Symbol("s1");
        let s2 = Symbol("s2");

        console.log(s1) // Symbol(s1)
        console.log(s2) // Symbol(s2)

        console.log(s1.toString()) // "Symbol(s1)"
        console.log(s2.toString()) // "Symbol(s2)"

如果 `Symbol` 的参数是一个对象，就会调用该对象的`toString()`方法，将其转为字符串，然后才生成一个 `Symbol` 值

        const obj = {
            name: "obj",
            toString: function() {
                return this.name
            }
        }

        let s = Symbol(obj)
        console.log(s) //Symbol(obj)

注，`Symbol`函数的参数只是表示对当前 `Symbol` 值的描述，因此相同参数的`Symbol`函数的返回值是不相等的

		// 没有参数的情况
		let s1 = Symbol()
		let s2 = Symbol()
		
		s1 === s2 // false
		
		// 有参数的情况
		let s1 = Symbol("s")
		let s2 = Symbol("s")
		
		s1 === s2 // false

`Symbol` 值不能与其他类型的值进行运算和比较，会报错

        let s = Symbol("s")
        let result = s + 100
		// TypeError: Cannot convert a Symbol value to a number


## Symbol.for() ##

有时，我们希望重新使用同一个 Symbol 值，`Symbol.for()`方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 `Symbol` 值。如果有，就返回这个 `Symbol` 值，否则就新建并返回一个以该字符串为名称的 `Symbol` 值

		Symbol.for("foo") // 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
		Symbol.for("foo") // 从 symbol 注册表中读取键为"foo"的 symbol
		Symbol.for("foo") === Symbol.for("foo") // true

		Symbol("bar") === Symbol("bar") // false，Symbol() 函数每次都会返回新的一个 symbol
		
		var sym = Symbol.for("mario")
		sym.toString()
		// "Symbol(mario)"，mario 既是该 symbol 在 symbol 注册表中的键名，又是该 symbol 自身的描述字符串

`Symbol.for()`与`Symbol()`这两种写法，都会生成新的 `Symbol`。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。`Symbol.for()`不会每次调用就返回一个新的 `Symbol` 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值


## Symbol.keyFor() ##

`Symbol.keyFor()`方法返回一个已登记的 `Symbol` 类型值的 key

		let s1 = Symbol.for("foo")
		Symbol.keyFor(s1) // "foo"
		
		let s2 = Symbol("foo")
		Symbol.keyFor(s2) // undefined
变量`s2`属于未登记的 `Symbol` 值，所以返回`undefined`

需要注意的是，`Symbol.for()`为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值

		iframe = document.createElement("iframe")
		iframe.src = String(window.location)
		document.body.appendChild(iframe)
		
		iframe.contentWindow.Symbol.for("foo") === Symbol.for("foo")	// true

## 内置的 Symbol 值 ##
除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法

### Symbol.hasInstance ###
对象的`Symbol.hasInstance`属性，指向一个内部方法。当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo`在语言内部，实际调用的是`Foo[Symbol.hasInstance](foo)`

        class MyClass {
            [Symbol.hasInstance](foo) {
                return foo instanceof Array;
            }
        }

        [1, 2, 3] instanceof new MyClass(); // true
上面代码中，`MyClass`是一个类，`new MyClass()`会返回一个实例。该实例的`Symbol.hasInstance()`方法，会在进行`instanceof`运算时自动调用，判断左侧的运算子是否为`Array`的实例

### Symbol.isConcatSpreadable ###
对象的`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象用于`Array.prototype.concat()`时，是否可以展开


        let arr1 = ["c", "d"];
        ["a", "b"].concat(arr1, "e"); // ['a', 'b', 'c', 'd', 'e']
        arr1[Symbol.isConcatSpreadable]; // undefined

        let arr2 = ["c", "d"];
        arr2[Symbol.isConcatSpreadable] = false;
        ["a", "b"].concat(arr2, "e"); // ['a', 'b', ['c','d'], 'e']

上面代码说明，数组的默认行为是可以展开，`Symbol.isConcatSpreadable`默认等于`undefined`。该属性等于`true`时，也有展开的效果

类似数组的对象正好相反，默认不展开。它的`Symbol.isConcatSpreadable`属性设为`true`，才可以展开

        let obj = {
            length: 2,
            0: "c",
            1: "d"
        };
        ["a", "b"].concat(obj, "e"); // ['a', 'b', obj, 'e']

        obj[Symbol.isConcatSpreadable] = true;
        ["a", "b"].concat(obj, "e"); // ['a', 'b', 'c', 'd', 'e']

### Symbol.species ###

对象的`Symbol.species`属性，指向一个构造函数。创建衍生对象时，会使用该属性

        class MyArray extends Array {}

        const a = new MyArray(1, 2, 3);
        const b = a.map((x) => x);
        const c = a.filter((x) => x > 1);

        b instanceof MyArray; // true
        c instanceof MyArray; // true

上面代码中，子类`MyArray`继承了父类`Array`，a是`MyArray`的实例，b和c是a的衍生对象。您可能会认为，b和c都是调用数组方法生成的，所以应该是数组(`Array`的实例)，但实际上它们也是`MyArray`的实例

### Symbol.match ###
对象的`Symbol.match`属性，指向一个函数。当执行`str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值

        String.prototype.match(regexp);
        // 等同于
        regexp[Symbol.match](this);

        class MyMatcher {
            [Symbol.match](string) {
                return "hello world".indexOf(string);
            }
        }

        "e".match(new MyMatcher()); // 1

### Symbol.replace ###

对象的`Symbol.replace`属性，指向一个方法，当该对象被`String.prototype.replace`方法调用时，会返回该方法的返回值

        String.prototype.replace(searchValue, replaceValue);
        // 等同于
        searchValue[Symbol.replace](this, replaceValue);

例：

        const x = {};
        x[Symbol.replace] = (...s) => console.log(s);

        "Hello".replace(x, "World"); // ["Hello", "World"]

`Symbol.replace`方法会收到两个参数，第一个参数是`replace`方法正在作用的对象，上面例子是`Hello`，第二个参数是替换后的值，上面例子是`World`

### Symbol.search ###
对象的`Symbol.search`属性，指向一个方法，当该对象被`String.prototype.search`方法调用时，会返回该方法的返回值

        String.prototype.search(regexp);
        // 等同于
        regexp[Symbol.search](this);

        class MySearch {
            constructor(value) {
                    this.value = value;
                }
                [Symbol.search](string) {
                    return string.indexOf(this.value);
                }
        }
        "foobar".search(new MySearch("foo")); // 0

### Symbol.split ###
对象的`Symbol.split`属性，指向一个方法，当该对象被`String.prototype.split`方法调用时，会返回该方法的返回值

		String.prototype.split(separator, limit);
		
		separator[Symbol.split](this, limit);

例：

        class MySplitter {
            constructor(value) {
                    this.value = value;
                }
                [Symbol.split](string) {
                    let index = string.indexOf(this.value);
                    if (index === -1) {
                        return string;
                    }
                    return [string.substr(0, index), string.substr(index + this.value.length)];
                }
        }

        "foobar".split(new MySplitter("foo"));
        // ['', 'bar']

        "foobar".split(new MySplitter("bar"));
        // ['foo', '']

        "foobar".split(new MySplitter("baz"));
        // 'foobar'
上面方法使用`Symbol.split`方法，重新定义了字符串对象的split方法的行为

### Symbol.iterator ###
对象的`Symbol.iterator`属性，指向该对象的默认遍历器方法

        const myIterable = {};
        myIterable[Symbol.iterator] = function * () {
            yield 1;
            yield 2;
            yield 3;
        };

        [...myIterable]; // [1, 2, 3]

对象进行`for...of`循环时，会调用`Symbol.iterator`方法，返回该对象的默认遍历器

        class Collection {
            *[Symbol.iterator]() {
                let i = 0;
                while (this[i] !== undefined) {
                    yield this[i];
                    ++i;
                }
            }
        }

        let myCollection = new Collection();
        myCollection[0] = 1;
        myCollection[1] = 2;

        for (let value of myCollection) {
            console.log(value);
        }
        // 1
        // 2

### Symbol.toPrimitive ###

对象的`Symbol.toPrimitive`属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
 `Symbol.toPrimitive`被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。 
- Number: 该场合需要转成数值 
- String: 该场合需要转成字符串 
- Default: 该场合可以转成数值，也可以转成字符串


        let obj = {
            [Symbol.toPrimitive](hint) {
                switch (hint) {
                    case "number":
                        return 123;
                    case "string":
                        return "str";
                    case "default":
                        return "default";
                    default:
                        throw new Error();
                }
            },
        };

        2 * obj; // 246
        3 + obj; // '3default'
        obj == "default"; // true
        String(obj); // 'str'

### Symbol.toStringTag ###
对象的`Symbol.toStringTag`属性，指向一个方法。在该对象上面调用`Object.prototype.toString`方法时，如果这个属性存在，它的返回值会出现在`toString()`方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制`[object Object]`或`[object Array]`中`object`后面的那个字符串

        // 例一
        ({
            [Symbol.toStringTag]: "Foo"
        }.toString());
        // "[object Foo]"

        // 例二
        class Collection {
            get[Symbol.toStringTag]() {
                return "xxx";
            }
        }
        let x = new Collection();
        Object.prototype.toString.call(x); // "[object xxx]"

ES6 新增内置对象的`Symbol.toStringTag`属性值如下。 
- `JSON[Symbol.toStringTag]`: 'JSON' 
- `Math[Symbol.toStringTag]`: 'Math' 
- Module 对象 `M[Symbol.toStringTag]`: 'Module' 
- `ArrayBuffer.prototype[Symbol.toStringTag]`: 'ArrayBuffer' 
- `DataView.prototype[Symbol.toStringTag]`: 'DataView' 
- `Map.prototype[Symbol.toStringTag]`: 'Map' 
- `Promise.prototype[Symbol.toStringTag]`: 'Promise' 
- `Set.prototype[Symbol.toStringTag]`: 'Set' 
- `%TypedArray%.prototype[Symbol.toStringTag]`: 'Uint8Array'等 
- `WeakMap.prototype[Symbol.toStringTag]`: 'WeakMap' 
- `WeakSet.prototype[Symbol.toStringTag]`: 'WeakSet' 
- `%MapIteratorPrototype%[Symbol.toStringTag]`: 'Map Iterator' 
- `%SetIteratorPrototype%[Symbol.toStringTag]`: 'Set Iterator' 
- `%StringIteratorPrototype%[Symbol.toStringTag]`: 'String Iterator' 
- `Symbol.prototype[Symbol.toStringTag]`: 'Symbol' 
- `Generator.prototype[Symbol.toStringTag]`: 'Generator' 
- `GeneratorFunction.prototype[Symbol.toStringTag]`: 'GeneratorFunction

### Symbol.unscopables ###

对象的`Symbol.unscopables`属性，指向一个对象。该对象指定了使用`with`关键字时，哪些属性会被`with`环境排除

        Array.prototype[Symbol.unscopables];
        // {
        //   copyWithin: true,
        //   entries: true,
        //   fill: true,
        //   find: true,
        //   findIndex: true,
        //   includes: true,
        //   keys: true
        // }

        Object.keys(Array.prototype[Symbol.unscopables]);
        // ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'includes', 'keys']

上面代码说明，数组有 7 个属性，会被with命令排除

        // 没有 unscopables 时
        class MyClass {
            foo() {
                return 1;
            }
        }

        var foo = function () {
            return 2;
        };

        with(MyClass.prototype) {
            foo(); // 1
        }

        // 有 unscopables 时
        class MyClass {
            foo() {
                return 1;
            }
            get[Symbol.unscopables]() {
                return {
                    foo: true
                };
            }
        }

        var foo = function () {
            return 2;
        };

        with(MyClass.prototype) {
            foo(); // 2
        }

上面代码通过指定`Symbol.unscopables`属性，使得`with`语法块不会在当前作用域寻找`foo`属性，即`foo`将指向外层作用域的变量
