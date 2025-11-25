---
title: jQuery动画
date: 2021-10-24 14:11:29
tags:
 - jQuery
categories: jQuery
---

# jQuery动画 #


## slideUp / slideDown ##
**滑动动画**: 通过不断改变元素的高度(height)实现
- `slideDown()`: 带动画的展开
- `slideUp()`: 带动画的收缩
- `slideToggle()`: 带动画的切换展开/收缩
<!-- more -->

		const div = $("#test-slide");
		
		div.slideUp(3000); // 在3秒钟内逐渐向上消失

时间以毫秒为单位，但也可以是 'slow(600)'，'normal(400)'，'fast(200)' 这些字符串，无参调用就是'normal'

		const div = $("#test-show-hide");
		
		div.slideDown("slow"); // 在600ms内逐渐滑出


## fadeIn / fadeOut ##
**淡入淡出**: 不断改变元素的透明度(opacity)来实现的
- `fadeIn()`: 带动画的显示
- `fadeOut()`: 带动画隐藏
- `fadeToggle()`: 带动画切换显示/隐藏


		const div = $('#test-fade');
		
		div.fadeOut('slow'); // 在 0.6 秒内淡出
		fadeOut('slow')  fadeIn('slow')  fadeToggle('slow')


## show / hide ##
**显示隐藏**，默认没有动画, 动画通过改变(opacity/height/width)
- `show()`: (不)带动画的显示
- `hide()`: (不)带动画的隐藏
- `toggle()`: (不)带动画的切换显示/隐藏

		const div = $("#test-show-hide");
		
		div.hide(3000); // 在3秒钟内逐渐消失
		
		div.show("slow"); // 在600ms内逐渐显示

## 自定义动画 ##
jQuery动画本质 : 在指定时间内不断改变元素样式值来实现的
- `animate()`: 自定义动画效果的动画
- `stop()`: 停止动画

`animate()`，它可以实现任意动画效果，我们需要传入的参数就是 DOM 元素**最终的 CSS 状态**和**时间**，jQuery 在时间段内不断调整 CSS 直到达到我们设定的值:

		const $div = $("#test-animate");
		//3s内透明度变为0.25，宽高变为256px
		$div.animate(
		  {
		    opacity: 0.25,
		    width: "256px",
		    height: 256, //此处也可不写单位，传入数值256，单位默认为px 
		  },3000)

通过链式调用能做到动画实现的先后顺序

		const $div = $("#test-animate")
		//宽度先变为200px，高度再变为200px
	    $div.animate({
	        width: 200
	      }, 1000)
	      .animate({
	        height: 200
	      }, 1000)

`animate()` 还可以再传入一个回调函数，当动画结束时，该函数将被调用

		const $div = $("#test-animate");
		
		$div.animate(
		  {
		    opacity: 0.25,
		    width: 256,
		    height: 256
		  },
		  3000,
		  function () {
		    console.log("动画已结束")
		    // 恢复至初始状态:
		    $(this).css("opacity", "1.0")
				.css("width", "128px")
				.css("height", "128px")
		  })