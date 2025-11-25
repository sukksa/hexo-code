---
title: 第一个cesium项目
date: 2025-10-07 16:14:08
tags:
 - cesium
 - vite
categories: cesium
---



## 第一个cesium项目

### 创建 Vite 项目

这里使用vite搭建demo, **选择 `Vanilla`** （代表原生 JS）

```bash
npm create vite@latest my-cesium-demo
```

<!-- more -->

### 安装 Cesium 

我们需要安装 Cesium 库本身，以及一个专门为 Vite 打造的 Cesium 插件。

1. 安装 Cesium:

   ```bash
   npm install cesium
   ```

2. 安装 Vite 插件 (vite-plugin-cesium): 这个插件会自动帮你处理 Cesium 的静态资源。

   ```bash
   npm install vite-plugin-cesium -D
   ```

### 配置 Vite

在项目根目录新建 `vite.config.js` 文件。

```javascript
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium'; // 引入插件

export default defineConfig({
  plugins: [
    cesium() // 使用插件
  ]
});
```

### Cesium 代码

打开 `index.html`，把 `<body>` 里的内容改成一个简单的 `div`，作为 Cesium 的容器：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cesium Demo</title>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

main.js

```javascript
// main.js
// 1. 引入 Cesium 的 CSS
import 'cesium/Build/Cesium/Widgets/widgets.css'

// 2. 引入 Cesium 库
import * as Cesium from 'cesium'

// 3. 设置 Cesium 静态资源路径
// (这一步很重要，vite-plugin-cesium 会自动处理，但我们需要告诉 Cesium 从哪里加载)
window.CESIUM_BASE_URL = '/Cesium/'

// 4. (可选) 设置你的 Cesium Ion Token
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZjRiOWJjYS05YjFlLTQwMDItODJlMy1iNzNkODU5NDJiMjIiLCJpZCI6Mjg1NjUyLCJpYXQiOjE3NDIzNjYzODB9._KJdWwzj8NIjoVImtrNdClZ3zqa44wo3qb5cOXdOpBU'
Cesium.Ion.defaultAccessToken = ACCESS_TOKEN

// 5. 初始化 Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
  // --- 为了保持 Demo 简洁，我们关闭一些默认控件 ---
  animation: false, // 是否显示动画控件
  baseLayerPicker: false, // 是否显示图层选择器
  fullscreenButton: false, // 是否显示全屏按钮
  geocoder: false, // 是否显示地名查找控件
  homeButton: false, // 是否显示 Home 按钮
  infoBox: false, // 是否显示信息框
  sceneModePicker: false, // 是否显示3D/2D/哥伦布视图切换器
  selectionIndicator: false, // 是否显示选取指示器
  timeline: false, // 是否显示时间线
  navigationHelpButton: false, // 是否显示导航帮助按钮

})
// (可选) 关掉 logo
viewer._cesiumWidget._creditContainer.style.display = 'none'
// 移除原有的layer
viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
// viewer.imageryLayers.removeAll()

// 添加一个在 Ion 注册的 layer
const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.IonImageryProvider.fromAssetId(3954))
viewer.imageryLayers.add(imageryLayer)

console.log('Cesium + Vite demo is running!')

```

