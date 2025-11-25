---
title: jQuery轮播图
date: 2021-10-26 22:13:14
tags:
 - javaScript 
 - DOM 
 - jQuery
categories: 实战

---

# jQuery实现轮播图 #

 功能说明:
 1. 点击向右(左)的图标, 平滑切换到下(上)一页
 2. 无限循环切换: 第一页的上一页为最后页, 最后一页的下一页是第一页
 3. 每隔3s自动滑动到下一页
 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
 5. 切换页面时, 下面的圆点也同步更新
 6. 点击圆点图标切换到对应的页

 bug: 快速点击时, 翻页不正常
 
<!-- more -->
## 代码演示 ##

		// html 部分
	    <div id="container">
	        <div id="list" style="left: -600px;">
	            <img src="img/5.jpg" alt="5" />
	            <img src="img/1.jpg" alt="1" />
	            <img src="img/2.jpg" alt="2" />
	            <img src="img/3.jpg" alt="3" />
	            <img src="img/4.jpg" alt="4" />
	            <img src="img/5.jpg" alt="5" />
	            <img src="img/1.jpg" alt="1" />
	        </div>
	        <div id="pointsDiv">
	            <span index="1" class="on"></span>
	            <span index="2"></span>
	            <span index="3"></span>
	            <span index="4"></span>
	            <span index="5"></span>
	        </div>
	        <a href="javascript:;" id="prev" class="arrow">&lt;</a>
	        <a href="javascript:;" id="next" class="arrow">&gt;</a>
	    </div>

	  	// js 部分
	    $(function () {
	
	        var $container = $('#container')    //获取整个轮播图外部div
	        var $list = $('#list')  //获取图片列表div
	        var $points = $('#pointsDiv>span')  // 获取圆点sapn
	        var $prev = $('#prev')  // 获取上一张按钮
	        var $next = $('#next')  // 获取下一张按钮
	        var PAGE_WIDTH = 600 //一页的宽度
	        var TIME = 400 // 翻页的持续时间
	        var ITEM_TIME = 20 // 单元移动的间隔时间
	        var imgCount = $points.length   //img张数
	        var index = 0 //当前下标
	        var moving = false // 标识是否正在翻页(默认没有)
	
	
	        // 1. 点击向右(左)的图标, 平滑切换到下(上)一页
	        $next.click(function () {
	            // 平滑翻到下一页
	            nextPage(true)
	        })
	        $prev.click(function () {
	            // 平滑翻到上一页
	            nextPage(false)
	        })
	
	        // 3. 每隔3s自动滑动到下一页
	        var intervalId = setInterval(function () {
	            nextPage(true)
	        }, 1000)
	
	        // 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
	        $container.hover(function () {
	            // 清除定时器
	            clearInterval(intervalId)
	        }, function () {
	            intervalId = setInterval(function () {
	                nextPage(true)
	            }, 1000)
	        })
	
	        // 6. 点击圆点图标切换到对应的页
	        $points.click(function () {
	            // 目标页的下标
	            var targetIndex = $(this).index()
	            // 只有当点击的不是当前页的圆点时才翻页
	            if (targetIndex != index) {
	                nextPage(targetIndex)
	            }
	        })
	
	        /**
	         * 平滑翻页
	         * @param next
	         * true: 下一页
	         * false: 上一页
	         * 数值: 指定下标页
	         */
	        function nextPage(next) {
	            /*
	              总的时间: TIME=400
	              单元移动的间隔时间: ITEM_TIME = 20
	              总的偏移量: offset
	              单元移动的偏移量: itemOffset = offset/(TIME/ITEM_TIME)
	
	              启动循环定时器不断更新$list的left, 到达目标处停止停止定时器
	             */
	
	            //如果正在翻页, 直接结束
	            if (moving) { //已经正在翻页中
	                return
	            }
	            moving = true // 标识正在翻页
	
	            // 总的偏移量: offset
	            var offset = 0
	            // 计算offset
	            if (typeof next === 'boolean') {
	                offset = next ? -PAGE_WIDTH : PAGE_WIDTH
	            } else {
	                offset = -(next - index) * PAGE_WIDTH
	            }
	
	            // 计算单元移动的偏移量: itemOffset
	            var itemOffset = offset / (TIME / ITEM_TIME)
	            // 得到当前的left值
	            var currLeft = $list.position().left
	            // 计算出目标处的left值
	            var targetLeft = currLeft + offset
	
	            // 启动循环定时器不断更新$list的left, 到达目标处停止停止定时器
	            var intervalId = setInterval(function () {
	                // 计算出最新的currLeft
	                currLeft += itemOffset
	                if (currLeft === targetLeft) { // 到达目标位置
	                    // 清除定时器
	                    clearInterval(intervalId)
	                    // 标识翻页停止
	                    moving = false
	                    // 如果到达了最右边的图片(1.jpg), 跳转到最左边的第2张图片(1.jpg)
	                    if (currLeft === -(imgCount + 1) * PAGE_WIDTH) {
	                        currLeft = -PAGE_WIDTH
	                    } else if (currLeft === 0) {
	                        // 如果到达了最左边的图片(5.jpg), 跳转到最右边的第2张图片(5.jpg)
	                        currLeft = -imgCount * PAGE_WIDTH
	                    }
	                }
	                // 设置left
	                $list.css('left', currLeft)
	                // console.log(currLeft)
	            }, ITEM_TIME)
	            
	            // 更新圆点
	            updatePoints(next)
	        }
	
	        /**
	         * 更新圆点
	         * @param next
	         */
	        function updatePoints(next) {
	            // 计算出目标圆点的下标targetIndex
	            var targetIndex = 0
	            if (typeof next === 'boolean') {
	                if (next) {
	                    targetIndex = index + 1 // [0, imgCount-1]
	                    if (targetIndex === imgCount) { // 此时看到的是1.jpg-->第1个圆点
	                        targetIndex = 0
	                    }
	                } else {
	                    targetIndex = index - 1
	                    if (targetIndex === -1) { // 此时看到的是5.jpg-->第5个圆点
	                        targetIndex = imgCount - 1
	                    }
	                }
	            } else {
	                targetIndex = next
	            }
	
	
	            // 将当前index的<span>的class移除
	            // $points.eq(index).removeClass('on')
	            $points[index].className = ''
	            // 给目标圆点添加class='on'
	            // $points.eq(targetIndex).addClass('on')
	            $points[targetIndex].className = 'on'
	
	            // 将index更新为targetIndex
	            index = targetIndex
	        }
	    })

## 知识要点 ##
- 上段代码中图片切换通过`nextPage(next)` 函数实现，这样的好处是方便调用，如点击切换，以及循环定时器自调用中。同时圆点的更新和图片切换同时执行。

- `nextPage(next)` 函数
	1. 整体思路
		轮播图实际上是图片的分段移动，通过不断调用循环定时器让图片分段移动，故总偏移量为一张或多张图片宽度，每段时间间隔移动一点距离，到达指定位置后就清除定时器

	2. next 参数的设置
		next 参数有三个值，ture：下一页 ，false ：上一页 ，数值：指定下标页

			if (typeof next === 'boolean') {
				//点击上下页按钮时触发
				offset = next ? -PAGE_WIDTH : PAGE_WIDTH
			} else {
				// 点击圆点跳转指定页触发
				offset = -(next - index) * PAGE_WIDTH
			}

	3. 如何解决图片循环展示问题
		
			// 如果到达了最右边的图片(1.jpg), 跳转到最左边的第2张图片(1.jpg)
			if (currLeft === -(imgCount + 1) * PAGE_WIDTH) {
				currLeft = -PAGE_WIDTH
			} else if (currLeft === 0) {
				// 如果到达了最左边的图片(5.jpg), 跳转到最右边的第2张图片(5.jpg)
				currLeft = -imgCount * PAGE_WIDTH
			}

		如下图所示，当图片的`left === -600*5` 时，此时为循环展示的最后一张图片，此时将图片切换到列表第一张图片，以达到无缝切换，第一张同理
		
		![jQuery轮播图1.png](/images/jQuery/jQuery轮播图1.png)

	4. 如何解决快速点击时, 翻页不正常
		产生原因：同时执行了多个循环定时器，导致图片div的left属性设置不正常
		解决办法：通过设置标识符判断循环定时器是否在执行，如果在执行则停止当前正在执行的定时器，开启新的定时器
		注：在执行`nextPage(next)` 时 `moving` 设置为 `true`，清除定时器时 `moving` 设置为 `false` 
		
			var moving = false //默认没有反页
			nextPage(next){
				if (moving) { //如果正在翻页中
					return
				}
				moving = true // 标识正在翻页
				
				// 设置定时器
				var intervalId = setInterval(function () {
						// 。。。
						
				// 到达目标位置
				if (currLeft === targetLeft) { 
				// 清除定时器
				clearInterval(intervalId)
				
				// 标识翻页停止
				moving = false
				
						// 。。。
				
					}
				}, ITEM_TIME)
			}
			