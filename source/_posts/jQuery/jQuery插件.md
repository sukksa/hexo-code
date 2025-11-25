---
title: jQuery插件
date: 2021-10-24 20:21:52
tags:
- jQuery
categories: jQuery
---

# jQuery插件 #

- 我们可以扩展 jQuery 来实现自定义方法。这种方式也称为编写 jQuery 插件。
- 在使用jQuery插件时，应该先引入jQuery库文件，然后在引用jQuery插件
<!-- more -->

## 扩展jQuery的工具方法 ##

扩展jQuery的工具方法，`$.extend(object)`
用来在jQuery命名空间上增加新函数：

		//min方法返回一个较小值，max返回一个较大值
		$.extend({
			min: function (a, b) {
				return a < b ? a : b
			},
			max: function (a, b) {
				return a > b ? a : b
			}
		})
		//使用
		$.min(3, 5) //3
		$.max(3, 5) //5
		

## 扩展jQuery对象的方法 ##
扩展jQuery对象的方法，`$.fn.extend(object)`
扩展 jQuery 对象来提供新的方法

        $.fn.extend({
		// checkAll() : 全选
        checkAll: function () {
            this.prop('checked', true) // this是jQuery对象
            return this 	// this是jQuery对象
        },
		// unCheckAll() : 全不选
        unCheckAll: function () {
            this.prop('checked', false)
            return this

        },
		// reverseCheck() : 全反选
        reverseCheck: function () {
            // this是jQuery对象
            this.each(function () {
                // this是dom元素
                this.checked = !this.checked
            })
            return this
        }
        })
		// 使用, 全选复选框，并将复选框的value更改为111
		$(':checkbox[name=items]').checkAll().attr("value", "111")


- 注：插件函数最后要 `return this` 以支持链式调用；

## 多库共存 ##
- 问题 : 如果有2个库都有$, 就存在冲突
- 解决 : jQuery库可以释放$的使用权, 让另一个库可以正常使用, 此时jQuery库只能使用jQuery了
- API : `jQuery.noConflict()`

		//自定义js文件
		(function () {
		  window.$ = function () {
		    console.log('my lib $()...')
		  }
		})()

		//调用
		// 释放$的使用权
		jQuery.noConflict()
		// 调用myLib中的$
		$()
		// 要想使用jQuery的功能, 只能使用jQuery
		jQuery(function () {
			console.log('文档加载完成')
		})