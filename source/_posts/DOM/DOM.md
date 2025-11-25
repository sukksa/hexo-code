---
title: DOM介绍
date: 2021-04-27 20:45:31
tags:
 - javaScript
 - DOM
categories: DOM
---

## DOM ##
- DOM全称Document Object Model(文档对象模型)
	- 文档:整个HTML网页文档对象
	- 对象:网页中的每一个部分都被转换为了一个对象
	- 模型:使用模型表示对象之间的关系，方便我们获取对象
	
<!-- more -->
	
---
### 节点 ###
- **Node(节点)是构成HTML5的基本单元**，DOM节点主要分为四类
	- **文档节点**:整个HTML文档
	- **元素节点**:HTML文档中的HTML标签
	- **属性节点**:元素的属性
	- **文本节点**:HTML标签中的文本内容

|节点 | nodeName(节点名)| nodeType(节点类型)| nodeValue(节点值)|
|:----:|:----:|:----:|:----:| 
| 文档节点 | #document | 9 | null | 
| 元素节点 | 标签名 | 1 | null | 
| 属性节点 | 属性名 | 2 | 属性值 |
| 文本节点 | #text | 3 | 文本内容 |
 
- 浏览器已经为我们提供了文档节点对象window,该对象可以在页面中直接使用,代表的是整个网页 
- 通过nodeType===1可以判断某节点是否是元素节点 
- 文本节点包含了在写代码时的回车换行符间产生的空白，但是IE8及以下的浏览器中不会将空白节点当作子节点，而其他浏览器会
- 通过nodeName返回的标签名是全大写的 
- 元素节点的名字也可以通过专门的TagName属性获得

-----
### DOM事件 ###
- 事件是用户和浏览器之间的交互行为


#### 鼠标事件 ####

|属性| 描述|
|---|---|
| onclick| 当用户点击某个对象时调用的事件句柄。单击鼠标左键或者按下回车键时触发,意味着onclick事件处理程序既可以通过键盘也可以通过鼠标执行|
| oncontextmenu |在用户点击鼠标右键打开上下文菜单时触发。可以用做自定义菜单 |
|ondblclick |当用户双击某个对象时调用的事件句柄。双击鼠标左键时触发 |
|onmousedown |鼠标按钮被按下。 |
|onmouseenter |当鼠标指针移动到元素上时触发。该事件不冒泡，即鼠标移到其后代元素上时不会触发|
|onmouseleave |当鼠标指针移出元素时触发。该事件不冒泡，即鼠标移出其后代元素时不会触发。|
|onmousemove |鼠标被移动。 |
|onmouseover |鼠标移到某元素之上。鼠标移到其后代元素上时会触发,意味着支持冒泡 |
|onmouseout |鼠标从某元素移开。支持冒泡 |
|onmouseup |鼠标按键被松开|

#### 键盘事件 ####

|属性|描述|
|---|---|
|onkeydown|某个键盘按键被按下|
|onkeypress|某个键盘按键被按下并松开|
|onkeyup|某个键盘按键被松开|

#### 框架/对象事件 ####

|属性 |描述 |
|---|---|
|onabort| 图像的加载被中断。( `<object>)`|
|onbeforeunload |该事件在即将离开页面（刷新或关闭）时触发 onerror 在加载文档或图像时发生错误。 ( <object>, <body>和 <frameset>) |
|onhashchange |该事件在当前 URL 的锚部分发生修改时触发|
|onload| 一张页面或一幅图像完成加载|
|onpageshow| 该事件在用户访问页面时触发|
|onpagehide| 该事件在用户离开当前网页跳转到另外一个页面时触发 |
|onresize |窗口或框架被重新调整大小。(由window调用) |
|onscroll |当文档被滚动时发生的事件|
|onunload |用户退出页面。 (`<body> `和 `<frameset>)`|

#### 表单事件 ####

|属性 |描述|
|---|---|
| onblur |元素失去焦点时触发|
| onchange |该事件在表单元素的内容改变时触发( `<input>`, `<keygen>`, `<select>`, 和 `<textarea>`) |
|onfocus |元素获取焦点时触发 |
|onfocusin |元素即将获取焦点时触发 |
|onfocusout |元素即将失去焦点时触发|
|oninput| 元素获取用户输入时触发 |
|onreset|表单重置时触发|
|onsearch| 用户向搜索域输入文本时触发 ( `<input="search">`) |
|onselect| 用户选取文本时触发 ( `<input>`和`<textarea>)`|
| onsubmit| 表单提交时触发|

#### 剪贴板事件 ####

|属性|描述|
|---|---|
|oncopy	|该事件在用户拷贝元素内容时触发|
|oncut	|该事件在用户剪切元素内容时触发|
|onpaste|该事件在用户粘贴元素内容时触发|

#### 打印事件 ####

|属性|描述|
|---|---|
|onafterprint|该事件在页面已经开始打印，或者打印窗口已经关闭时触发|
|onbeforeprint|该事件在页面即将开始打印时触发|

#### 拖动事件 #### 
 
|事件|描述|
|---|---|
|ondrag|该事件在元素正在拖动时触发|
|ondragend|该事件在用户完成元素的拖动时触发|
|ondragenter|该事件在拖动的元素进入放置目标时触发|
|ondragleave|该事件在拖动元素离开放置目标时触发|
|ondragover|该事件在拖动元素在放置目标上时触发|
|ondragstart|该事件在用户开始拖动元素时触发|
|ondrop|该事件在拖动元素放置在目标区域时触发|

#### 多媒体事件 ####

|事件|描述|
|---|---|
|onabort|事件在视频/音频（audio/video）终止加载时触发|
|oncanplay|事件在用户可以开始播放视频/音频（audio/video）时触发|
|oncanplaythrough|事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发|
|ondurationchange|事件在视频/音频（audio/video）的时长发生变化时触发|
|onemptied|当期播放列表为空时触发|
|onended|事件在视频/音频（audio/video）播放结束时触发|
|onerror|事件在视频/音频（audio/video）数据加载期间发生错误时触发|
|onloadeddata|事件在浏览器加载视频/音频（audio/video）当前帧时触发触发|
|onloadedmetadata|事件在指定视频/音频（audio/video）的元数据加载后触发|
|onloadstart|事件在浏览器开始寻找指定视频/音频（audio/video）触发|
|onpause|事件在视频/音频（audio/video）暂停时触发|
|onplay|事件在视频/音频（audio/video）开始播放时触发|
|onplaying|事件在视频/音频（audio/video）暂停或者在缓冲后准备重新开始播放时触发|
|onprogress|事件在浏览器下载指定的视频/音频（audio/video）时触发|
|onratechange|事件在视频/音频（audio/video）的播放速度发送改变时触发|
|onseeked|事件在用户重新定位视频/音频（audio/video）的播放位置后触发|
|onseeking|事件在用户开始重新定位视频/音频（audio/video）时触发|
|onstalled|事件在浏览器获取媒体数据，但媒体数据不可用时触发|
|onsuspend|事件在浏览器读取媒体数据中止时触发|
|ontimeupdate|事件在当前的播放位置发送改变时触发|
|onvolumechange|事件在音量发生改变时触发|
|onwaiting|事件在视频由于要播放下一帧而需要缓冲时触发|

#### 动画事件 ####

|事件|描述|
|---|---|
|animationend|该事件在 CSS 动画结束播放时触发|
|animationiteration|该事件在 CSS 动画重复播放时触发|
|animationstart|该事件在 CSS 动画开始播放时触发|

#### 过渡事件 ####

|事件|描述|
|---|---|
|transitionend|该事件在 CSS 完成过渡后触发|

#### 其他事件 ####

|事件|描述|
|---|---|
|onmessage|该事件通过或者从对象(WebSocket, Web Worker, Event Source 或者子 frame 或父窗口)接收到消息时触发|
|onmousewheel|已废弃。 使用 onwheel事件替代|
|ononline|该事件在浏览器开始在线工作时触发|
|onoffline|该事件在浏览器开始离线工作时触发|
|onpopstate|该事件在窗口的浏览历史（history 对象）发生改变时触发|
|onshow|该事件当 `<menu>` 元素在上下文菜单显示时触发 onstorage 该事件在 Web Storage(HTML 5 Web 存储)更新时触发|
|ontoggle|该事件在用户打开或关闭 `<details>`元素时触发|
|onwheel|该事件在鼠标滚轮在元素上下滚动时触发|
|DOMMouseScroll|火狐(firefox)支持的绑定鼠标滚轮的事件，并且该事件必须要通过addEventListener()函数来绑定事件|
|DOMContentLoaded|监听文档DOM元素的内容是否加载完成，比onload事件要监听的东西更少，DOM元素加载完毕后就会执行该事件,通过addEventListener()函数来绑定事件|



-----

### DOM查询 ###

#### 获取DOM节点 ####
- `getElementById()` 通过ID获取元素节点，返回一个普通对象 
	- **注意:** ID其实可以不用获取而直接使用,因为ID是具有唯一性的,但是不推荐不获取就直接使用ID，因为以后会很难区分这个变量是哪里来的
- `getElementsByTagName()`  可以根据标签名来获取一组元素节点对象，这个方法会给我们返回一个类数组对象，所有查询到的元素都会封装到对象中，即使查询到的元素只有一个，也会封装到数组中返回
- `getElementsByClassName()` 方法通过类名获取元素节点(IE8及以下版本不支持),返回一个类数组对象
- `getElementsByName()` 方法通过name属性获取元素节点，这个方法主要是获取表单项，返回一个类数组对象
- `quertSelector()` 方法需要一个选择器的字符串作为参数,可以根据一个CSS选择器来查询一个元素节点对象，语法和CSS语法一样，可以多个选择器一起使用，该方法在IE8也可用
	- **注意:**使用该方法总会返回唯一的一个元素，如果满足条件的元素有多个，也只会返回第一个找到的
- `quertSelectorAll()` 方法用法同quertSelector()方法相同
	- **注意:**使用该方法就返回一个类数组对象，类数组对象里包含的所有符号要求的元素对象,即使符合条件的元素只有一个，也会返回类数组

	
#### 获取属性节点 #### 
	- 读取元素的属性节点,使用 元素.属性名 或 元素[属性名] 
	- 修改元素的属性节点,使用 元素.属性名=新值 或 元素[属性名]=新值 
		- **注意:** 读取元素的class属性时必须用className来代替class关键字


#### 获取文本节点 ####
- `innerHTML` 属性可以获取双标签元素内部的html代码，包括子标签,这个属性对于单标签元素(如表单标签)没有意义，返回一个字符串 
- `InnerText` 属性可以获取双标签元素内部的文本内容，它和InnerHTML属性类似，但会自动将HTML标签去除，返回一个字符串 
- `value`属性可以获取单标签元素(如表单标签)内部的内容，同时要向单标签元素写入内容也必须使用value属性，返回一个字符串 
- `nodeValue` 属性通过获取标签内的文本节点的内容来获取元素内部的文本内容(因为文本节点实际是一个标签的子节点，所以需要先找到文本节点，返回一个字符串 


#### 获取元素子节点 #### 
- `childNodes`属性获取元素子节点，该属性会获取包括文本节点的所有子节点，返回一个类数组对象 
- `children` 属性可以获取当前元素的所有子元素，推荐用这个属性，返回一个类数组对象，而且是动态获取
- `firstChild` 属性表示当前节点的第一个子节点，也包括空白文本，返回一个普通对象
- `firstElementChild` 属性获取第一个子元素，返回一个普通对象，但是不兼容IE8，不推荐使用
- `getElementsByTagName()` 方法获取当前节点下一组元素节点，返回一个类数组对象
- 注：
	- 参数值 " * " 返回元素的所有子元素
	- document对象调用该方法，相当于获取整个文档中的元素节点
	

#### 获取父和兄弟节点 #### 
- `parentElement` 属性获取当前节点的父元素(只在IE中可用) 
- `parentNode` 属性获取当前节点的父节点,这是W3C标准的,推荐使用 
- `offsetParent`属性获取到离当前元素最近的开启了定位(除去默认的static)的祖先元素，如果所以的祖先元素都没有开启定位，则会返回body 
- `previousSibling` 属性获取当前节点的前一个兄弟节点
	- **注意:**可能获取空白文本，如果两个元素中间有空白就会获取空白文本节点 
- `previosElementSibling` 属性获取前一个元素，IE8不支持 
- `nextSibiling` 属性表示当前节点的后一个兄弟节点 
- `nextElementSibling` 获取后一个元素，IE8不支持


#### 获取元素节点的内容 ####
- `innerHTML`和`innerText` 属性
	- 这两个属性并没有在DOM标准定义，但是大部分浏览器都支持这两个属性
	- 两个属性作用类似，都可以获取到标签内部的内容，
		- 不同是innerHTML会获取到html标签，而innerText会自动去除标签
	- 如果使用这两个属性来设置标签内部的内容时，没有任何区别的
- `nodeValue` 属性设置或返回指定节点的节点值
- **注**：如果您希望返回元素的文本，请记住文本始终位于文本节点中，并且您必须返回文本节点的值
		element.childNodes[0].nodeValue


#### document对象的其他的属性和方法 ####
- `document.all` 获取页面中的所有元素，相当于document.getElementsByTagName("*");
- `document.documentElement` 获取页面中html根元素
- `document.body` 获取页面中的body元素

### DOM修改 ###


#### 创建元素节点 ####
- `document.createElement()` 方法可以根据标签名创建一个元素节点对象
	- 它需要一个标签名作为参数，将会根据该标签名创建元素节点对象，并将创建好的对象作为返回值返回
			var div=document.createElement("div");

- `document.createTextNode()` 可以根据文本内容创建一个文本节点对象
	- 需要一个文本内容作为参数，将会根据该内容创建文本节点，并将新节点返回
			var divText = doucment.createTextNote("adc");


#### 添加元素节点 ####
- `父节点.appendChild()` 向父节点中添加指定的子节点
	- 要添加子节点之前必须要先有这个子节点，没有就要先创建，并且新加的子节点会自动添加到所有子节点的最后面
- `父节点.insertBefore()` 将一个新的节点插入到旧节点的前边
	- 该方法由父节点调用,传入两个参数(新节点和旧节点),第一个参数必填，第二个参数可选 
			父节点.insertBefore(新节点, 旧节点);
	- 要添加子节点之前必须要先有这个子节点，没有就要先创建，并且如果没有传入第二个参数会自动添加到所有子节点的最后面 
	- 如果子节点不是新创建而是从原有父级节点上调用的，那么在用insertBefore()方法时会先将原有父级节点上的该子节点删除


#### 替换元素节点 ####
- `父节点.replaceChild()` 使用一个新的节点去替换旧节点
	- 要替换子节点之前必须要先有这个新的子节点，没有就要先创建
			父节点.replaceChild(新节点,旧节点)


#### 删除元素节点 ####
- `父节点.removeChild()`
	- 删除指定的子节点
	- 推荐方式：`子节点.parentNode.removeChild(子节点)`



### 元素样式 ###

#### 修改元素样式 ####
- 通过`style`属性修改元素样式
	- 语法：元素.style.样式名 = 样式值	
	**注：**
	- 通过style属性设置的样式都是**内联样式**，而内联样式有较高的优先级，所以通过JS修改的样式往往会立即显示

	- 但是如果在样式中写了!important，则此时样式会有最高的优先级，即使通过JS也不能覆盖该样式，此时将会导致JS修改样式失效

	- 如果CSS的样式名中含有 - ，这种名称在JS中是不合法的比如background-color，需要将这种样式名修改为驼峰命名法，去掉 - ，然后将 - 后的字母大写，如background-color写作backgroundColor，border-top-width写作borderTopWidth

	- 通过JS的style属性设置和读取的都是内联样式，无法读取CSS样式表中的样式(外部样式和嵌套样式)
	
#### 读取元素样式 ####
- `元素.currentStyle.样式名`
	- 它可以用来读取当前元素正在显示的样式，如果当前元素没有设置该样式，则获取它的默认值，如：width返回auto
	- 注：currentStyle**只有IE浏览器支持，其他的浏览器都不支持**
			#box1{
			width: 100px;
			height: 100px;
			}
			
			var box1 = document.getElementById("box1"); //获取box1元素
			alert(box1.currentStyle.width);				//100px
			alert(box1.currentStyle.backgroundColor);	//transparent

- `getComputedStyle()`
	- 获取元素当前的样式，这个方法是window的方法，可以直接使用，但是该方法**不支持IE8及以下的浏览器**
	- 需要两个参数
		- 第一个：要获取样式的元素
		- 第二个：可以传递一个伪元素，一般都传null
	- 该方法会返回一个对象，对象中封装了当前元素对应的样式，可以通过**对象.样式名**来读取样式，如果获取的样式没有设置，则会获取到真实的值，而不是默认值，比如：没有设置width，它不会获取到auto，而是一个长度
			#box1 {
	            width: 100px;
	            height: 200px;
	            background-color: #bfa;
        	}

			var box1 = document.getElementById("box1");
			var objBox1 = getComputedStyle(box1, null);
			alert(objBox1.width);	//100px
	
- **注意:** 通过currentStyle属性和getComputedStyle()方法读取到的样式都是只读的，不能修改，如果要修改必须通过style属性
- **二者的兼容写法**
		function getStyle(obj , name){
			/*
				参数:obj 要获取样式的元素
				    name 要获取的样式名
			*/
			if(window.getComputedStyle){ //这里的getComputedStyle函数实际上是一个对象，如果有则返回true，
						而这里使用window对象调用，是在全局作用域中寻找是否含有这个对象没有则返回false（相当于ie没有该对象），
						而如果不通过window对象调用的话，在局部作用域中调用会找不到这个对象，返回一个undefined
				//正常浏览器的方式，具有getComputedStyle()方法
				return getComputedStyle(obj , null)[name];
			}
			else{
				//IE8的方式，没有getComputedStyle()方法
				return obj.currentStyle[name];
			}
			//当然if的对象也可以反过来，但是如果判断obj.currentStyle有问题在于IE8以上的IE浏览器两种方法都有，
				这样它就会优先使用第一个方法，但是我们推荐优先使用getComputedStyle()

			//简洁写法，三目运算符
			//return window.getComputedStyle?getComputedStyle(obj , null)[name]:obj.currentStyle[name];
			
		}

#### 获取特殊样式 ####
- **注: 以下获取的样式都是只读的,不能够修改**
- `clientWidth` 与 `clientHeight`
	- 这两个属性可以获取元素的可见宽度和高度
	- 这些属性都是不带px的，返回都是一个number类型，可以直接进行计算
	- 会获取元素宽度和高度，包括内容区和内边距
- `offsetWidth` 与 `offsetHeight`
	- 获取元素的整个宽度和高度(内容区，内边距和边框)，返回值也是number类型
- `offsetParent`
	- 可以用来获取当前元素的定位父元素
	- 会获取到离当前元素最近的开启了定位的祖先元素，如果所有的祖先元素都没有开启定位，则返回body
- `offsetLeft` 与 `offsetTop`
	- 获取当前元素相对于其定位父元素的水平偏移量和垂直偏移量
	- **注意：**偏移量的原点是父元素的左上角(left top)，和背景图片的原点相同 
- `window.innerWidth` 与 `window.innerHeight`
	- 可以获取window窗口的内部宽高
	- **注意：**不包括页面的导航栏以及页面滚动条和控制台
- `scrollWidth` 与 `scrollHeight`
	- 可以获取元素整个滚动区域的宽度和高度，如果没有隐藏的部分则等于clientWidth和clientHeight
- `scrollLeft` 与 `scrollTop`
	- 可以获取水平和垂直滚动条滚动的距离
			当满足 scrollHeight - scrollTop == clientHeight，说明垂直滚动条滚动到底了（实际高度 - 滚动高度 == 可视高度）
			当满足 scrollWidth - scrollLeft == clientWidth，说明水平滚动条滚动到底

- 实例
		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Document</title>
		    <script>
				window.onload = function () {
				    var info = document.getElementById("info");
				    var input = document.getElementsByTagName("input");
				    info.onscroll = function () {
				        if (info.scrollHeight - Math.round(info.scrollTop) == info.clientHeight) {	//判断滚动条是否到底
				            input[0].disabled = false;	//checkbox变为可选项
				
				            input[0].onclick = function () {	//勾选checkbox时
				                if (input[0].checked == true) {
				                    input[1].disabled = false;
				                }
				                else{
				                    input[1].disabled = true;
				                }
				            }
				        }
				    }
				}
			</script>

		    <style>
		        #info{
		            width: 200px;
		            height: 300px;
		            background-color: #bbffaa;
		            overflow: auto;
		        }
		    </style>
		</head>
		<body>
		    <div id="box">
		        <p id="info">亲爱的用户，请仔细阅读以下协议，如果你不仔细阅读你就别注册
					</p>
		            <input type="checkbox" name="c" id="check" disabled="disabled">我已阅读
		            <input type="button" value="注册" disabled="disabled" >
		    </div>
		</body>
		</html>