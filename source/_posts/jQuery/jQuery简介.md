---
title: jQuery介绍
date: 2021-10-19 00:03:28
tags:
 - jQuery
categories: jQuery
---

# jQuery介绍 #

jQuery 是 JavaScript 世界中使用最广泛的一个库。鼎盛时期全世界大约有 80~90%的网站直接或间接地使用了 jQuery。

<!-- more -->
- jQuery 能帮我们干这些事情: 
	- 消除浏览器差异: 您不需要自己写冗长的代码来针对不同的浏览器来绑定事件，编写 AJAX 等代码； 
	- 简洁的操作 DOM 的方法: 写 $('#test') 肯定比 document.getElementById('test') 来得简洁； 轻松实现动画、修改 CSS 等各种操作。 
	- jQuery 的理念 “Write Less, Do More“，让您写更少的代码，完成更多的工作！


## jQuery版本 ##
- jQuery 的 1.x 版本 兼容 ie678，2.x 为了精简代码体积移除了 ie678 的兼容。3.x 只兼容最新的一批浏览器
- 从jQuery官网 https://jquery.com/ 下载最新版 3.x 即可

## jQuery的本质 ##
- jQuery实际上是封装好的js文件，只向外暴露了 $ / jQuery
- 整个文件相当于下段代码
        (function (window) {
            var jQuery = function () {
                return new xxx()
            }

            window.$ = window.jQuery = jQuery
        })(window)

## 使用jQuery ##
- jQuery实际上是js文件，因此使用 jQuery 是需要先从外部引入js文件

### 本地引入 ###
- 将jQuery文件放在本地文件内
		<script type="text/javascript" src="js/jquery-1.12.3.js"></script>

### 远程引入 ###
- 从外部CDN库中引入，例如免费开源网站 https://www.bootcdn.cn/
		<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>

## jQuery核心函数 ##
- jQuery函数在代码中写作 $ 或 jQuery
- jQuery库向外直接暴露的就是 $ / jQuery
- 引入jQuery库后, 直接使用$即可
    * 当函数用: $(xxx)
    * 当对象用: $.xxx()


	console.log(typeof $) // function
	console.log(jQuery === $) // true

### 作为一般函数调用 ###
- 作为一般函数调用: $(param)
  1. 参数为函数 : 当DOM加载完成后，执行此回调函数，相当于`window.onload = function(){}`
  2. 参数为选择器字符串: 查找所有匹配的标签, 并将它们封装成jQuery对象
  3. 参数为DOM对象: 将dom对象封装成jQuery对象
  4. 参数为html标签字符串 (用得少): 创建标签对象并封装成jQuery对象


	// html部分
	    <div>
	        <button id="btn">测试</button>
	        <br />
	    </div>
	//js部分
        $(function () { // 绑定文档加载完成的监听

            // 1.2). 参数为选择器字符串: 查找所有匹配的标签, 并将它们封装成jQuery对象
            $('#btn').click(function () { // 绑定点击事件监听

                // 1.3). 参数为DOM对象: 将dom对象封装成jQuery对象
                alert($(this).html()) // this是什么? 发生事件的dom元素(<button>)

                // 1.4). 参数为html标签字符串 (用得少): 创建标签对象并封装成jQuery对象
                $('<input type="text" name="msg"/><br/>').appendTo('div')
            })
        })
	在上面代码中，需求是 **点击按钮: 显示按钮的文本, 显示一个新的输入框**



### 作为对象使用 ###
- 作为对象调用：$.xxx()，例如
	1. $.each() : 隐式遍历数组
	2. $.trim() : 去除两端的空格


        //需求： 遍历输出数组中所有元素值
        var arr = [2, 4, 7]
        // 1). $.each() : 隐式遍历数组

        $.each(arr, function (index, item) {
            console.log(index, item)
        })

## jQuery核心对象 ##

* jQuery对象是一个**包含所有匹配的任意多个dom元素的伪数组对象**
* 如何得到jQuery对象: 执行jQuery函数返回的就是jQuery对象
* 使用jQuery对象: $obj.xxx()
* 基本行为：
	* length: 得到DOM元素的个数
	* [index]: 得到指定下标对应的DOM元素
	* each(function(index, domEle){}): 遍历所有的DOM元素
	* index(): 得到当前DOM元素在所有兄弟元素中的下标

  		console.log($() instanceof Object) // true


- 例如下段代码
		//html部分
			<button>测试一</button>
			<button>测试二</button>
			<button id="btn3">测试三</button>
			<button>测试四</button>
		//js部分
	        $(function () {
	            var $buttons = $("button")
	            console.log($buttons.length) //4
	            console.log($buttons[2].innerHTML) //测试三
	        })
	- 通过调用 $("button") 函数 return 一个 jQuery对象，这个对象就是 ```<button>```的DOM元素的伪数组对象
	- jQuery对象的命名一般以 $ 开头，如 $xxx 

