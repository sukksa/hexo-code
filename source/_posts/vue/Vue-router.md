---
title: vue-router
date: 2022-10-07 16:14:08
tags:
 - Vue
categories: Vue
---

# vue-router

`vue-router`是Vue.js官方的路由插件，它和vue.js是深度集成的，适合用于构建单页面应用。
我们可以访问其官方网站对其进行学习：https://router.vuejs.org/zh/

`vue-router`是基于路由和组件的

- 路由用户设定访问路径的，将路径和组件映射起来。
- 在`vue-router`的单页面应用中，页面的路径的改变就是组件的切换

<!-- more -->

## 路由的定义

- 后端路由：对于普通的网站，所有的超链接都是 URL 地址，所有的 url 地址都对应服务器上对应的资源

  **后端路由是处理请求的回调函数**

- 前端路由：对于单页面应用程序来说，主要通过 URL 中的 hash(#号)来实现不同页面之间的切换，同时，hash 有一个特点：HTTP 请求中不会包含 hash 相关的内容；所以，单页面程序中的页面跳转主要用 hash 实现,在单页面应用中这就叫做前端路由

  **前端路由让构建单页面应用变得易如反掌**

## 基本使用

1. 安装vue-router，命令：```npm i vue-router```

2. 编写router配置项:

   ```js
   //引入VueRouter
   import VueRouter from 'vue-router'
   //引入Luyou 组件
   import About from '../components/About'
   import Home from '../components/Home'
   
   //创建router实例对象，去管理一组一组的路由规则
   const router = new VueRouter({
       /*
         route这个配置对象中的route表示路由器匹配规则的意思
         每个路由规则都是一个规则对象,身上有两个必须的属性:
         第一个属性为path,表示监听哪个路由链接地址
         第二个属性为component,表示如果路由前面匹配到了path路径,则展示component属性对于的组件
         */
   	routes:[
            //通过redirect属性设置路由重定向,当访问根目录的时候自动跳转到/login目录
            { 
                path: "/", 
                redirect: "/login" 
            },
   
   		{
   			path:'/about',
   			component:About
   		},
   		{
   			path:'/home',
   			component:Home
   		}
   	]
   })
   
   //暴露router
   export default router
   ```

3. 挂载到vue实例

   ```js
   import Vue from 'vue'
   import App from './App.vue'
   import VueRouter from 'vue-router'
   
   import router from './router'
   
   Vue.use(VueRouter)
   new Vue({
       render: (h) => h(App),
       router,
   }).$mount('#app')
   ```

4. 实现切换（active-class可配置高亮样式）

   ```html
   <router-link active-class="active" to="/about">About</router-link>
   ```

5. 指定展示位置

   ```html
   <router-view></router-view>
   ```

## 多级（嵌套）路由

如果想要在一层路由组件下面开启第二层组件，不能够直接通过二级的路由链接得到二级的路由组件，因为这样一级的链接组件就会消失

需要通过`routes`路由器匹配规则中相应规则的 `children` 属性，在该属性构成的数组中写入子路由来实现路由嵌套的功能

1. 配置路由规则，使用`children`配置项：

   ```js
   const router =  new VueRouter({
       routes:[
           {
               path:'/about',
               component:About,
           },
           {
               path:'/home',
               component:Home,
               children:[ //通过children配置子级路由
                   {
                       path:'news', //此处一定不要写：/news
                       component:News
                   },
                   {
                       path:'message',//此处一定不要写：/message
                       component:Message
                   }
               ]
           }
       ]
   })
   ```

2. 跳转（要写完整路径）：

   ```html
   <router-link to="/home/news">News</router-link>
   ```

3. 指定展示位置

   ```html
   <router-view></router-view>
   ```

## 命名路由

通过在`<router-link></router-link>`的组件中 `to` 指向一个带有 `name` 属性的对象，而在路由规则中也添加一个对应的 `name` 属性实现路由跳转，该方法能让我们更加轻松的进行路由规则的匹配

1. 给路由命名：

```js
const router =  new VueRouter({
    routes:[    
        {
            path:'/demo',
            component:Demo,
            children:[
                {
                    path:'test',
                    component:Test,
                    children:[
                        {
                              name:'hello' //给路由命名
                            path:'welcome',
                            component:Hello,
                        }
                    ]
                }
            ]
        }
    ]
})
```

2. 简化跳转：

```html
<!--简化前，需要写完整的路径 -->
<router-link to="/demo/test/welcome">跳转</router-link>

<!--简化后，直接通过名字跳转 -->
<router-link :to="{name:'hello'}">跳转</router-link>

<!--简化写法配合传递参数 -->
<router-link 
	:to="{
		name:'hello',
		query:{
		   id:666,
            title:'你好'
		}
	}"
>
    跳转
</router-link>
```

## 路由传参

一个 Vue 组件内置的`$route` 属性可以代表着正在进行跳转的路由

### query

当在路由器中链接中使用查询字符串(`url` 后面的`?`后的一系列值),不用修改路由规则中的 `path` 属性的路径，在路由视图的组件中可用通过 `this.$route` 获取该路由实例，通过该实例的 `query` 属性获取传入的参数的属性和值

1. 传递参数

```html
<!-- 跳转并携带query参数，to的字符串写法 -->
<router-link to="/home/message/detail?id=666&title=你好">跳转</router-link>

<!-- 跳转并携带query参数，to的对象写法 -->
<router-link
    :to="{
        path:'/home/message/detail',
        query:{
            id:666,
            title:'你好'
        }
    }"
>
    跳转
</router-link>
```

2. 接收参数：

```js
$route.query.id
$route.query.title
```

### params

使用 `params` 来获取参数需要在路由规则中定义参数，然后在路由器链接中需要在后面跟上对应数量的`/+值`传给参数实现传参，通过该实例的 `params` 属性获取传入的参数的属性和值

1. 配置路由，声明接收`params`参数

```js
const router =  new VueRouter({
    routes:[
        {
            path:'/home',
            component:Home,
            children:[
                {
                    path:'news',
                    component:News,
                },
                {
                    component:Message,
                    children:[
                        {
                            name:'xiangqing',
                            path:'detail/:id/:title', //使用占位符声明接收params参数
                            component:Detail,
                        }
                    ]
                }
            ]
        }
    ]
})
```

2. 传递参数

```html
<!-- 跳转并携带params参数，to的字符串写法 -->
<router-link :to="/home/message/detail/666/你好">跳转</router-link>
				
<!-- 跳转并携带params参数，to的对象写法 -->
<router-link 
	:to="{
		name:'xiangqing', // 必须使用name属性，不能用path
		params:{
		   id:666,
            title:'你好'
		}
	}"
>
    跳转
</router-link>
```

**特别注意**：路由携带`params`参数时，若使用`to`的对象写法，则不能使用`path`配置项，必须使用`name`配置！

3. 接收参数：

```js
$route.params.id
$route.params.title
```

## 路由的props

作用：让路由组件更方便的收到参数

```js
const router =  new VueRouter({
    routes: [
        {
            name:'xiangqing',
            path:'detail',
            component:Detail,

            //第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件
            // props:{a:900}

            //第二种写法：props值为布尔值，布尔值为true，
            //	则把路由收到的所有params参数通过props传给Detail组件
            // props:true

            //第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
            props($route) {
                return {
                  id: $route.query.id,
                  title:$route.query.title,
                  a: 1,
                  b: 'hello'
                }
            }
        }
    ]
})
```

对应组件的具体代码

```vue
<template>
  <ul>
      <h1>Detail</h1>
      <li>消息编号：{{id}}</li>
      <li>消息标题：{{title}}</li>
      <li>a:{{a}}</li>
      <li>b:{{b}}</li>
  </ul>
</template>

<script>
export default {
    name: 'Detail',
    props: ['id', 'title', 'a', 'b'],
    mounted () {
        console.log(this.$route);
    }
}
</script>
```

## $route 与 $router

- `this.$route` 是路由的参数对象，所有的路由参数如 `pararms` 和 `query` 都属于该属性的参数
- `this.$router` 是一个路由导航对象，用它可以方便的使用 JS 代码，实现路由器的前进，后退，跳转到新的 `url` 地址

###  $route 表示(当前路由信息对象)

表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的 route records（路由记录）。
路由信息对象：即`$router`会被注入每个组件中，可以利用它进行一些信息的获取。

1. `$route.path`

   字符串，对应当前路由的路径，总是解析为绝对路径，如 "/foo/bar"。

2. `$route.params`

   一个 key/value 对象，包含了 动态片段 和 全匹配片段，
         如果没有路由参数，就是一个空对象。

3. `$route.query`

    一个 key/value 对象，表示 URL 查询参数。
         例如，对于路径 `/foo?user=1`，则有 `$route.query.user == 1`，
         如果没有查询参数，则是个空对象。

4. `$route.hash`

   当前路由的 hash 值 (不带 #) ，如果没有 hash 值，则为空字符串。锚点

5. `$route.fullPath`

    完成解析后的 URL，包含查询参数和 hash 的完整路径。

6. `$route.matched`

   数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。

7. `$route.name`

   当前路径名字

8. `$route.meta`  

   对象，路由元信息，可以以对象的形式添加自定义的信息

### $router对象

全局的路由实例，是`router`构造方法的实例。
在 Vue 实例内部，你可以通过 `$router` 访问路由实例

#### this.$router.push()

```javascript
// 字符串
      this.$router.push('home')
// 对象
      this.$router.push({ path: 'home' })
// 命名的路由
      this.$router.push({ name: 'user', params: { userId: 123 }})
// 带查询参数，变成 /register?plan=123
      this.$router.push({ path: 'register', query: { plan: '123' }})
```

`push`方法其实和`<router-link :to="...">`是等同的。
 **注意：push方法的跳转会向 history 栈添加一个新的记录，当我们点击浏览器的返回按钮时可以看到之前的页面。**

#### this.$router.go()

```javascript
// 页面路由跳转 正数前进或者负数后退
this.$router.go(-1) // 后退1步
this.$router.go(2) // 前进2步

this.$router.forward() //前进
this.$router.back() //后退
```

#### this.$router.replace()

```javascript
//push方法会向 history 栈添加一个新的记录，而replace方法是替换当前的页面，
不会向 history 栈添加一个新的记录
<router-link to="/05" replace>05</router-link>

// 一般使用replace来做404页面
this.$router.replace('/')
```

## 缓存路由组件

1. 作用：让不展示的路由组件保持挂载，不被销毁。

2. 具体编码：

   这个 `include` 指的是组件名

```html
<keep-alive include="News"> 
    <router-view></router-view>
</keep-alive>
```

## route生命周期钩子

作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。
具体名字：

*  ```activated```路由组件被激活时触发。
*  ```deactivated```路由组件失活时触发。

> 这两个生命周期钩子需要配合前面的缓存路由组件使用（没有缓存路由组件不起效果）

## 路由守卫

1. 作用：对路由进行权限控制

2. 分类：全局守卫、独享守卫、组件内守卫

### 全局守卫

全局前置守卫包含三个 `beforeEach` 前置守卫，`affterEach` 后置守卫，`beforeResolve` 解析守卫

#### router.beforeEach

`router.beforeEach((to,from,next)=>{})`

回调函数中的参数，

- `to`：进入到哪个路由去

- `from`：从哪个路由离开

- `next`：函数，决定是否展示你要看到的路由页面。

  `next`方法的调用参数。

  - `next()`: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。
  - `next(false)`: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - `next('/')` 或者 `next({ path: '/' })`: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 [`router-link` 的 `to`prop](https://router.vuejs.org/zh/api/#to) 或 [`router.push`](https://router.vuejs.org/zh/api/#router-push) 中的选项。
  - `next(error)`: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

从名字全局前置守卫不难理解，它是全局的，即对 整个单页应用（SPA） 中的所有路由都生效，所以当定义了全局的前置守卫，在进入每一个路由之前都会调用这个回调

#### router.beforeResolve

`router.beforeResolve((to, from, next) => {})`

​	参数与`beforeEach`相同

- `to`：进入到哪个路由去
- `from`：从哪个路由离开
- `next`：函数，决定是否展示你要看到的路由页面。

他们两个的区别

- 执行的时机不一样

  `beforeEach` 是在路由规则被循环之前执行
  `beforResolve` 是在组件被解析之后调用

- 执行顺序

  `beforeEach` 要比 `beforResolve` 先执行

#### router.afterEach

`router.afterEach((to, from) => {})`

​    只有两个参数，

- `to`：进入到哪个路由去
- `from`：从哪个路由离开

全局后置守卫是整个单页应用中每一次路由跳转后都会执行其中的回调。所以多用于路由跳转后的相应页面操作，并不像全局前置守卫那样会在回调中进行页面的重定向或跳转。

#### 案例

```js
//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to,from,next)=>{
	if(to.meta.isAuth){ //判断当前路由是否需要进行权限控制
		if(localStorage.getItem('school') === 'zhejiang'){ //权限控制的具体规则
			next() //放行
		}else{
			alert('暂无权限查看')
			// next({name:'guanyu'})
		}
	}else{
		next() //放行
	}
})

//全局后置守卫：初始化时执行、每次路由切换后执行
router.afterEach((to,from)=>{
	if(to.meta.title){ 
		document.title = to.meta.title //修改网页的title
	}else{
		document.title = 'vue_test'
	}
})
```

### 独享守卫

独享守卫只有`beforeEnter`，并且写在`routes`的子路由中，仅对配置的一个路由生效

#### beforeEnter

`beforeEnter:(to,from,next)=>{}`

​	参数与`beforeEach`相同

- `to`：进入到哪个路由去
- `from`：从哪个路由离开
- `next`：函数，决定是否展示你要看到的路由页面。

​    与全局路由守卫用法一致，但是只能针对一个页面使用

#### 案例

```
const router =  new VueRouter({
    routes: [
        {
            name:'xinwen',
            path:'news',
            component:News,
            meta:{isAuth:true,title:'新闻'},
            beforeEnter: (to, from, next) => {
                console.log('独享路由守卫',to,from)
                if(to.meta.isAuth){ //判断是否需要鉴权
                    if(localStorage.getItem('school')==='atguigu'){
                        next()
                    }else{
                        alert('学校名不对，无权限查看！')
                    }
                }else{
                    next()
                }
            }
        },
    ]
)}
```

### 组件内的守卫

组件内的守卫包含三个 `beforeRouterEnter` ，`beforeRouterUpdated`， `beforeRouterLeave` 

### beforeRouterEnter

`beforeRouteEnter:(to,from,next)=>{}`

参数与全局路由守卫一致，触发在进入组件之前。当守卫执行前，组件实例还没被创建，故无法访问 `this`

项目需要在进入某个页面前，判断从特定页面进来时，做某些处理。例如：只有从详情页回到列表页需要重新调接口。此时，用到了`beforeRouteEnter`方法。

**注意**：在内部获取不到外部的`this`，方法、变量等都获取不到。但`vm`可以获取到`method`中的方法以及变量

### beforeRouterUpdated

`beforeRouterUpdated:(to,from,next)=>{}`

参数与全局路由守卫一致

在当前路由改变，但是该组件被复用时调用，即路由路径不变，调用的是同个界面，即组件被连续复用的时候，会调用到`beforeRouteUpdate`触发

### beforeRouterLeave

`beforeRouterLeave:(to,from,next)=>{}`

参数与全局路由守卫一致，导航离开该组件的对应路由时调用

在页面离开时做的操作，最常见的场景：用户修改了页面某些字段，还没有保存就要离开当前页面。此时在页面离开前需要给用户提示

**注意**：此时函数内部可以访问到`this`，执行完要做的操作后，必须写 `next()`，否则页面不会跳转

### 案例

```js
export default {
	name: 'About',
	beforeCreate() {
		console.log('beforeCreate')
	},

	mounted() {
		console.log('mounted')
	},
	beforeDestroy() {
		console.log('beforeDestroy')
	},

	//通过路由规则，进入该组件时被调用
	beforeRouteEnter(to, from, next) {
		console.log('beforeRouteEnter', to, from)
		if (to.meta.isAuth) {
			//判断是否需要鉴权
			if (localStorage.getItem('school') === 'xuexiao') {
				next()
			} else {
				alert('学校名不对，无权限查看！')
			}
		} else {
			next()
		}
	},

	//通过路由规则，离开该组件时被调用
	beforeRouteLeave(to, from, next) {
		console.log('beforeRouteLeave', to, from)
		next()
	},
}

//输出：
// beforeRouteEnter 
// beforeCreate
// mounted
// beforeRouteLeave
// beforeDestroy
```

## 路由器的两种工作模式

路由器的两种工作模式分别为`hash`模式和`history`模式，默认是`hash`模式。

1. 对于一个url来说，什么是hash值？—— #及其后面的内容就是hash值。

2. hash值不会包含在 HTTP 请求中，即：hash值不会带给服务器。

### 设置模式

```js
const router =  new VueRouter({
	mode:'history', // 默认不写mode 是hash
	routes:[{}],
})
```

### hash模式

路由器默认的工作模式是`hash`模式。因此我们看到的是

```
http://localhost:8080/#/
http://localhost:8080/#/about
http://localhost:8080/#/home
```

1. 地址中永远带着#号，不美观 。
2. 若以后将地址通过第三方手机app分享，若app校验严格，则地址会被标记为不合法。
3. 兼容性较好，`hash`模式所有浏览器天生支持

### history模式

路由器工作模式为`history`模式时，我们看到的是

```
http://localhost:8080/
http://localhost:8080/about
http://localhost:8080/home
```

1. 地址干净，美观 。
2. `history`模式，它内部使用的是`h5`中提供的`api`，兼容性没有`hash`模式的兼容性好
3. 应用部署上线时需要后端人员支持，解决刷新页面服务端404的问题。
