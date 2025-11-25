---
title: jQuery操作DOM元素
date: 2021-10-20 20:40:59
tags:
 - jQuery
categories: jQuery
---

# jQuery操作DOM #
jQuery对象提供了许多修改DOM元素的功能
<!-- more -->

## 修改Text和HTML ##
jQuery 对象的 text() 和 html() 方法分别获取节点的文本和原始 HTML 文本，例如，如下的 HTML 结构: 

		<!-- HTML结构 -->
		<ul id="test-ul">
		  <li class="js">111</li>
		  <li name="book"><span>222</span></li>
		</ul>

分别获取文本和 HTML: 

		console.log($("#test-ul li[name=book]").text()); // 222
		console.log($("#test-ul li[name=book]").html()); // <span>222</span>

如jQuery 的 API 实现了读写合一的功能，也就是: 无参数调用 text() 是获取文本，传入参数就变成设置文本，HTML 也是类似操作
例如：

		$("#test-ul li[name=book]").text("aaa") 


## 修改CSS ##
- jQuery 对象有“批量操作”的特点，对获取的DOM元素集进行操作

例如下面的结构

		<!-- HTML结构 -->
		<ul id="test-css">
		  <li class="lang dy"><span>JavaScript</span></li>
		  <li class="lang"><span>Java</span></li>
		  <li class="lang dy"><span>Python</span></li>
		  <li class="lang"><span>Swift</span></li>
		  <li class="lang dy"><span>Scheme</span></li>
		</ul>

可以用调用 jQuery 对象的 `css('name', 'value')` 方法，更改css样式。而获取css样式则是`css('name')`

	//更改li的class为dy的span元素
		$("#test-css li.dy>span")
		  .css("background-color", "#bfa")
		  .css("color", "red")

同时jQuery提供了修改css类的方法

		const div = $("#test-div");
		div.hasClass("highlight"); // false， class是否包含highlight
		div.addClass("highlight"); // 添加highlight这个class
		div.removeClass("highlight"); // 删除highlight这个class

## 显示和隐藏 DOM ##

- jQuery 直接提供show()和hide()方法

		const a = $("a");
		a.hide(); // 隐藏
		a.show(); // 显示

注意，隐藏 DOM 节点并未改变 DOM 树的结构，它只影响 DOM 节点的显示。这和删除 DOM 节点是不同的。

## 获取 DOM 信息 ##
- 利用 jQuery 对象的若干方法，我们直接可以获取 DOM 的高宽等信息，而无需针对不同浏览器编写特定代码:

		// 浏览器可视窗口大小:
		$(window).width(); // 800
		$(window).height(); // 600
		
		// HTML文档大小:
		$(document).width(); // 800
		$(document).height(); // 3500
		
		// 某个div的大小:
		const div = $("#test-div");
		div.width(); // 600
		div.height(); // 300
		div.width(400); // 设置CSS属性 width: 400px，是否生效要看CSS是否有效
		div.height("200px"); // 设置CSS属性 height: 200px，是否生效要看CSS是否有效

- `attr()` 和 `removeAttr()` 方法用于操作 DOM 节点的属性:

		// <div id="test-div" name="Test">...</div>

		const div = $("#test-div");
		div.attr("data"); // undefined, 属性不存在
		div.attr("name"); // 'Test'
		div.attr("name", "Hello"); // div的name属性变为'Hello'
		div.removeAttr("name"); // 删除name属性
		div.attr("name"); // undefined

- prop() 方法和 attr() 类似，但是 HTML5 规定有一种属性在 DOM 节点中可以没有值，只有出现与不出现两种，例如: 

		<input id="test-radio" type="radio" name="test" checked value="1" />
 等价于: 
		<input id="test-radio" type="radio" name="test" checked="checked" value="1" />
 	`attr()` 和 `prop()` 对于属性 checked 处理有所不同: 

		const radio = $("#test-radio");
		radio.attr("checked"); // 'checked'
		radio.prop("checked"); // true
 一般来说
	- attr(): 操作属性值为非布尔值的属性
	- prop(): 专门操作属性值为布尔值的属性

