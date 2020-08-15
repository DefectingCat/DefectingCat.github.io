ECMAScript才是JavaScript的核心，在浏览器中，BOM无疑才是真正的核心（浏览器对象模型：BrowerObjectModel)。多年来，缺少事实上的规范导致BOM既有意思又有问题，因为浏览器提供商会按照各自的想法去随意拓展它。于是，浏览器之间共有的对象就成为了事实上的标准。

## window对象

BOM的核心对象是window，它表示浏览器的一个实例。在浏览器中，window对象有双重角色，它既是通过JavaScript访问浏览器的一个接口，又是ECMAScript规定的Global对象。

### 全局作用域

由于window在浏览器环境中扮演着Global对象，所以在全局作用域中声明的变量、函数都会变成window对象的属性和方法。（拥有块级作用域的声明则不会）

```js
var age = 18;
function sayAge() {
    console.log(this.age);
}
window.age;
sayAge();
window.sayAge();
```

虽然使用`var`声明的全局变量会成为window的属性，但是经过声明的变量是无法使用delete操作符删除的，而在window对象上直接定义的属性是可以删除的。

```js
let test = 123;
delete test; // false;

window.xfy = 'xfy';
delete window.xfy; // true;
```

通过`var`声明的变量的属性有一个名为'configurable'的特性。这个特性的值被设置为`false`，并且无法更改。

> IE8以及更早的版本在遇到使用delete删除window属性的时候都会抛出错误。

尝试未经声明的变量会抛出错误，但是可以通过查询window对象知道由`var`声明的变量是否存在；

```js
let t = test; // test id not defined

let t = window.test // 不会抛出错误，因为这是一次属性查询
```

### 窗口关系及框架

如果页面包含框架，则每个框架都有自己的window对象，并且保存在frames集合中。在frames集合中，可以通过数值索引（从0开始，从左至右，从上到下）或者框架名称来访问相应的window对象。每个window对象都有一个name属性，其中包含框架名称。

```html
    <frameset rows="160,*">
        <frame src="frame1.html" name="topFrame">
            <frameset cols="50%,50%">
                <frame src="frame2.html" name="leftFrame">
                <frame src="frame3.html" name="rightFrame">
            </frameset>
    </frameset>
```

上述代码的框架集看上去像这样，对于引用框架可以使用如下方法：

```js
window.frames[0] // 引用第一个
window.frames["rightFrame"] // 引用指定name的
top.frames[0]   // 使用top引用
top.frames["topFrame"]  // 使用top引用
```

<escape> 
<table style="text-align: left">    
  <tr>
  <td colspan="2">
window.frames[0]<br/>
window.frames["topFrame"]<br/>
top.frames[0]<br/>
top.frames["topFrame"]<br/>
frames[0]<br/>
frames["topFrame"]<br/>
</td>
</tr>
  <tr>
  <td>
window.frames[1]<br/>
window.frames["leftFrame"]<br/>
top.frames[1]<br/>
top.frames["leftFrame"]<br/>
frames[1]<br/>
frames["leftFrame"]<br/>
  </td>
  <td>
window.frames[2]<br/>
window.frames["rightFrame"]<br/>
top.frames[2]<br/>
top.frames["rightFrame"]<br/>
frames[2]<br/>
frames["rightFrame"]<br/>
  </td>
  </tr>
</table>   
</escape>

使用window的属性frames可以方便的去引用指定的框架，不过使用top将更好。top对象始终执行最外层的框架，也就是浏览器窗口。使用它类似于使用绝对路径。而window是相对的，指的都是那个框架的特定实例，而非最高层框架。

与top相对的是parent。parent始终指向当前框架的直接上层框架。在某些情况下，parent等于top；在没有框架的情况下parent一定等于top（都等于window）。

```html
<frameset rows="100,*">
    <frame src="frame.htm" name="topFrame">
    <frameset cols="50%,50%">
        <frame src="anotherframe.htm" name="leftFrame">
        <frame src="anotherframeset.htm" name="rightFrame">
    </frameset>
</frameset>
```

在这个例子里，在rightFrame中又嵌入了另外两个frame，分别叫redFrame和blueFrame。

```html
<frameset cols="50%,50%">
    <frame src="red.htm" name="redFrame">
    <frame src="blue.htm" name="blueFrame">
</frameset>
```

当浏览器加载完第一个框架集以后，会继续将第二个框架集加载到rightFrame中。如果代码位于redFrame或blueFrame中，那么parent就等于rightFrame。如果代码位于topFrame中，那么parent就等于top，因为topFrame的直接上层就是最外层的框架。

除非最高层窗口用`window.open()`打开，否则其window对象的name属性不会包含值。

与框架有关的最后一个对象时self，它始终指向window。实际上，self和window对象可以互换使用。引入self对象的目的只是为了与top和parent对象对应起来，因此它不格外包含其他值。

所有的这些对象都是window的属性，都可以通过`window.parent`、`window.top`等形式来访问。同时也意味着可以将不同层级的window对象连缀起来，例如`window.parent.parent.frames[0]`。

