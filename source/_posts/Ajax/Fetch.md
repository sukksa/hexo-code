---
title: Fetch
date: 2021-11-24 20:35:27
tags:
 - Ajax
 - JavaScript
categories: Ajax
---

# Fetch #
fetch 是一种 HTTP 数据请求的方式，是 XMLHttpRequest 的一种替代方案。fetch 不是 ajax 的进一步封装，而是原生 js。Fetch 函数就是原生 js，没有使用 XMLHttpRequest 对象

<!-- more -->


## Fetch 的参数 ##

- `url` ,该参数定义要获取的资源,可以是一个 url 字符串,也可以是一个 Request 对象
- `options` ,该参数可选,为一个对象,内部含有一些对请求的设置属性
	- `method`:请求使用的方法。如:GET、POST 等 
	- `headers`:请求头信息。形式为 Headers 对象或 ByteString 
	- `body`:请求的 body 信息,可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息 
	- `mode`:请求的模式。如 cors、no-cors 或者 same-origin 
	- `credentiala`:请求的 credentials。如 omit、same-origin 或者 include 
	- `cache`:请求的 cache 模式:default,no-store,reload,no-cache 或者 only-if-cached

### response 对象 ###
response 为一个 Promise 对象成功时传回的对象,该属性含有对应返回数据的属性和方法
#### 属性 ####
- `status` (number),HTTP 请求结果参数,在 100-599 范围 
- `statusText` (string),服务器返回的状态报告 
- `ok` (boolean),如果返回 200 表示请求成功则为 true 
- `headers` (Headers),返回头部信息,该属性后面也有对应的方法 
- `has(name)` (boolean),判断是否存在该信息头 
- `get(name)` (string),获取信息头的数据 
- `getAll(name)` (Array),获取所有头部数据 
- `set(name,value)`,设置请求头信息 
- `append(name,value)`,添加 header 的内容 
- `delete(name)`,删除 header 的信息 
- `forEach(function(value,name){...},[thisContext])`,循环读取 header 的信息 
- `url` (string),详细的地址

#### 方法 ####
- `text()`,以 string 的形式生成请求 text 
- `json()`,生成 JSON.parse(responseText)的结果 
- `blob()`,生成一个 Blob 
- `arrayBuffer()`,生成一个 ArrayBuffer 
- `formData()`,生成格式化数据,可用于其它的请求 

#### 其他方法 #### 
- `clone()`,创建一个 Response 对象的克隆 
- `Response.error()`,返回一个绑定了网络错误的新的 Response 对象 
- `Response.redirect()`,用另一个 URL 创建一个新的 Resonse 对象

## 用法 ##
### get ###

		fetch("a.html")
		    .then(function (response) {
		        return response.text()
		    })
		    .then(function (response) {
		        document.body.innerHTML = response
		    })

### post ###

		fetch("a.html", {
		    method: "POST",
		    headers: {
		        "Accept": "application/json",
		        "Content-Type": "application/json";
		    },
		    body: JSON.stringify({
		        user: "zhangsan",
		        pwd: 123456;
		    })
		})

## 与原生 Ajax 的比较 ##
### 原生 Ajax ###

		var Ajax = new XMLHttpRequest()
		Ajax.open("GET", url)
		Ajax.responseType = "json"
		Ajax.send()
		Ajax.onreadystatechange = function () {
		    console.log(Ajax.response)
		}
		Ajax.onerror = function () {
		    console.log("error")
		}
### fetch ###

		fetch(url).then(function (response) {
		    return response.json() //相当于JSON.parse(response);
		}).then(function (data) {
		    console.log(data)
		}).catch(function (err) {
		    console.log("error", err)
		});
		
		//使用箭头函数
		fetch(url).then(
		    response => response.json()
		).then(
		    data => console.log(data)
		).catch(
		    err => console.log("error", err)
		);
		
		//使用async函数
		let Fetch = async function () {
		    try {
		        let response = await fetch(url)
		        let data = await response.json()
		        console.log(data)
		    } catch (err) {
		        console.log("error", err)
		    }
		}

