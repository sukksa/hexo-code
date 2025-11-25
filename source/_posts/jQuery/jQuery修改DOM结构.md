---
title: jQuery修改DOM结构
date: 2021-10-20 21:26:54
tags:
 - jQuery
categories: jQuery
---

# 修改DOM结构 #
直接使用浏览器提供的 API 对 DOM 结构进行修改，不但代码复杂，而且要针对浏览器写不同的代码。 有了 jQuery，我们就专注于操作 jQuery 对象本身，底层的 DOM 操作由 jQuery 完成就可以了，这样一来，修改 DOM 也大大简化了
<!-- more -->
## 添加DOM节点 ##
要添加新的 DOM 节点，除了通过 jQuery 的 html() 这种暴力方法外，还可以用 append() 方法，例如在`<ul>`内部插入内容

		<div id="test-div">
		  <ul>
		    <li><span>JavaScript</span></li>
		    <li><span>Python</span></li>
		    <li><span>Swift</span></li>
		  </ul>
		</div>

首先要拿到` <ul> `节点：

		const $ul = $("#test-div>ul")

调用 `append()` 传入 HTML 片段:

		$ul.append("<li><span>jQuery</span></li>")

也可以使用`appendTo()`

		$("<li><span>jQuery</span></li>").appendTo($ul)

`append()` 把 DOM 添加到最后，而`prepend()` 则把 DOM 添加到最前，`prependTo()`同理

如果要把新节点插入到指定位置，例如，JavaScript 和 Python 之间，那么，可以先定位到 JavaScript，然后用 after() 方法:
 
		const js = $("#test-div>ul>li:first-child");
		js.after("<li><span>Lua</span></li>");

 也就是说，同级节点可以用 after() 或者 before() 方法。

## 删除DOM节点 ##

- `empty()`删除所有匹配元素的子元素，不会删除自身节点
- `remove()`删除所有匹配的元素，包括自己

例如：`empty()`方法

        var $li = $("#test-div>ul li")
        $li.empty()
		 //删除后
		<div id="test-div">
		  <ul>
		    <li></li>
		    <li></li>
		    <li></li>
		  </ul>
		</div>

而`remove()`方法

		$li.remove()
		//删除后
		<div id="test-div">
		  <ul>
		  </ul>
		</div>