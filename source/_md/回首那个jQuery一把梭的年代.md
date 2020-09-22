## 使用

在页面中引入jQuery有多种方法，最常用的方法就是下载jQuery库到本地和使用公共CDN。jQuery 库是一个 JavaScript 文件，可以直接使用`script`标签引入到html页面中。

```html
<head>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.js"></script>
</head>
```

另外，现在的jQuery也支持在node上下载和使用。

```js
npm install jquery
yarn add jquery
```

[下载]:(https://jquery.com/download/)

## 语法

jQuery简化了原生JS对DOM的操作，语法也与原生JS不尽相同。jQuery 语法是通过选取 HTML 元素，并对选取的元素执行某些操作。

基础语法： $(selector).action()

* 美元符号定义 jQuery
* 选择符（selector）"查询"和"查找" HTML 元素
* jQuery 的 action() 执行对元素的操作

示例:

* `$(this).hide()` - 隐藏当前元素
* `$("p").hide()` - 隐藏所有 <p> 元素
* `$("p.test").hide()` - 隐藏所有 class="test" 的 <p> 元素
* `$("#test").hide()` - 隐藏 id="test" 的元素

> jQuery 使用的语法是 XPath 与 CSS 选择器语法的组合。

### 文档就绪函数

文档就绪函数是问了防止jQuery在DOM没有加载完之前就开始运行的一个函数，它通常是这样的：

```js
$(document).ready(function() {
    // code
})
```

如果在文档没有完全加载之前就运行函数，操作可能失败。下面是两个具体的例子：

* 试图隐藏一个不存在的元素
* 获得未完全加载的图像的大小

文档就绪函数还有一个简洁的写法，效果完全一样。

```js
$(function() {
    // code
})
```

原生JS也有类似的入口函数：

```js
window.onload = function () {
    // code
}
```

jQuery 入口函数与 JavaScript 入口函数的区别：

* jQuery 的入口函数是在 html 所有标签(DOM)都加载之后，就会去执行。
* JavaScript 的 window.onload 事件是等到所有内容，包括外部图片之类的文件加载完后，才会执行。

<p style="text-align: center">load和ready区别<p>

|          | window.onload()                                | $(document).ready()                     |
| -------- | ---------------------------------------------- | --------------------------------------- |
| 执行时机 | 必须等待网页加载完才能执行（包括图片等）       | 只需等待网页中的DOM结构加载完毕就能执行 |
| 执行次数 | 只能执行一次，如果第二次，那么第一次就会被覆盖 | 可以执行多次，多次都不会被覆盖          |
| 简写方式 | 无                                             | $(function() {  <br> // code <br> })    |

## 选择器

jQuery 中所有选择器都以美元符号开头：`$()`。选择器基于元素的 id、类、类型、属性、属性值等"查找"（或选择）HTML 元素。 它基于已经存在的 CSS 选择器，除此之外，它还有一些自定义的选择器。

## 时间

jQuery 是为事件处理特别设计的。

