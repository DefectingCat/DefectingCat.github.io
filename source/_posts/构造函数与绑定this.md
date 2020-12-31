---
title: 构造函数与绑定this
date: 2020-12-31 09:04:40
tags: JavaScript
categories: 实践
url: constructor-and-bind-this
index_img: /images/构造函数与绑定this/2020-12-31-10-11-54.webp
---

## 丢失this

this 是整个 JavaScript 语言里最令人头疼的特性。在 JavaScript 中，this 是动态的，也就是说它在运行时是变化的。也正因这一特性，this 的变化难以预料，不经意间就会发生令人意外的结果。

先来看一个最基本的例子。我们有一个很智能的 test 函数，它有一个 age 属性和一个 sayAge 方法：

```js
let test = {
    age: 18,
    sayAge: function () {
        console.log(`hi, ${this.age}`);
    }
}
```

在正常情况下，sayAge 方法里的 this 应该正确指向这个 test 对象：

```js
test.sayAge()
// 18
```

但是在某些不正常的情况下，例如`setTimeout()`方法，由于它的特殊性，会导致 this 的指向不正确。

```js
setTimeout(test.sayAge, 0);
// hi, undefined
```

这时候的 this 就会丢失对 test 对象的链接。这是因为`setTimeout()`调用的代码运行在与所在函数完全分离的执行环境上，它只获取到了函数体，而函数和 test 对象分开了。这就会导致 this 指向了全局对象。

### 如何解决

1. 使用一个包装函数；
2. 使用`bind()`方法。

其他也有很多情况会导致 this 的丢失，包括`bind()`方法都不是本篇主要研究的。我们主要来看下使用函数包装的方法。

使用一个函数包装下的方法非常简单：使用一个匿名的函数作为`setTimeout()`异步函数，在匿名函数内就将对象的方法执行。这样，无论`setTimeout()`的异步函数是在什么环境下执行的都能获取到正确的值了，因为它已经执行过了。

```js
setTimeout(() => { test.sayAge() }, 0);
// hi, 18
```

不过这种方法有个缺点，那就是在`setTimeout()`延迟期间，如果 test 对象的属性值有变动，那么`setTimeout()`就不能输出最新的值。所以`bind()`方法是更好的解决方案。

## 构造函数

还有一种情况就是构造函数，构造函数也是用来创建对象的，而它也能够直接添加一个带有 this 的方法。创建后的对象实例也有同样的问题。但是构造函数有更加优雅的解决方案。

### 箭头函数

往往看到箭头函数想到的就是它非常适合匿名函数，并且没有那么烦人的 this 。

箭头函数只是没有自己的 this，它会将 this 当作一个普通变量，向**上层作用域去搜索**。也就是说，箭头函数是继承作用域中的 this 的。这就解释了这里的箭头函数为什么能够正确找到 this。

举个例子，我们都知道当正常情况下闭包的返回会丢失对象的 this：

```js
let test = {
    age: 18,
    sayAge: function () {
        return function () {
            console.log(this.age);
        }
    }
}
```

这里的`test.sayAge()()`必然不能正确的找到 this 的指向。而如果我们将 this 当作一个变量，将其的值传递给一个封闭的变量 that，闭包就能正常工作啦：

```js
let test = {
    age: 18,
    sayAge: function () {
        let that = this
        return function () {
            console.log(that.age);
        }
    }
}
```

这样返回`test.sayAge()()`便正常的找到 this 的值。

而我们的箭头函数就是没有自己的 this，它只会把 this 当作一个变量在作用域中寻找。所以在闭包里用箭头函数也能正确找到 this：

```js
let test = {
    age: 18,
    sayAge: function () {
        return () => {
            console.log(this.age);  // this 当作变量在上层作用域中找到啦
        }
    }
}

test.sayAge()()  // 18
```

我们的 class 也是同理，`sayAge = ()=>{console.log(this.age);}`是在作用域中找到正确的this指向的。

同样的，对于`setTimeout`方法，闭包的方式也能解决，因为它和包装一层同理，并且解决了延迟的问题。

### 构造函数的“优雅”

首先我们请来一位构造函数：

```js
function Test(age) {
    this.age = age;
    this.sayAge = function () {
        console.log(`hi, ${this.age}`);
    }
}
```

这是一个很常见的构造函数，他在内部为每个实例创建了一个方法。这个方法是常规的一个函数，所以基于这个构造函数所创建的实例也会遇到同样的丢失 this 的问题。

根据上述的箭头函数的示例，只要在作用域链中使用箭头函数，this 就能在作用域链上层被轻松找到，并正确指向。

```js
function Test(age) {
    this.age = age;
    this.sayAge = () => {
        console.log(`hi, ${this.age}`);
    }
}
```

因为构造函数本身就是闭包的一种体现（实例方法得在构造函数内创建），回顾下构造函数的 [内部原理](https://www.defectink.com/defect/javascript-object-oriented-programming.html#%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86)，一个构造函数在创建实例的时候，会在函数内部隐式的声明一个 this 对象，有了 this 这个对象之后，函数的作用域赋给新对象（所以 this 指向了这个对象）。最后再隐式的 return 出这个对象给实例。

```js
function Make() {
    // this = {
    	// name : 'xfy'
	// };
    this.name = 'xfy';
    // return this;
}
```

构造函数内的方法都以闭包的方式 return 到实例上了，所以在**构造函数内部**给实例所创建的方法（箭头函数）根据闭包的原理，在作用域链中继承了 this，所以在实例中使用这个方法时，this 不会那么轻松的丢失。

但是，构造函数真的足够“优雅”吗？

当然不够，[构造函数的问题](https://www.defectink.com/defect/javascript-object-oriented-programming.html#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%9A%84%E9%97%AE%E9%A2%98) 就在于不能在构造函数内部为实例创建方法。以这种方式创建函数，会导致不同的作用域链和标识解析符。但创建Function新实例的机制任然是相同的。所以导致由构造函数创建的实例的方法只是同名而不相等。也就是说，它会为每个实例都创建一个同名而不相同的方法：

```js
let one = new Test(18);
let two = new Test(18);
console.log(one.sayAge === two.sayAge);	// false
```

于是在 ECMAScript 2015 之前，我们都是将实例的方法创建在构造函数的 prototype 对象上：

```js
Test.prototype.sayAge = function () {
    console.log(`hi, ${this.age}`);
}
```

但是这样所创建的方法就无法继承构造函数内部的作用域链了。

### class 的优雅

`class`关键字为实例创建的方法都是写在`class`的大括号内的，当然这只是个写法。

```js
class Test {
    constructor(age) {
        this.age = age;
    }

    sayAge() {
        console.log(`hi, ${this.age}`);
    }
}

let one = new Test(18);
let two = new Test(18);
console.log(one.sayAge === two.sayAge);	// true
```

它为实例所创建的方法都是完全相同的，也就是说这个方法是在我们类的 prototype 这个对象上的，事实也确实如此。

而当我们在类的内部创建一个箭头函数时，它便不会在 prototype 这个对象上创建方法，反而是和传统构造函数一样。

```js
class Test {
    constructor(age) {
        this.age = age;
    }

    sayAge = () => {
        console.log(`hi, ${this.age}`);
    }
}

let one = new Test(18);
let two = new Test(18);
console.log(one.sayAge === two.sayAge);	// false
```

~~某咸鱼起初还以为 class 可以既能在 prototype 对象上创建方法，也能继承作用域链~~

## 总结

* 包装函数是一个不完美的解决 this 丢失的方法；
* 箭头函数没有自身的 this，它会在作用域链中搜索；
* 闭包出一个箭头函数也可以解决`setTimeout`导致的 this 丢失问题；
* 构造函数不够优雅；
* 在 class 中创建一个箭头函数的方法时，它就不会在 prototype 对象上创建这个方法了；

所以 class 也不够优雅。

## 推荐

* [Class 字段](https://zh.javascript.info/class#class-zi-duan)