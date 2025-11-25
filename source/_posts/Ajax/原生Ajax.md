---
title: 原生Ajax
date: 2021-11-22 21:59:27
tags:
 - Ajax
 - JavaScript
categories: Ajax
---

# 原生Ajax #
Ajax 全称 Asynchronous JavaScript and XML(异步的 JavaScript 和 XML)，既是一个对象，也是一种方法模式 

AJAX 是一种用于创建快速动态网页的技术，通过在后台与服务器进行少量数据交换,Ajax 可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新，传统的不使用 Ajax 的网页如果需要更新内容,必需重载整个网页
<!-- more -->
## 用法 ##
### 创建 Ajax 对象 ###
通过 `XMLHttpRequest()`类创建一个 Ajax 对象(此方法不兼容 IE6 以下浏览器)

		var Ajax=new XMLHttpRequest()

在 IE6 以下浏览器通过 `ActiveXObject("Microsoft.XMLHTTP")`创建一个 Ajax 对象

		var Ajax=new ActiveXObject("Microsoft.XMLHTTP")

### 初始化 ###
通过 `open()` 方法，可以设置跟后台交互的一些行为,该方法有三个参数 
1、method；2、url；3、boolean

`method` 请求方式,一个包含具体请求方式的字符串 
- 主要请求方式： ​ 
	- POST,建议在添加数据时使用 
	- GET,建议在查询数据时使用 ​ 
	- PUT,建议在修改数据时使用 ​ 
	- DELETE,建议在删除数据时使用

`url`,要请求数据的具体地址

`bool`,进行同步或异步传输,true 为异步,false 为同步

		Ajax.open("GET", "http://localhost:8000", true)
		
设置需求

		// 如果想用GET的时候直接添加需求,可以在url后面加上?再写具体的需求,多个需求通过&符号连接
		var Ajax = new XMLHttpRequest()
		Ajax.open("GET","https://www.baidu.com?user=zhangsan&pwd=123456",true)
		
		
		// 如果是POST请求,需要设置请求头信息,如:
		// 表单格式请求头信息的写法
		
		Ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); //url格式
		
		// 或
		
		Ajax.setRequestHeader("Content-Type","application/json")//json格式
		
		//在下一步的send()方法中传入需求
		Ajax.send("user=zhangsan&pwd=123456")

		// 如果想用GET的时候直接添加需求,可以在url后面加上?再写具体的需求,多个需求通过&符号连接
		Ajax.open("GET","https://www.baidu.com?user=zhangsan&pwd=123456",true)
		
		
		// 如果是POST请求,需要设置请求头信息,如:
		// 表单格式请求头信息的写法
		
		Ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded") //url格式
		
		// 或
		
		Ajax.setRequestHeader("Content-Type","application/json")//json格式
		
		//在下一步的send()方法中传入需求
		Ajax.send("user=zhangsan&pwd=123456")

**GET 与 POST 区别**
与 POST 相比，GET 更简单也更快，并且在大部分情况下都能用。 
然而，在以下情况中，请使用 POST 请求：
- 无法使用缓存文件（更新服务器上的文件或数据库）
- 向服务器发送大量数据（POST 没有数据量限制）
- 发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠

### 发送请求 ###
通过 `send()`方法正式发送请求

		Ajax.send()
注: 如果请求方式是 POST 方式,添加的需求作为参数写入 `send()`方法中

		Ajax.send('a=100&b=200&c=300')

### 返回请求结果 ###
每当 `readyState` 改变时，就会触发 `onreadystatechange` 事件，因此可以给元素绑定`onreadystatechange`事件，来接受响应的事件
`XMLHttpRequest` 对象有三个非常重要的属性：`onreadystatechange`、`readyState`、`status`

![原生Ajax2](/images/Ajax/原生Ajax2.png)

`readyState`属性：

![原生Ajax1](/images/Ajax/原生Ajax.png)

通过 `status`(http 的状态码)属性的值判断请求后的结果从而得到请求信息,一般该值为 200 到 300 直接和等于 304 时代表请求成功,值为 404 代表请求失败

`response` 属性保留着后台返回到前端的数据

		Ajax.onreadystatechange = function () {
		    if (Ajax.readyState === 4) {
		        //确定http的状态码
		        if ((Ajax.status >= 200 && Ajax.status < 300) || Ajax.status === 304) {
		            console.log(Ajax.response);
		        }
		    }
		}

## XmlHttpRequest 对象的主要方法与属性 ##
### XmlHttpRequest 对象的主要方法 ###    
- `void open(String method,String url,Boolen async)`用于创建请求
	参数：
	- `method`： 请求方式（字符串类型），如：POST、GET、DELETE...
	- `url`： 要请求的地址（字符串类型）
	- `async`： 是否异步（布尔类型） 


- `void send(String body)`用于发送请求
	参数：
	- `body`： 要发送的数据（字符串类型） 


-  `void setRequestHeader(String header,String value)` 用于设置请求头
	参数：
	- `header`： 请求头的 key（字符串类型）
	- `vlaue`： 请求头的 value（字符串类型） 


- `String getAllResponseHeaders()` 获取所有响应头
	返回值：
	- 响应头数据（字符串类型） 


- `String getResponseHeader(String header)` 获取响应头中指定 header 的值
	参数：
	- `header`： 响应头的 key（字符串类型）
	返回值：
	- 响应头中指定的 header 对应的值 


- `void abort()` 终止请求

### XmlHttpRequest 对象的主要属性 ###

- `Number readyState` 状态值（整数）
	详细：
	- 0-未初始化，尚未调用 open()方法；
	- 1-启动，调用了 open()方法，未调用 send()方法；
	- 2-发送，已经调用了 send()方法，未接收到响应；
	- 3-接收，已经接收到部分响应数据；
	- 4-完成，已经接收到全部响应数据； 


- `Function onreadystatechange` 当 readyState 的值改变时自动触发执行其对应的函数（回调函数）  
- `String responseText`服务器返回的数据（字符串类型） 
- `XmlDocument responseXML`服务器返回的数据（Xml 对象） 
- `Number states` 状态码（整数），如：200、404... 
- `String statesText`状态文本（字符串），如：OK、NotFound...

## 总结 ##

1. 定义 XMLHttpRequest 对象
2. 初始化 设置请求方法和URL （open() 方法）
3. 发送请求 （send() 方法）
4. 注册监听的回调函数
5. 拿到返回值，对页面进行操作

