---
title: less
date: 2021-11-15 20:13:01
tags:
 - less
categories: less
---

# less #
**less 是一种动态样式语言,属于 CSS 预处理器的范畴,它拓展了 CSS 语言**,其余的 CSS 预处理器有 sass 和 stylus 等 less 增加了变量,MIxin,函数等特性,使 CSS 更易维护和扩展,less 既可以在客户端上运行,也可以借助 node.js 在服务端 运行
<!-- more -->

## less 的注释 ##

less 中的注释和 CSS 一样有两种单行注释 `//`，多行注释 `/**/`

区别：以 `//` 开头的注释不会被编译到 CSS 文件中，而通过 `/**/` 包裹的注释才会被编译在 CSS 文件中

## less 的变量 ##
- less 中使用`@`来申明和使用一个变量，所有变量声明方法相同

具体用法为: `@变量名:属性值`
		
		@pink:pink //在以后的使用中就可以用@pink 来代替 pink

变量作为**普通属性值**使用，直接用这个变量:`@变量名`
变量作为**选择器或者属性名**来使用，需要在变量两边加上{}，`{selector}`
变量作为` url`，使用是也需要在两边加上{}: `{url}`

变量的加载会有延迟效果,当整个文件的所有东西被加载完时才会将变量赋值给对应的属性 

变量运用的时候会现在自身的作用域里面找到是否定义了该变量,如果定义了就直接用自身作用域中的,如果没有才会在外层逐层寻找,如果在最外层都没有找到对应的变量就会报错

		@var: 0;
		
		.class {
		    @var: 1;
		    .brass {
		        @var: 2;
		        width: @var;
		        @var: 3;
		    }
		    height: @var;
		}
		
		/*
		      最终的结果为	height:1;	width:3;
		      变量在最后赋完所有值才会赋值给属性,
				而且这个赋值也是只针对自身的作用域
		  */

## less 的导入 ##
在 less 中使用@import 关键字能够将需要的文件中的代码导入到当前的 less 文件中

- 导入 less 文件可一直接导入

		@import "a.less";

- 导入 CSS 文件时需要申明这是 CSS 文件

		@import (CSS) "b.css";

## 嵌套规则 ##
### 基本嵌套规则 ###
- less 中可以在父选择器中包含有子选择器,在转换为 CSS 文件的时候会自动用空格来隔开


		.father {
		    
		    .child {
		
		    }
		}
		
		/*
		     通过上方的写法可以分别对父元素和子元素进行样式设置
		   */

### &符号的使用 ###
**&符号能取消默认的嵌套关系的中的空格**，从而从父子关系变成兄弟关系，这个兄弟关系是本身拓展出的一些兄弟关系,如伪类选择器等，可以理解为 & 符号就是这个选择器本身

		.father {
		
		    .child {
		        background-color: red;
		
		        &:hover {
		            background-color: pink;
		        }
		    }
		}

		//相当于
		.father .child {
		  background-color: red;
		}
		.father .child:hover {
		  background-color: pink;
		}


## less 的运算 ##
在 less 中可以进行加减乘除的运算

注意:在 less 的计算中计算的双方只需要一方带单位,最后再计算的时候单位会保留下来加在新值的后面

		.box {
		  widht: (100+100px);
		}


## less 的混合 ##

**混合就是将一系列属性从一个规则集引入到另外一个规则集的方式**，相当于直接复制

###  普通混合 ###
把样式中共同的代码单独提出来在最上方,单独的用一个类名来定义,然后在下面输入的时候通过 `.类名/;` 来调用

		.mix {
		    //不加()是普通混合,会被编译到CSS文件中
		    width: 100px;
		    height: 100px;
		    background-color: red;
		}
		
		.father {
		    width: 200px;
		    height: 200px;
		
		    .child1 {
		        .mix; //调用混合样式
		    }
		
		    .child2 {
		        .mix;
		    }
		}



### 不带输出混合 ###
不带输出混合与普通混合最大的区别就是：不带输出混合不会编译到 css 文件中，而普通混合则会

		.mix() {
		    //不加()是普通混合,会被编译到CSS文件中
		    width: 100px;
		    height: 100px;
		    background-color: red;
		}
		
		.father {
		    width: 200px;
		    height: 200px;
		
		    .child1 {
		        .mix(); //调用混合样式
		    }
		
		    .child2 {
		        .mix();
		    }
		}

### 带参数的混合 ###
混合的参数也是通过变量使用的形式来定义的，混合中加参数的用法和函数类似，为了方便记忆可以理解为函数，但是不是函数，同时这个参数还可以有默认的值，默认值的定义也是和变量的定义相同
		
		.mix(@w: 10px, @h: 10px, @c: pink) {
		    width: @w;
		    height: @h;
		    background-color: @c;
		}
		
		.father {
		    width: 200px;
		    height: 200px;
		
		    .child1 {
		        .mix(100px, 100px, red);
		    }
		
		    .child2 {
		        .mix(50px, 50px, black);
		    }
		}
如果想对上述单个属性赋值，而其他属性使用默认值的话，可使用命名参数混合

### 命名参数混合 ###
在实参传递给形参值的时候可以不用按照顺序进行传递，而是直接通过参数的指定进行传参，这样就能够实现当只想传递某些参数而不是所有参数的时候参数的值不产生混乱

实参传入命名参数的时候和变量定义的时候是一样的

		.mix(@w: 10px, @h: 10px, @c: pink) {
		    width: @w;
		    height: @h;
		    background-color: @c;
		}
		
		.father {
		    width: 200px;
		    height: 200px;
		
		    .child1 {
		        .mix(100px, 100px, red);
		    }
		
		    .child2 {
		        .mix(@c:black);
		    }
		}


### 匹配模式 ###

用一些专门的标识符放在形参的首位用做匹配，注意**这个是标识符不用@符号**，当使用的时候会根据传入的第一个参数，匹配到那个，就使用哪一个样式

		.float(l, @w) {
		    float: left;
		    width: @w;
		}
		
		.float(r, @w) {
		    float: right;
		    width: @w;
		}
		
		.box1 {
		    height: 200px;
		    background: green;
		    .float(l, 200px);
		}
		
		.box2 {
		    width: 300px;
		    height: 200px;
		    background: green;
		    .float(r, 200px);
		}

### arguments 变量 ###
**arguments 相当于是类中所有实参的集合**，其作用和 js 中的 arguments 类似 
这个变量是 less 已经设置了的,可以直接调用它来使用,调用它的时候它包含了所有传入的实参,同时每个实参是通过空格隔开的

		.border(@size,@style,@color) {
		  border: @arguments;
		}
		div {
		  width: 200px;
		  height: 200px;
		  .border(1px, solid, #000);
		}

注意:和 js 中不一样的是这个属性虽然保留着所有实参但是在命名类的时候还是需要写入对应的形参，不然会出现报错


## less 的继承 ##
less 的继承性能上高于 less 的混合,但是灵活性弱于混合,继承不支持参数的形式,同时后面也不加(),继承的类是需要被编译到 CSS 文件中的

less 的继承用关键词 `&:extend()` 函数来实现，下面是一种用法

		.jicheng{
		    width: 100px;
		    height: 100px;
		    background: red;
		}
		.box:extend(.jicheng){
		    border: solid 1px black;
		}

		// 相当于
		.jicheng,
		.box {
		  width: 100px;
		  height: 100px;
		  background: red;
		}
		.box {
		  border: solid 1px black;
		}

同时也可以继承所有状态（如伪类选择器），`name:extend（继承类名 all）{}`

		.jicheng{
		    width: 100px;
		    height: 100px;
		    background: red;
		}
		.jicheng:hover{
		    background: black;
		}
		.box:extend(.jicheng){
		    border: solid 1px black;
		}
		.box2:extend(.jicheng all){
		    border: solid 1px black;
		}

		//相当于
		.jicheng,
		.box,
		.box2 {
		  width: 100px;
		  height: 100px;
		  background: red;
		}
		.jicheng:hover,
		.box2:hover {
		  background: black;
		}
		.box {
		  border: solid 1px black;
		}
		.box2 {
		  border: solid 1px black;
		}


## less 的避免编译 ##
在 less 中如果想要一些值不被运算想要原封不动的变成 CSS 文件,可以用 `~"值"`的方式直接将值原封传递给 CSS 文件
		
		* {
		  margin: ~"calc(100px + 100)"; //calc()是CSS中本来就有的计算形式的函数
		}