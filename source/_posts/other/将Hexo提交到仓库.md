---
title: 将 Hexo 提交到仓库
date: 2025-11-26 09:27:34
tags:
 - git
categories: git
---

## 将 Hexo 提交到仓库

这是一个 Hexo 双仓库管理问题（一个是用于存放**静态网页**的 `xxx.github.io`，一个是用于存放**源代码**的 `hexo-code`）。

提交不上去是因为**Git 配置冲突**或者**`.gitignore` 设置不当**造成的。

<!-- more -->

### 创建 `.gitignore` 文件

Hexo 部署和源码备份最常见的问题就是把不该传的文件传了，或者该传的文件被忽略了。

打开或在根目录下新建 `.gitignore` 文件，确保里面**必须**包含以下内容。

```
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy_git/
```

- **`public/` 和 `.deploy_git/`**：这两个文件夹是 `hexo d` 生成的静态文件和部署用的 git 仓库，**绝对不能**提交到你的源码仓库 `hexo-code` 中，否则会造成严重的嵌套冲突。
- **`node_modules/`**：这是依赖包，体积很大且不需要备份，只需备份 `package.json` 即可。

### 处理主题（Themes）文件夹的 Git 冲突

这是最容易导致“无法提交”或“提交后文件夹是空的”的原因。

如果你下载的主题是通过 `git clone` 下载到 `themes/` 目录下的，那么该主题文件夹里会有一个隐藏的 `.git` 文件夹。

**解决方法：**进入 `themes/你的主题名/` 目录。删掉主题下的 `.git` 文件夹，不要删掉根目录的）。

这样做是为了让主仓库把主题文件当作普通文件来管理，而不是当作一个子模块（Submodule）。

### 生成 SSH 公钥连接到 GitHub

#### 检查并生成 SSH 密钥

请在你的 **Git Bash** (或者终端) 中依次执行以下命令：

1. **生成新密钥**（请直接复制下方命令，**将其中的 `你的邮箱` 换成你 GitHub 注册的邮箱**）：

   ```Bash
   ssh-keygen -t ed25519 -C "email@example.com"
   ```

2. **一路回车**：

   - 系统会问你保存路径 -> **按回车**（默认即可）。
   - 系统会问你是否覆盖 -> 如果提示 overwrite，输入 `y` 然后回车；如果没有提示，直接下一步。
   - 系统会问你 Passphrase（密码） -> **按回车**（留空，不要设密码，否则以后每次部署都要输密码）。
   - 再次确认密码 -> **按回车**。

   直到看见一个矩形的字符画（Randomart image），说明生成成功了。

#### 获取公钥内容

继续在终端输入以下命令，查看你的公钥内容：

```Bash
cat ~/.ssh/id_ed25519.pub
```

终端会显示以 `ssh-ed25519` 开头的一长串字符。**请把这一整段内容（包括开头的 ssh-ed25519 和结尾的邮箱）全部复制下来。**

#### 添加到 GitHub

1. 打开浏览器，登录你的 GitHub 账号。
2. 点击右上角头像 -> **Settings** (设置)。
3. 在左侧菜单栏找到 **SSH and GPG keys**。
4. 点击绿色的 **New SSH key** 按钮。
5. **Title**：随便填（例如：`My Laptop`）。
6. **Key**：**粘贴**你在第二步复制的那一长串内容。
7. 点击 **Add SSH key**。

#### 验证

回到你的 **Git Bash** 终端，输入以下命令测试连接：

```bash
ssh -T git@github.com
```

- 如果它问 `Are you sure...`，再次输入 `yes` 并回车。

- **成功的标志**：你会看到这样一句话：

  > `Hi <你的用户名>! You've successfully authenticated, but GitHub does not provide shell access.`

#### 重新部署 Hexo

请回到 Hexo 目录，再次尝试：

```bash
hexo d
```

就能顺利上传了。

### 清除凭证

#### 清除本地的 GitHub 身份凭证（最关键）

你的电脑上有两把“钥匙”可以访问你的 GitHub 账户：**SSH 私钥**和**Git 凭证管理器**。

1. 删除 SSH 私钥文件

​	你之前为了部署 Hexo 而创建的 SSH 密钥对，其中私钥文件 (`id_ed25519`) 存放在你的用户主目录下。

- **路径：** `C:\Users\你的用户名\.ssh\` 文件夹
- **需要删除的文件：**
  - `id_ed25519` (这是你的**私钥**，务必删除！)
  - `id_ed25519.pub` (这是公钥，删除它也无妨，但私钥是关键)
  - `known_hosts` (记录了连接过的服务器指纹，删除可清理连接记录)

2. 清除 Git 凭证缓存

​	如果你使用 HTTPS 方式克隆仓库，或者在部署时输入过 GitHub 的用户名和密码/个人访问令牌 (PAT)，系统可能会将其缓存在 Windows 的凭证管理器中。

1. 打开 Windows 搜索栏，搜索 **“凭证管理器”** (Credential Manager)。
2. 选择 **“Windows 凭证”** (Windows Credentials)。
3. 在“普通凭证” (Generic Credentials) 部分，查找任何以 `git:https://github.com` 或 `github.com` 开头的条目。
4. 找到后点击并选择 **“移除”** (Remove) 或 **“删除”** (Delete)。



#### 从 GitHub 账户中删除公钥（远程操作）

即使本地的私钥文件被删除，为了防止任何人通过其他方式恢复该文件，你还需要从 GitHub 账户中移除对应的公钥。这样，即使私钥泄露，它也无法用于访问你的 GitHub 账户。

1. 打开浏览器，登录你的 GitHub 账户。
2. 点击右上角头像，进入 **Settings** (设置)。
3. 在左侧菜单栏找到 **SSH and GPG keys**。
4. 找到你之前添加的、用于这台电脑的 SSH Key 确认删除
