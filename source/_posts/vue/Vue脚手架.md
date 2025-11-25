---
title: Vue 脚手架
date: 2022-10-06 23:54:08
tags:
 - Vue
categories: Vue
---

# Vue 脚手架

> 使用前置：
>
> 第一步(没有安装过的执行)：全局安装 @vue/cli
>
> npm install -g @vue/cli
>
> 第二步：切换到要创建项目的目录，然后使用命令创建项目
>
> vue create xxxxx
>
> 第三步：启动项目
>
> npm run serve

<!-- more -->

## 脚手架文件结构

```
├── node_modules 
├── public
│   ├── favicon.ico: 页签图标
│   └── index.html: 主页面
├── src
│   ├── assets: 存放静态资源
│   │   └── logo.png
│   │── component: 存放组件
│   │   └── HelloWorld.vue
│   │── App.vue: 汇总所有组件
│   │── main.js: 入口文件
├── .gitignore: git版本管制忽略的配置
├── babel.config.js: babel的配置文件
├── package.json: 应用包配置文件 
├── README.md: 应用描述文件
├── package-lock.json：包版本控制文件
```



## 脚手架demo

### components:

就直接把单文件组件的 School.vue 和 Student.vue 两个文件直接拿来用，不需要修改。

### App.vue:

引入这两个组件，注册一下这两个组件，再使用。

```html
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Student></Student>
    <School></School>
  </div>
</template>

<script>
import School from './components/School.vue'
import Student from './components/Student.vue'

export default {
  name: 'App',
  components: {
    School,
    Student
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

### main.js:

入口文件

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

接下来就要详细讲解 main.js 中的 render 函数

## render函数

### 基本介绍

之前的写法是这样：

```js
import App from './App.vue'

new Vue({
	el:'#root',
	template:`<App></App>`,
	components:{App},
})
```

如果这样子写，运行的话会引发如下的报错

![vue_脚手架_render函数](\images\vue\vue_脚手架_render函数.png)


报错的意思是，是在使用运行版本的 vue ，没有模板解析器。

从上面的小知识可以知道，我们引入的 vue 不是完整版的，是残缺的（为了减小vue的大小）。所以残缺的`vue.js` 只有通过 `render` 函数才能把项目给跑起来。

来解析一下`render`

```js
// render最原始写的方式
// render是个函数，还能接收到参数a
// 这个 createElement 很关键，是个回调函数
new Vue({
  render(createElement) {
      console.log(typeof createElement)
      // 这个 createElement 回调函数能创建元素
      // 因为残缺的vue 不能解析 template，所以render就来帮忙解决这个问题
      // createElement 能创建具体的元素
      return createElement('h1', 'hello')
  }
}).$mount('#app')

```

![vue_脚手架_render函数2](\images\vue\vue_脚手架_render函数2.png)


因为 `render` 函数内并没有用到 `this`，所以可以简写成箭头函数。

```js
new Vue({
  // render: h => h(App),
  render: (createElement) => {
    return createElement(App)
  }
}).$mount('#app')
```

再简写：

```js
new Vue({
  // render: h => h(App),
  render: createElement => createElement(App)
}).$mount('#app')
```

最后把 `createElement` 换成 `h` 就完事了。

### 总结

对象内写方法最原始的：

```js
let obj = {
    name: 'aaa',
    work: function (salary) {
        return '工资' + salary;
    }
}
```

ES6 简化版：

```js
let obj = {
    name: 'aaa',
    work(salary) {
        return '工资' + salary;
    }
}
```

箭头函数简化版:

```js
let obj = {
    name: 'aaa',
    work: (salary) => {
        return '工资' + salary;
    }
}
```

箭头函数再简化（最终版）：

```js
// 只有一个参数就可以把圆括号去了，函数体内部只有一个 return 就可以把大括号去掉，return去掉
let obj = {
    name: 'aaa',
    work: salary => '工资' + salary;
}
```

这样就可以理解 `render` 函数的简写方式了。

来个不同版本 vue 的区别

* `vue.js`与`vue.runtime.xxx.js`的区别：
  * `vue.js`是完整版的Vue，包含：核心功能+模板解析器。
  * `vue.runtime.xxx.js`是运行版的Vue，只包含：核心功能；没有模板解析器。
* 因为`vue.runtime.xxx.js`没有模板解析器，所以不能使用`template`配置项，需要使用`render`函数接收到的`createElement`函数去指定具体内容。

## 修改脚手架的默认配置

* 使用vue inspect > output.js可以查看到Vue脚手架的默认配置。
* 使用vue.config.js可以对脚手架进行个性化定制，详情见：https://cli.vuejs.org/zh

## 脚手架中的index.html

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
	<!-- 针对IE浏览器的一个特殊配置，含义是让IE浏览器以最高的渲染级别渲染页面 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<!-- 开启移动端的理想视口 -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
	<!-- 配置页签图标 -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
	<!-- 引入第三方样式 -->
	<link rel="stylesheet" href="<%= BASE_URL %>css/bootstrap.css">
	<!-- 配置网页标题 -->
    <title>硅谷系统</title>
  </head>
  <body>
		<!-- 当浏览器不支持js时noscript中的元素就会被渲染 -->
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
		<!-- 容器 -->
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

