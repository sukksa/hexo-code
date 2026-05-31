---
title: 关于 cesium 在 micro-app 下无法显示的问题
date: 2026-03-24 21:17:07
tags:
 - cesium
categories: cesium
---

基座：vite + vue3

子应用：vite + vue3

[micro-app](https://jd-opensource.github.io/micro-app/0.x/docs.html) v1.0.0-rc.29, cesium v1.135

子应用包含一个 cesium map，在基座打开子应用时，cesium 无法显示地图，但是 sence, sky box, model 都能正常显示，唯独地图不显示。而单独运行子程序时，一切都能正常显示。

<!-- more -->

## 解决过程

最初的猜想是静态资源路径解析错误，导致 `Assets`、`Workers`、`Widgets` 静态资源未能成功加载上。

故设置了 `CESIUM_BASE_URL` :

```js
// 在引入 Cesium 或者创建 Viewer 之前执行
if (window.__MICRO_APP_ENVIRONMENT__) {
  // __MICRO_APP_PUBLIC_PATH__ 是 micro-app 注入的子应用绝对路径（带有子应用端口号）
  // 假设 cesium 静态资源放在子应用的 public/cesium 目录下
  window.CESIUM_BASE_URL = window.__MICRO_APP_PUBLIC_PATH__ + 'cesium/'; 
} else {
  // 独立运行时的路径
  window.CESIUM_BASE_URL = '/cesium/'; 
}
```

但是无论设不设置，`cesium.js` `widgets.css` 都是能够正常访问的。
![image-20260320160217611](https://raw.githubusercontent.com/sukksa/upgit-images/main/2026/03/image-20260320160217611_1773993740.png)



AI 提出 Cesium 极其依赖 Web Worker 来处理几何数据。在微前端中，基座和子应用往往运行在不同的端口（跨域）。浏览器出于安全策略，不允许跨域直接加载 Web Worker 脚本。但是 console 并没有报错跨域的问题，我看到 micro-app 可以设置 `iframe` 模式，实现了隔离，便认为 iframe 拦截了 Web Worker 脚本，导致地图不加载，所以按照 iframe 的方式设置了：

```vue
<micro-app
	name="cesium-map"
	:url="url"
	iframe
	@created="handleCreated"
	@beforemount="handleBeforeMount"
	@mounted="handleMounted"
	@unmount="handleUnmount"
	@error="handleError"
	router-mode="native"
	sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
	allow="cross-origin-isolated; geolocation"
	baseroute="/"></micro-app>
```

结果也不对，在 iframe 中确实能够正常运行，micro-app 并不支持，后来了解到 micro-app 不是通过 iframe 实现的，是借鉴了 WebComponent 的思想，通过CustomElement 将 micro-app 封装成一个类 WebComponent 组件。

```vue
  <iframe
    :src="src"
    frameborder="0"
    class="iframe"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    allow="cross-origin-isolated; geolocation"></iframe>
```



在翻阅官方 github issues 时，发现了相同的问题 [Vite项目 Cesium地图不展示 到底是什么原因](https://github.com/jd-opensource/micro-app/issues/1556)，下面有初始化 microApp 的配置：

参考 https://github.com/jd-opensource/micro-app-awesome-samples/blob/issue-1351/apps/main-app/src/main.js

```js
microApp.start({
    excludeAssetFilter (assetUrl) {
        if (assetUrl === 'createVerticesFromHeightmap' || assetUrl === 'transferTypedArrayTest' || assetUrl === 'createVerticesFromQuantizedTerrainMesh') {
          return true // 返回true则micro-app不会劫持处理当前文件
        }
        return false
    },
    plugins: {  
        modules: {
            'cesium-map': [{
                loader(code, url) {
                    // TODO 根据 实际情况再调整限制
                    if(url.indexOf("Cesium.js") > 0 && code.indexOf('var Cesium=')> -1) {
                        code = code.replace('var Cesium=', 'window.Cesium=')
                    }
                    return code
                }
            }]
        }
    }
})
```

`excludeAssetFilter(assetUrl) { ... }`

字面意思是静态资源过滤器。根据官方解释，如果这个函数返回 `true`，micro-app 就不会去劫持和处理这个资源的加载请求，而是让浏览器按原生方式去加载。

而代码中拦截的这些名称（`createVerticesFromHeightmap`、`createGeometry` 等），**是 Cesium 内部的 Web Workers 任务脚本**。 Cesium 为了保证 3D 渲染的流畅，把海量的几何体计算、地形切片计算都放在了后台 Web Worker 线程中。如果 micro-app 去劫持这些 Worker 脚本，会导致这些 Worker 脚本运行不了，这也是为什么 sence 以及引入的 model 都能够成功加载，而地形layer的加载依赖 createVerticesFromHeightmap.js 脚本，所以才会造成这个原因。

设置了 `excludeAssetFilter` 本地确实能够正常运行了，但是在我部署到线上的时候，console 报错：

```
未找到对象 ReferenceError: Cesium is not defined
```

`plugins: { modules: { 'cesium-map': [ ... ] } }`

官方指出 https://jd-opensource.github.io/micro-app/0.x/docs.html#/zh-cn/sandbox

> 我们使用`Proxy`拦截了用户全局操作的行为，防止对window的访问和修改，避免全局变量污染。`micro-app`中的每个子应用都运行在沙箱环境，以获取相对纯净的运行空间。
>
> 沙箱是默认开启的，正常情况下不建议关闭，以避免出现不可预知的问题。

在沙箱环境中，顶层变量不会泄漏为全局变量。

例如在正常情况下，通过 `var name`  或 `function name () {}` 定义的顶层变量会泄漏为全局变量，通过`window.name`或`name`就可以全局访问。

但是在沙箱环境下这些顶层变量无法泄漏为全局变量，`window.name`或`name`的值为`undefined`，导致出现问题。

而 `Cesium.js` 开头：`var Cesium=(()=>{...`，是将 `Cesium` 提升到了全局变量 `window.Cesium`，结果时不能在基座中访问，导致初始化时 `ReferenceError: Cesium is not defined`：

![image-20260320172255961](https://raw.githubusercontent.com/sukksa/upgit-images/main/2026/03/image-20260320172255961_1773998577.png)

在 js 沙箱，可以通过将 `var name` 改为 `window.name` 挂载在全局 `window` 上，因为我们不能直接修改 `Cesium.js` 文件，官方提供了类似 webpack 打包时 loader 修改代码，通过匹配 `Cesium.js` 文件名，将开头的 `var Cesium=` 替换为 `window.Cesium=` 。

```js
loader(code, url) {
    if (url.indexOf("Cesium.js") > 0 && code.indexOf('var Cesium=') > -1) {
        code = code.replace('var Cesium=', 'window.Cesium=')
    }
    return code
}
```

到目前为止问题已经解决，但是我们从哪儿获取到`excludeAssetFilter`中需要放行的`worker`脚本呢？

在 `\node_modules\cesium\Build\Cesium\Workers` 下，能发现许多js文件：

![image-20260320173654778](https://raw.githubusercontent.com/sukksa/upgit-images/main/2026/03/image-20260320173654778_1773999416.png)

以代码中为例，`createVerticesFromHeightmap.js` 是从高度图（heightmap）生成三维地形的顶点数据，而 micro-app 将其拦截刚好对应了地形没有显示的问题。如果需要绘制 `geometry` 就需要将 `Workers` 下的 `createGeometry.js` 加入 `loader` 。

以上。
