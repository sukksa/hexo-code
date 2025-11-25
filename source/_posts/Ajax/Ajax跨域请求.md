---
title: Ajax跨域
date: 2021-12-05 15:08:27
tags:
 - Ajax
 - JavaScript
categories: Ajax
---

# Ajax跨域 #
## 同源策略 ##
同源策略（Sameoriginpolicy）是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能都会受到影响。可以说Web是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现。同源策略会阻止一个域的javascript脚本和另外一个域的内容进行交互。
**所谓同源（即指在同一个域）就是两个页面具有相同的协议（protocol），主机（host）和端口号（port）**

<!-- more -->

## 什么是跨域 ##
当一个请求url的协议、域名、端口三者之间任意一个与当前页面url不同即为跨域

当前页面url | 被请求页面url|是否跨域| 原因
---|:---:|:---:|---
http://www.test.com/|http://www.test.com/index.html	|否	|同源（协议、域名、端口号相同）
http://www.test.com/|https://www.test.com/index.html|跨域|协议不同（http/https）
http://www.test.com/|http://www.baidu.com/|跨域|主域名不同（test/baidu）
http://www.test.com/|http://blog.test.com/|跨域|子域名不同（www/blog）
http://www.test.com:8080/|http://www.test.com:7001/|跨域|端口号不同（8080/7001）

## 非同源限制 ##
- 无法读取非同源网页的 Cookie、LocalStorage 和 IndexedDB

- 无法接触非同源网页的 DOM

- 无法向非同源地址发送 AJAX 请求

## 跨域解决方法 ##
### JSONP ###
JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，兼容性好（兼容低版本IE），缺点是只支持get请求，不支持post请求。

核心思想：网页通过添加一个`<script>`元素，向服务器请求 JSON 数据，服务器收到请求后，将数据放在一个指定名字的回调函数的参数位置传回来。

		// 处理服务器返回回调函数的数据
		<script type="text/javascript">
		    function dosomething(res){
		        // 处理获得的数据
		        console.log(res.data)
		    }
		</script>
		// 向服务器127.0.0.1:8000/test发出请求，
				该请求的查询字符串有一个callback参数，用来指定回调函数的名字
		<script src="http://127.0.0.1:8000/test?callback=dosomething"></script>
		

		// node 部分
		app.all('/test',(request, response) => {
		    // response.send('console.log("hello jsonp")');
		    const data = {
		        data: "data"
		    };
		    //将数据转化为字符串
		    let str = JSON.stringify(data)
		    //返回结果
		    response.end(`dosomething(${str})`)
			// 返回的结果 dosomething({"data":"data"})
		})

### CORS ###
CORS 是跨域资源分享（Cross-Origin Resource Sharing）的缩写。它是 W3C 标准，属于跨源 AJAX 请求的根本解决方法
服务器端对于CORS的支持，主要是通过设置`Access-Control-Allow-Origin`来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问
	
		// node
		app.all('/cors-server', (request, response)=>{
			//设置响应头
			response.setHeader("Access-Control-Allow-Origin", "*")
			// response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500")
			response.send('hello CORS');
		})
