---
title: jQuery选择器
date: 2021-10-19 10:55:03
tags:
 - jQuery
categories: jQuery
---

# jQuery选择器 #
- jQuery 选择器允许对 HTML 元素组或单个元素进行操作。
- jQuery 选择器基于元素的 id、类、类型、属性、属性值等"查找"（或选择）HTML 元素。 它基于已经存在的 CSS 选择器，除此之外，它还有一些自定义的选择器。
- jQuery 中所有选择器都以美元符号开头：$()。
- jQuery选择器不是同时执行，而是顺序执行
<!-- more -->

## 基本选择器 ##

	$("#test")             　　　　   选择id值为test的元素，id值是唯一的所以返回单个元素。

	$("div")               　　　　   选择所有的div标签元素，返回div元素数组 

	$(".myclass")          　　　　   选择使用myclass类的css的所有元素 

	$("*")                 　　　　   选取所有元素。

	$("#test,div,.myclass") 		 选取多个元素。(并集)

## 层次选择器 ##

        $("div span") 	选取 < div > 里的所有 < span > 元素

        $("div >span") 	选取 < div > 元素下元素名是 < span > 的子元素

        $("#one +div") 	选取id为one的元素的下一个 < div > 同辈元素 等同于$("#one").next("div")

        $("#one~div") 	选取id为one的元素的元素后面的所有 < div > 同辈元素 等同于$("#one").nextAll("div")

        $("#one").siblings("div") 	获取id为one的元素的所有 < div > 同辈元素（ 不管前后）

        $("#one").prev("div") 	获取id为one的元素的前面紧邻的同辈 < div > 元素

        所以 获取元素范围大小顺序依次为：

        $("#one").siblings("div") > $("#one~div") > $("#one +div") 或是

        $("#one").siblings("div") > $("#one").nextAll("div") > $("#one").next("div")

## 基本过滤选择器 ##

        $("div:first") 选取所有 < div > 元素中第1个 < div > 元素

        $("div:last") 选取所有 < div > 元素中最后一个 < div > 元素

        $(":not(.myClass)") 选取class不是myClass的元素

        $(":even") 选取索引是偶数的元素(索引从0开始)

        $(":odd") 选取索引是奇数的元素(索引从0开始)

        $(":eq(index)") 选取索引等于index的元素

        $(":gt(index)") 选取索引大于index的元素

        $(":lt(index)") 选取索引小于index的元素

        $(":header") 过滤掉所有标题元素， 例如： h1、 h2、 h3等

        $(":animated") 选取正在执行动画的元素

        $(":focus") 选取当前获取焦点的元素

- 例子：选取一堆div元素中的**第二个和第三个div元素**， `$("div:gt(0):lt(2)")` ，因为jQuery选择器不是同时执行，而是顺序执行，`div:gt(0)`后此时选中的是整个div中第2个元素，而 `:lt(2)` 是基于`div:gt(0)`执行后的DOM元素集，当然也能写成 `$("div:lt(3):gt(0)")`

## 内容过滤选择器 ##

        $("div:contains('Name')") 选取所有 < div > 中含有 'Name'
        文本的元素

        $("div:empty") 选取不包含子元素（ 包括文本元素） 的 < div > 空元素

        $("div:has(p)") 选取所有含有 < p > 元素的 < div > 元素

        $("div:parent") 选取拥有子元素的（ 包括文本元素） < div > 元素

## 可见性过滤选择器 ##

        $("div:hidden") 选取所有不可见的 < div > 元素

        $("div:visible") 选取所有可见的 < div > 元素

## 属性过滤选择器 ##

        $("div[id]") 选取所有拥有属性id的元素
        $("input[name='test']") 选取所有的name属性等于 'test'的 < input > 元素

        $("input[name!='test']") 选取所有的name属性不等于 'test'的 < input > 元素

        $("input[name^='news']") 选取所有的name属性以 'news'开头的 < input > 元素

        $("input[name$='news']") 选取所有的name属性以 'news'结尾的 < input > 元素

        $("input[name*='news']") 选取所有的name属性包含 'news'的 < input > 元素

        $("div[title|='en']") 选取属性title等于 'en'或以 'en'为前缀(该字符串后跟一个连字符 '-') 的 < div > 元素
        
        $("div[title~='en']") 选取属性title用空格分隔的值中包含字符en的 < div > 元素

        $("div[id][title$='test']") 选取拥有属性id, 并且属性title以 'test'结束的 < div > 元素

## 子元素过滤选择器 ##

        $("div .one:nth-child(2)") 选取class为 'one' 的 < div > 父元素下的第2个子元素

        $("div span:first-child") 选取每个 < div > 中的第1个 < span > 元素

        $("div span:last-child") 选取每个 < div > 中的最后一个 < span > 元素

        $("div button:only-child") 在 < div > 中选取是唯一子元素的 < button > 元素

## 表单对象属性过滤选择器 ##

        $("#form1 :enabled") 选取id为 'form1'的表单内所有可用元素

        $("#form2 :disabled") 选取id为 'form2'的表单内所有不可用元素

        $("input :checked") 选取所有被选中的 < input > 元素
        
        $("select option:selected") 选取所有的select 的子元素中被选中的元素

## 表单选择器 ##

        $(":input")  选取所有 < input > , < textarea > , < select > 和 < button > 元素

        $(":text")  选取所有的单行文本框

        $(":password")  选取所有的密码框

        $(":radio")  选取所有单的选框

        $(":checkbox")  选取所有的多选框

        $(":submit")  选取所有的提交按钮

        $(":image")  选取所有的图像按钮

        $(":reset")  选取所有的重置按钮

        $(":button")  选取所有的按钮

        $(":file")  选取所有的上传域

        $(":hidden")  选取所有不可见元素