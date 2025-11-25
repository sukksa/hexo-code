---
title: Vuex
date: 2022-10-07 17:21:45
tags:
 - Vue
categories: Vue
---

# Vuex

Vuex 是在Vue中实现集中式状态（数据）管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。

<!-- more -->

## Vuex 理解

**Vuex 是一个全局的共享存储区域，相当于是一个数据仓库**

Vuex 是为了保存组件之间的共享数据而诞生的，如果组件之间要有共享数据，可以直接挂载到 Vuex 中，而不必通过父子组件直接的传值了，而私有的数据则不需要挂载到 Vuex 中，**只有需要共享的数据才放在 Vuex 中，私有的数据只需要放在组件的 data 中即可**

### 多组件共享状态的问题

1. 多个视图依赖于同一状态

2. 来自不同视图的行为需要变更同一状态

3. 以前的解决办法：

   a. 将数据以及操作数据的行为都定义在父组件

   b. 将数据以及操作数据的行为传递给需要的各个子组件(有可能需要多级传递)

vuex 就是用来解决这个问题的

### 状态自管理应用

这个状态自管理应用包含以下几个部分：

1. `state`: 驱动应用的数据源
2. `view`: 以声明方式将 `state` 映射到视图
3. `actions`: 响应在 `view` 上的用户输入导致的状态变化(包含 n 个更新状态的方法)

以下是一个表示“单向数据流”理念的简单示意：

![vue_Vuex_状态自管理应用](\images\vue\vue_Vuex_状态自管理应用.png)

### Vuex 的结构模型

![vue_Vuex_结构模型](\images\vue\vue_Vuex_结构模型.png)

## 搭建vuex环境

1. 下载`vuex`插件：`npm i vuex`

   注：`vue2`环境中不支持 `vuex4`，所以在 `vue2` 中应该使用 `npm i vuex@3` 命令安装 `vuex3`

2. 创建文件：`src/store/index.js`

```js
//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

//准备actions对象——响应组件中用户的动作
const actions = {}
//准备mutations对象——修改state中的数据
const mutations = {}
//准备state对象——保存具体的数据
const state = {}

//创建并暴露store
export default new Vuex.Store({
	actions,
	mutations,
	state
})
```

3. 在```main.js```中创建`vm`时传入```store```配置项

```js
//引入store
import store from './store'

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	store,
})
```

## 项目结构

`Vuex` 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：

1. 应用层级的状态应该集中到单个 `store` 对象中。
2. 提交 `mutation` 是更改状态的唯一方法，并且这个过程是同步的。
3. 异步逻辑都应该封装到 `action` 里面。

只要你遵守以上规则，如何组织代码随你便。如果你的 `store` 文件太大，只需将 `action`、`mutation` 和 `getter` 分割到单独的文件。

对于大型应用，我们会希望把 `Vuex` 相关代码分割到模块中。下面是项目结构示例：

```bash
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```

## 核心概念

> vuex中一共有五个状态 State Getter Mutation  Action  Module 

### State

1. `state` 提供唯一的公共数据源，所有共享的数据统一放到`store`的`state`进行储存，类似于 `Vue` 中的 `data`属性

2.  在`vuex`中`state`中定义数据，可以在任何组件中进行调用

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //数据，相当于data
    state: {
        name: '张三',
        age: 12,
        sum: 0,
    },
})
```

3. 使用：

在标签中直接使用

```html
<div>{{ $store.state.name }}</div>
<div>{{ $store.state.age }}</div>
```

组件中使用

```js
this.$store.state.name
this.$store.state.age
```

### Mutations

1. 包含多个直接更新 `state` 的方法(回调函数)的对象
2. 谁来触发: `action 中的 commit('mutationName')`
3. 只能包含同步的代码, 不能写异步代码

```js
 const mutations = {
	mutationName (state, value) {
		// 更新 state 某个属性的操作
	}
}
第一个参数：state 等同于 store.state ，若在模块中则为局部状态

第二个参数：value 可以为任意类型，但最后都会包装成一个对象
```

以加法、减法操作为例，`state.sum` 加上或减去 `value`

```js
mutations: {
    JIA(state, value) {
        state.sum += value
    },
    JIAN(state, value) {
        state.sum -= value
    },
},
```

### Actions

1. 包含多个事件回调函数的对象
2. 通过执行: `commit()`来触发 `mutation` 的调用，间接更新 `state`
3. 谁来触发: 组件中: `this.$store.dispatch('actionName', value) value为参数`

4. 可以包含异步代码（如定时器，ajax）

```js
const actions = {
	actionName (context, value) {
		commit('对应的mutationsName', value)
	}
 }
第一个参数：context对象
包含：{
  	state,      // 等同于 `store.state`，若在模块中则为局部状态
  	rootState,  // 等同于 `store.state`，只存在于模块中
  	commit,     // 等同于 `store.commit`
  	dispatch,   // 等同于 `store.dispatch`
  	getters,    // 等同于 `store.getters`
  	rootGetters // 等同于 `store.getters`，只存在于模块中
}
第二个参数： 可以为任意类型，但最后都会包装成一个对象
```

以 0.5s 后如果`sum`为奇数则加的加法操作为例：

```js
const actions = {
    jiaWait(context, value) {
        setTimeout(() => {
            if (context.state.sum % 2 != 0) {
            	context.commit('JIA', value)
        	}
        }, 500)
    },
},
```

### Getters

1. 包含多个计算属性(`get`)的对象
2. 当`state`中的数据需要经过加工后再使用时，可以使用`getters`加工，类似于 `Vue` 中的 `computed`属性
3. 谁来读取: 组件中: `$store.getters.xxx`

```js
const getters = {
    getterName(state) {
        return 
    },
}
```

以将 `sum`乘 10 为例：

```js
const getters = {
    bigSum(state) {
        return state.sum * 10
    },
},
```

###  Modules

1. 包含多个 `module`
2. 一个 `module` 是一个 `store` 的配置对象，可分别写在不同 `js`文件中，然后暴露即可，但是需要加上`namespaced: true,`
3. 与一个组件(包含有共享数据)对应

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const moduleA = {
    namespaced:true,//开启命名空间
    state: {},
    mutations: {},
    actions: {},
    getters: {},
}
const moduleB = {
    namespaced:true,//开启命名空间
    state: {},
    mutations: {},
    actions: {},
    getters: {},
}
const store = new Vuex.Store({
    modules: {
        moduleA: moduleA,
        moduleB: moduleB,
        // ES6 简写
        // moduleA,
        // moduleB,
    },
})
store.state.moduleA // -> moduleA 的状态
store.state.moduleB // -> moduleB 的状态
```

## 四个`map`方法的使用

导入

```js
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
```

### `mapState`方法：

用于帮助我们映射```state```中的数据为计算属性

```js
computed: {
    //借助mapState生成计算属性：sum、school、subject（对象写法）
     ...mapState({sum:'sum',school:'school',subject:'subject'}),
         
    //借助mapState生成计算属性：sum、school、subject（数组写法）
    ...mapState(['sum','school','subject']),
},
```

### `mapGetters`方法：

用于帮助我们映射```getters```中的数据为计算属性

```js
computed: {
    //借助mapGetters生成计算属性：bigSum（对象写法）
    ...mapGetters({bigSum:'bigSum'}),

    //借助mapGetters生成计算属性：bigSum（数组写法）
    ...mapGetters(['bigSum'])
},
```

### `mapActions`方法：

用于帮助我们生成与```actions```对话的方法，即：包含```$store.dispatch(xxx)```的函数

```js
methods:{
    //靠mapActions生成：incrementOdd、incrementWait（对象形式）
    ...mapActions({incrementOdd:'jiaOdd',incrementWait:'jiaWait'})

    //靠mapActions生成：incrementOdd、incrementWait（数组形式）
    ...mapActions(['jiaOdd','jiaWait'])
}
```

### `mapMutations`方法：

用于帮助我们生成与```mutations```对话的方法，即：包含```$store.commit(xxx)```的函数

```js
methods:{
    //靠mapActions生成：increment、decrement（对象形式）
    ...mapMutations({increment:'JIA',decrement:'JIAN'}),
    
    //靠mapMutations生成：JIA、JIAN（对象形式）
    ...mapMutations(['JIA','JIAN']),
}
```

> 备注：mapActions与mapMutations使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则传的参数是事件对象(event)。

具体案例：

```vue
<template>
    <div>
        <h1>当前求和为：{{ sum }}</h1>
        <h3>当前求和放大10倍为：{{ bigSum }}</h3>
        <h3>年龄：{{ age }}</h3>
        <h3>姓名：{{ name }}</h3>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <!-- 用了mapActions 和 mapMutations 的话要主动传参 -->
        <button @click="increment(n)">+</button>
        <button @click="decrement(n)">-</button>
        <button @click="incrementOdd(n)">当前求和为奇数再加</button>
        <button @click="incrementWait(n)">等0.5s再加</button>
    </div>
</template>
  
<script>
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'Count',
        data() {
            return {
                n: 1, //用户选择的数字
            }
        },
        computed: {
            ...mapState(['sum', 'age', 'name']),
            ...mapGetters(['bigSum']),
        },
        methods: {
            ...mapActions({ incrementOdd: 'sumOdd', incrementWait: 'sumWait' }),
            ...mapMutations({ increment: 'sum', decrement: 'reduce' }),
        },
        mounted() {
            console.log('Count', this)
        },
    }
</script>
```

## 模块化

目的：让代码更好维护，让多种数据分类更加明确。

### 语法

以加法操作为例，直接写在`store.js`中

`store.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const addCountOptions = {
    namespaced: true, //开启命名空间
    actions: {
        jiaWait(context, value) {
            setTimeout(() => {
                if (context.state.sum % 2 != 0) {
                    context.commit('JIA', value)
                }
            }, 500)
        },
    },
    mutations: {
        JIA(state, value) {
            context.sum += value
        },
        JIAN(state, value) {
            context.sum -= value
        },
    },
    state: {
        sum: 0,
        name: 'tom',
    },
    getters: {
        bigSum(state) {
            return state.sum * 10
        },
    },
}

export default new Vuex.Store({
    modules: {
        addCountOptions,
    },
})
```

或者写入单独的`js`文件中

`addCount.js`

```js
export default {
    namespaced: true, //开启命名空间
    actions: {},
    mutations: {},
    state: {},
    getters: {},
}
```

`store.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'
import addCountOptions from './addCount'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        addCountOptions,
    },
})
```

### 读取`state`数据

开启命名空间后，组件中读取`state`数据：

```js
//方式一：自己直接读取
this.$store.state.addCountOptions.sum

//方式二：借助mapState读取：
// 用 mapState 取 addCountOptions 中的state 必须加上 'addCountOptions'
...mapState('countAbout',['sum','name']),
```

### 读取`getters`数据

开启命名空间后，组件中读取`getters`数据：

```js
//方式一：自己直接读取，getters中没有addCountOptions属性，
		//因此只能使用 addCountOptions/bigSum
this.$store.getters['addCountOptions/bigSum']

//方式二：借助mapGetters读取：
...mapGetters('addCountOptions',['bigSum'])
```

### 调用`dispatch`

开启命名空间后，组件中调用`dispatch`

```js
//方式一：自己直接dispatch
this.$store.dispatch('addCountOptions/jiaWait',value)

//方式二：借助mapActions：在标签绑定method时必须手动传入参数 incrementWait(value)
...mapActions('addCountOptions',{incrementWait:'jiaWait'})
```

### 调用`commit`

开启命名空间后，组件中调用`commit`

```js
//方式一：自己直接commit
this.$store.commit('addCountOptions/JIA',value)
this.$store.commit('addCountOptions/JIAN',value)

//方式二：借助mapMutations：在标签绑定method时必须手动传入参数 increment(value)
...mapMutations('addCountOptions',{increment:'JIA',decrement:'JIAN'}),
```

