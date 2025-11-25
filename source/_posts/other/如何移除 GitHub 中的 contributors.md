---
title: 如何移除 GitHub 中的 contributors
date: 2025-04-05 21:57:08
tags:
 - git
categories: git
---



如果你在某次 commit 时，忘记 `git config` 设置自己的 `username` 和 `email`了，发现仓库主页 contributors，多了一个contributor，那么如何才能移除呢？

虽然官方没有移除contributor的办法，但是我们可以替换掉所有的username和email啊 ~~这样全都是我们提交的了~~

通过 `git filter-branch` Git 内置的重写历史工具，允许批量修改提交记录。

`--commit-filter`指定一个自定义脚本，针对每个提交执行操作。脚本的返回值会替换原始提交。

<!-- more -->

将作者信息替换为新的姓名和邮箱

```bash
git filter-branch --commit-filter '
    if [ "$GIT_AUTHOR_EMAIL" = "old email@example.com" ];
    then
        GIT_AUTHOR_NAME="new username";
        GIT_AUTHOR_EMAIL="new email@example.com";
        git commit-tree "$@";
    else
        git commit-tree "$@";
    fi' HEAD
```

再将提交者信息替换为新的姓名和邮箱

```bash

git filter-branch --commit-filter '
    if [ "$GIT_COMMITTER_EMAIL" = "old email@example.com" ];
    then
        GIT_COMMITTER_NAME="new username";
        GIT_COMMITTER_EMAIL="new email@example.com";
        git commit-tree "$@";
    else
        git commit-tree "$@";
    fi' HEAD
```

这两个命令的作用是**重写Git提交历史，将特定作者邮箱的提交修改为新的作者姓名和邮箱**。

当然官方推荐使用更安全的替代工具 `git filter-repo`。

至此commit记录里面的作者改掉了，可是那该死的主页上还有contributor怎么办？

我们可以拷贝一个版本库，在新的仓库里面提交。

1. 在 GitHub 上创建一个全新的仓库，并且创建一个`main` 分支
2. 将原来版本库重命名，并且将内容拷贝到新的仓库
3. 新的仓库就是完完全全修改了git记录的仓库了

怎么样很简单吧

建立好代码备份后，在本地仓库添加新创建的远程仓库，移除掉原来旧的远程仓库，拉取新的仓库，最后把本地强制覆盖远程仓库

```bash
git remote add localrepository https://github.com/your-account/new-repository.git
git remote remove origin
git pull localrepository
git push --force-with-lease localrepository main
```

最后，再将新的仓库 `git clone` 下来开发。

至此，新的仓库保留了所有的git记录，并且username和email也改掉了，新仓库首页也没有该死的contributors了，めでたいめでたい。至于旧的祝他幸福。

