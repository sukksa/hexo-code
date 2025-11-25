---
title: Mixin (混入)
date: 2022-10-07 16:14:08
tags:
 - Vue
categories: Vue
---

# mixin 

**混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项**

Mixins 是一种分发 Vue 组件中可复用功能的非常灵活的一种方式。页面的风格不用，但是执行的方法和需要的数据类似就可以选择使用混入

混合对于封装一小段想要复用的代码来讲是有用的。它们当然不是唯一可行的。混合很好，它不需要传递状态，但是这种模式当然也可能会被滥用

<!-- more -->

## 区别

### mixin混入对象和Vuex的区别

- Vuex是**状态共享管理**，所以Vuex中的**所有变量和方法都是可以读取和更改并相互影响的**

- mixin可以**定义公用的变量或方法**，但是mixin中的**数据是不共享的**，也就是每个组件中的mixin实例都是不一样的，都是**单独存在的个体，不存在相互影响的**
- mixin混入对象值为函数的同名函数选项将会进行递归合并为数组，两个函数都会执行，只不过先执行mixin中的同名函数
- mixin混入对象值为对象的同名对象将会进行替换，都优先执行组件内的同名对象，也就是组件内的同名对象将mixin混入对象的同名对象进行覆盖

### 与公共组件的区别

- 组件：在父组件中引入组件，相当于在父组件中给出一片独立的空间供子组件使用，然后根据props来传值，但本质上两者是相对独立的
- Mixins：则是在引入组件之后与组件中的对象和方法进行合并，相当于扩展了父组件的对象与方法，可以理解为形成了一个新的组件

## 基本使用

```js
// 定义一个混入对象 mixin.js
export const myMixin = {
    methods: {
        hello() {
            console.log('hello from mixin!')
        },
    },
    mounted() {
        this.hello()
    }
}

// 定义一个使用混入对象的组件 
import { myMixin } from '../mixin'
const MixinComponent = Vue.extend({
    mixins: [myMixin],
})
// or
export default {
    name: 'MixinComponent',
    mixins: [myMixin],
}
```

## 选项合并规则

当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。

### 数据对象内

mixin 的数据对象和组件的数据发生冲突时以组件数据优先。

```js
var mixin = {
    data() {
        return {
            message: 'hello',
            foo: 'abc',
        }
    },
}
new Vue({
    mixins: [mixin],
    data() {
        return {
            message: 'goodbye',
            bar: 'def',
        }
    },
    created() {
        console.log(this.data)
        // => { message: "goodbye", foo: "abc", bar: "def" }
    },
})
```

### 钩子函数

同名钩子函数将会混合为一个数组，都将被调用到，但是混入对象的钩子将在组件自身钩子之前调用。

```js
var mixin = {
    created() {
        console.log('混入对象的钩子被调用')
    },
}
new Vue({
    mixins: [mixin],
    created() {
        console.log('组件钩子被调用')
    },
})
// => "混入对象的钩子被调用"
// => "组件钩子被调用"
```

### 值为对象的选项

值为对象的选项，例如 `methods`，`components` 和 `directives`，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。

```js
var mixin = {
    methods: {
        foo() {
            console.log('foo')
        },
        conflicting() {
            console.log('from mixin')
        },
    },
}
var vm = new Vue({
    mixins: [mixin],
    methods: {
        bar() {
            console.log('bar')
        },
        conflicting() {
            console.log('from self')
        },
    },
})
vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

## 全局混入（不推荐）

全局混合被注册到了每个单一组件上。因此，它们的使用场景极其有限并且要非常的小心。一个我能想到的用途就是它像一个插件，你需要赋予它访问所有东西的权限。但即使在这种情况下，我也对你正在做的保持警惕，尤其是你在应用中扩展的函数，可能对你来说是不可知的。

```js
Vue.mixin({
    mounted() {
        console.log("我是mixin")
    }
})
new Vue({
    //...
})
```

**注意:** 一旦使用全局混入对象，将会影响到**所有**之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑

```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
    created() {
        const myOption = this.$options.myOption
        if (myOption) {
            console.log(myOption)
        }
    },
})
new Vue({
    myOption: 'hello!',
})

// => "hello!"
```

