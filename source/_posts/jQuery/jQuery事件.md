---
title: jQuery事件
date: 2021-10-21 00:46:14
tags:
- jQuery
categories: jQuery
---

# jQuery事件 #

因为 JavaScript 在浏览器中以单线程模式运行，页面加载后，一旦页面上所有的 JavaScript 代码被执行完后，就只能依赖触发事件来执行 JavaScript 代码。 
浏览器在接收到用户的鼠标或键盘输入后，会自动在对应的 DOM 节点上触发相应的事件。
如果该节点已经绑定了对应的 JavaScript 处理函数，该函数就会自动调用。
<!-- more -->

## 事件绑定 ##

事件绑定通过`eventName(function(){})` 与 `on(eventName, funcion(){})` 两种方法实现

  - `eventName(function(){})` 绑定对应事件名的监听,	例如：`$('#div').click(function(){})`
  - `on(eventName, funcion(){})` 通用的绑定事件监听, 例如：`$('#div').on('click', function(){})`


		/* HTML:
		 *
		 * <a id="test-link" href="#0">点我试试</a>
		 *
		 */
		
		// 获取超链接的jQuery对象:
		const $a = $("#test-link")
		
		$a.on("click", function () {
		  alert("Hello!")
		})
		$a.click(function () {
		  alert("Hello!")
		})

## 鼠标事件 ##

- `click()`: 鼠标单击时触发； 
- `dblclick`(): 鼠标双击时触发； 
- `mouseenter()`: 鼠标进入时触发； 
- `mouseleave()`: 鼠标移出时触发； 
- `mousemove()`: 鼠标在 DOM 内部移动时触发； 
- `hover()`: 鼠标进入和退出时触发两个函数，相当于 `mouseenter` 加上 `mouseleave`


- 注如何区别`mouseover()`与`mouseenter()`?
	* `mouseover()`: 在移入子元素时也会触发, 对应mouseout
	* `mouseenter()`: 只在移入当前元素时才触发, 对应mouseleave
	* `hover()`使用的就是`mouseenter()`和`mouseleave()`，故在使用`hover()`鼠标移入移出子元素不会触发事件


## 键盘事件 ##
键盘事件仅作用在当前焦点的 DOM 上，通常是 `<input>` 和 `<textarea>`

- `keydown()`: 键盘按下时触发
- `keyup()`: 键盘松开时触发
- `keypress()`: 按一次键后触发

## 其他事件 ##
- `focus()`: 当 DOM 获得焦点时触发
- `blur()`: 当 DOM 失去焦点时触发
- `change()`: 当 `<input>`、`<select>` 或 `<textarea>` 的内容改变时触发
- `submit()`: 当<form>提交时触发
- `ready()`: 当页面被载入并且 DOM 树完成初始化后触发


- 注
	- `reday()`事件ready 仅作用于 document 对象。由于 ready 事件在 DOM 完成初始化后触发，且只触发一次，所以非常适合用来写其他的初始化代码
	- `$(document).ready() `的简写方式为`$(function(){})`


## 事件参数 ##
有些事件，如 `mousemove()` 和 `keypress()`，我们需要获取鼠标位置和按键的值。所有事件都会传入 `Event` 对象作为参数，可以从 `Event` 对象上获取到更多的信息

* 事件的坐标
  * `event.clientX`, `event.clientY`  相对于视口的左上角
  * `event.pageX`, `event.pageY`  相对于页面的左上角
  * `event.offsetX`, `event.offsetY` 相对于事件元素左上角
* 事件相关处理
  * 停止事件冒泡 : `event.stopPropagation()`
  * 阻止事件默认行为 : `event.preventDefault()`


		//获取当前鼠标相对于页面的位置
		$(function () {
		  $("#testMouseMoveDiv").mousemove(function (event) {
		    $("#testMouseMoveSpan").text("pageX = " + 
				event.pageX + ", pageY = " + event.pageY)
		  })
		})


## 取消绑定事件 ##

- `off(eventName)` 取消事件的绑定，
- 注 
	- `off('click', function () {...})` 不能取消第一个绑定的匿名函数，即使它们写法相同也不是同一个对象
	- `$("*").off()`能够清除所有事件


		//点击btn1解除.inner上的所有事件监听
		$('#btn1').click(function () {
			$('.inner').off()
		})
		
		//点击btn2解除.inner上的mouseenter事件
		$('#btn2').click(function () {
			$('.inner').off('mouseenter')
		})



## 事件委托 ##
- 事件委托是指将多个子元素(如li)的事件监听委托给父辈元素(ul)处理，通俗来说 委托方子元素（li）相当于业主，被委托方父元素（ul）相当于中介
  * 监听回调是加在了父辈元素上
  * 当操作任何一个子元素(li)时, 事件会冒泡到父辈元素(ul)
  * 父辈元素不会直接处理事件, 而是根据`event.target`得到发生事件的子元素(li), 通过这个子元素调用事件回调函数


- 使用事件委托的好处
  * 添加新的子元素, 自动有事件响应处理
  * 能减少事件监听的数量

>在jQuery 3.0中以弃用，使用 `on()` 与`off()`代替
- 设置事件委托: `$(parentSelector).delegate(childrenSelector, eventName, callback)`
- 移除事件委托: `$(parentSelector).undelegate(eventName)`
		// 设置事件委托
		$('ul').delegate('li', 'click', function () {
			// console.log(this) 
			//this是当前触发click事件的对象（li）
			this.style.background = 'red'
		})
		// 向ul中新增li
		$('#btn1').click(function () {
			$('ul').append('<li>新增的li....</li>')
		})
		$('#btn2').click(function () {
			// 移除事件委托
			$('ul').undelegate('click')
		})

