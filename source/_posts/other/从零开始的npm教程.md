---
title: 从零开始的npm教程
date: 2025-12-05 17:56:55
tags:
 - git
categories: git
---

## npm 

npm 是 Node.js 的标准包管理器，它允许你下载别人写好的代码（称为“包”或 package）直接在你的项目中使用，同时也帮助你管理这些代码之间的**依赖关系**（即你的项目运行所需要的外部代码）。

<!--more-->

### package.json

`package.json`是 Node.js 项目中最重要的文件，如果没有它，npm 就不知道你的项目叫什么，也不知道该下载哪些代码包来帮你的项目运行。

以下是最基础的 `package.json` 的模板：

```JSON
{
  "name": "my-super-app",
  "version": "1.0.0",
  "description": "这是个 npm 的项目",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "eslint": "^7.32.0",
  },
  "author": "你的名字",
  "license": "ISC"
}
```

#### `name ` 项目名称

在 npm 中必须遵循一下规则，这个名字将来可能会成为 URL 的一部分：

- **必须是全小写**：不能有大写字母。
- **不能有空格**：可以使用连字符（`-`）或下划线（`_`）。
- **不能包含特殊字符**：也就是要是 URL 安全的字符。

#### `version` 版本号

npm 严格遵循一种叫做 **语义化版本 (Semantic Versioning)** 的规范，通常缩写为 **SemVer**。

版本号通常长这样：**`1.0.0`**，由三个数字组成，中间用点隔开。

我们可以把它们拆解为：**`主版本号.次版本号.修订号` (Major.Minor.Patch)**

| **数字位置** | **名称**           | **什么时候改变？**                            |
| ------------ | ------------------ | --------------------------------------------- |
| **1**.0.0    | **主版本** (Major) | 当做了**不兼容**的 API 修改时。               |
| 1.**0**.0    | **次版本** (Minor) | 当增加了**向下兼容**的新功能时。              |
| 1.0.**0**    | **修订号** (Patch) | 当进行了**向下兼容**的问题修正 (Fix Bug) 时。 |

`package.json`版本号前面的符号（如`^`和`~`）是用于指定**版本范围**的，`^`（插入号）允许更新次要版本和补丁版本（`^1.2.3`可更新到`1.x.x`但不能`2.0.0`），而`~`（波浪号）只允许更新补丁版本（`~1.2.3`可更新到`1.2.x`但不能`1.3.0`）。

- **`^` (Caret / 插入号)**：
  - **含义**：锁定主版本号，允许次要版本和补丁版本更新。
  - **示例**：`^1.2.3` 会安装 `>=1.2.3` 且 `<2.0.0` 的最新版本。
  - **特殊情况**：对于`0.x.x`版本（如`^0.1.0`），`^`行为与`~`类似，只允许更新到`0.1.x`，因为`0.x.x`阶段变动可能不兼容。
- **`~` (Tilde / 波浪号)**：
  - **含义**：锁定主版本号和次要版本号，只允许更新补丁版本。
  - **示例**：`~1.2.3` 会安装 `>=1.2.3` 且 `<1.3.0` 的最新版本。
- **无符号 (指定版本)**：
  - **含义**：只安装指定的具体版本。
  - **示例**：`1.2.3` 只会安装`1.2.3`。
- **`\*` (星号)**：
  - **含义**：匹配任何版本。
  - **示例**：`*` 或 `latest` 表示安装最新版本。
- **`<` , `>` , `<=` , `>=`**：
  - **含义**：明确版本范围。
  - **示例**：`<=3.2.1` 表示小于或等于`3.2.1`。 



在下载依赖时，怎么样确定是`~`还是`^`？

**`npm` 的默认行为：**

- **默认使用 `^` (插入符)。** 自 npm v5 版本以来，当你运行 `npm install <package>` 时，它会自动在 `package.json` 中使用 `^` 符号来记录依赖。

- 如果包的版本号是 `0.x.x` (即主版本号为 0)，由于 0.x.x 版本被认为不稳定，`npm` 通常会使用更严格的 `~` 或直接锁定版本。

只有在要求**最大程度的稳定性**时，才会手动去使用 `~` 符号，或者使用 `npm install <package> --save-exact` 来精确锁定版本号，以覆盖 `npm` 默认的 `^` 行为。

#### `main` 模块入口

这是这个包的 **“公开 API 入口”**。它告诉 Node.js：当其他开发者安装并尝试使用你的包时，应该从哪个文件开始执行。

在这个例子中，`"main": "index.js"` 表示当有人在自己的代码中写下 `const myApp = require('my-super-app');` 时，Node.js 就会去加载并返回你的 `index.js` 文件导出的内容。

如果没有这个字段，Node.js 默认会去找 `index.js`，但明确指定可以确保其他模块正确调用你的库。

#### `exports` 模块入口

随着 JavaScript 模块系统从 CommonJS（使用 `require()`）过渡到 ES Modules（使用 `import`），开发者需要一种方式来告诉 Node.js 和打包工具：“如果你是使用 `import` 导入我的包，请给我 ES Module 格式的文件；如果你是使用 `require()`，请给我 CommonJS 格式的文件。”

`exports` 字段完美解决了这个问题，它提供了 **“条件导出” (Conditional Exports)** 的能力。

| **字段**      | **作用**                                          | **限制**                         |
| ------------- | ------------------------------------------------- | -------------------------------- |
| **`main`**    | 传统入口。只能指向一个文件。                      | 无法区分 `require` 和 `import`。 |
| **`exports`** | **现代入口。** 可以指向多个文件，并根据条件选择。 | 现代工具优先使用它。             |

这是一个常见的 `exports` 定义，它允许你的包支持两种模块格式：

```json
{
  "name": "my-modern-app",
  "exports": {
    "import": "./dist/index.mjs",    // 针对 ES Module (import)
    "require": "./dist/index.cjs",   // 针对 CommonJS (require)
    "default": "./dist/index.js"     // 如果上述条件都不满足
  }
}
```

> 在 `package.json` 中，如果同时设置了 `main` 和 `exports` 字段，官方规则如下：
>
> 1. **`exports` 优先：** 只要 `exports` 字段存在，Node.js 的最新版本和现代打包工具（如 Webpack、Rollup、Vite）就会**优先读取并使用 `exports` 字段**，而完全**忽略** `main` 字段。
> 2. **`main` 回退：** 只有在 `exports` 字段不存在，或者运行环境是**旧版本的 Node.js** 或**不支持 `exports` 的旧工具**时，`main` 字段才会起作用。



#### `dependencies` (生产环境依赖)

这里列出的包是项目在 **运行** 时**必须**需要的。例如：React, Express, Vue 等。运行 `npm install` 时总是会被下载。

在npm v5 版本后 `npm install <package>` 会自动下载到 dependencies 中，等同于 `npm install <package> --save`

```shell
npm install <package>
npm install <package> --save
npm install <package> --S
```

通过`@` 符号的作用是用来**指定你想要安装的包的特定版本号或标签**。

`npm install lodash@4.17.21`：安装 `lodash` 库的精确版本 `4.17.21`。

`npm install react@beta`：安装 `react` 库的 `beta` 预发布版本。

`npm install vue@latest`：安装 `vue` 库的最新稳定版本。 等用于 `npm install vue`



#### `devDependencies` (开发环境依赖)

这里列出的包只在你进行**开发、测试或构建**项目时需要。例如：测试工具 (Jest)、代码检查工具 (ESLint) 或打包工具 (Webpack/Vite) 等。运行 `npm install --production` 时会被跳过。执行下面命令会下载到 devDependencies

```shell
npm install <package> --save-dev
# 简写
npm install <package> -D
```

#### `scripts` 脚本命令

`scripts` 部分允许你定义一些自定义的命令，你可以用 `npm run <命令名>` 来执行它们。目的是把一个复杂的命令行指令封装成一个简单的自定义命令。

而且把复杂命令封装成简单脚本的主要好处是：

1. **简化操作**：开发者不用记住长串复杂的命令。
2. **跨平台一致性**：无论在 Windows、macOS 还是 Linux 上，执行 `npm run build` 的结果都是一致的。
3. **路径安全**：`npm` 会自动确保你在脚本中运行的程序（比如 `vite` 或 `webpack`）是正确的路径，你不需要担心它们是否被添加到系统的 `PATH` 环境变量中。

在一个典型的 Vue 3 项目（使用 Vite 作为构建工具）中，`scripts` 部分通常是这样的：

```json
{
  // ... 其他字段 ...
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  }
}
```

| **命令**        | **实际运行**               | **用途**                             |
| --------------- | -------------------------- | ------------------------------------ |
| `npm run dev`   | `vite`                     | 启动本地开发服务器。                 |
| `npm run build` | `vue-tsc... && vite build` | 执行类型检查，然后构建生产环境文件。 |
| `npm run lint`  | `eslint...`                | 自动修复代码格式和潜在错误。         |

其中`npm run build `中的 ` &&` 是要求两个命令**按条件顺序执行**。只有前面的命令执行**成功**（退出代码为 0）时，才会继续执行后面的命令。如果第一个命令失败了，整个脚本就会立即停止。

> 为什么有些脚本（比如 `start` 和 `test`）可以直接使用 **`npm start`** 和 **`npm test`** 运行，而不需要像 `build` 或 `lint` 那样使用 **`npm run build`**？
>
> 原因是 `start`、`test` 等是 `npm` 设定的一些**标准生命周期脚本 (Standard Lifecycle Scripts)**。它们是几乎所有 Node.js 项目在开发过程中都会用到的**核心操作**，例如：
>
> - `npm start`: 启动项目。
> - `npm test`: 运行测试。
> - `npm install`: 安装依赖。
>
> 为了方便开发者，`npm` 允许用户在运行这些**标准脚本**时省略 `run` 关键字，这纯粹是为了**节省时间**和**简化操作**。而像 `build` 或 `lint` 这样的自定义脚本则必须使用 `npm run`。

| **类别**   | **命令/别名**             | **完整命令**                       | **用途/含义**                                           |
| ---------- | ------------------------- | ---------------------------------- | ------------------------------------------------------- |
| **初始化** | `npm init`                | `npm init`                         | 初始化一个新项目，创建 `package.json` 文件。            |
| **安装**   | `npm install` / `npm i`   | `npm install`                      | 下载 `package.json` 中所有依赖，安装到 `node_modules`。 |
|            | `npm i <package>`         | `npm install <package>`            | 默认安装为**生产依赖** (`dependencies`)。               |
|            | `npm i -D <package>`      | `npm install <package> --save-dev` | 安装为**开发依赖** (`devDependencies`)。                |
| **运行**   | `npm run <script>`        | `npm run <script>`                 | 运行 `package.json` 中定义的自定义脚本。                |
|            | `npm start`               | `npm run start`                    | 运行标准 `start` 脚本 (可省略 `run`)。                  |
| **管理**   | `npm uninstall <package>` | `npm uninstall <package>`          | 卸载依赖，并从 `package.json` 中移除记录。              |
|            | `npm update`              | `npm update`                       | 更新已安装的包到允许的最新版本。                        |

` npm install <package> --global`简写`-g`是将包安装到**系统路径**，作为全局命令行工具使用。

### package-lock.json

`package.json` 记录的是依赖的**版本范围**（例如 `^1.0.0`），允许 Minor 和 Patch 升级。这就意味着，今天你安装的版本和三个月后新同事安装的版本可能不一样。

而 `package-lock.json` 记录的是一个包及其**所有子依赖**（依赖树）在安装时的**精确版本号**、**下载地址**和**完整性校验值 (integrity hash)**。

它的主要目标是：**保证可重复构建 (Repeatable Builds)**。无论何时何地运行 `npm install`，只要有 `package-lock.json` 存在，`node_modules` 文件夹的内容就必须完全一致。

当你在项目中共存 `package.json` 和 `package-lock.json` 两个文件并运行 `npm install` 时，`npm` 的行为遵循一个严格的优先流程：

1. **检查锁定文件：** `npm` 首先会查找 `package-lock.json`。
2. **强制精确安装：** 如果找到该文件，`npm` 会**严格按照**文件中记录的精确版本号、下载地址（`resolved` 字段）和完整性校验值（`integrity` 字段）来安装包。
3. **忽略范围：** 在这个阶段，`npm` 会**忽略** `package.json` 中定义的版本范围 (`^` 或 `~`) 所允许的任何较新版本。

假设 `package.json` 允许范围是 `^1.0.0`，而 `package-lock.json` 锁定的精确版本是 `1.0.5`。npm 会优先下载 `package-lock.json`中的版本。

 `package-lock.json` 的 `integrity`  （完整性）字段的作用是提供 **内容校验** 和 **安全保障**：

1. **哈希值：** `integrity` 字段记录了包文件的加密哈希值（例如 SHA-512）。
2. **内容验证：** `npm` 下载包后，会立即计算下载文件的哈希值。
3. **停止安装：** 如果计算出的哈希值与 `package-lock.json` 中记录的哈希值不匹配，则说明文件在传输过程中**可能被篡改**，`npm` 会拒绝安装以防止潜在的恶意代码注入。
