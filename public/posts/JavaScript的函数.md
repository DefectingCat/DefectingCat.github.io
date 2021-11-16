---
title: JavaScript 的函数
index_img: /images/JavaScript的函数/index.webp
date: 2020-08-07 11:26:10
tags: JavaScript
categories: 笔记
url: function-of-javascript
---

函数表达式是JavaScript中一个强大同时容易令人困惑的特性。

定义函数的方式有两种：函数声明和函数表达式。

函数声明首先是`function`关键字，其后是函数的名字，这就是指定函数名字的方式。

```js
// 函数声明
function test() {
    console.log('Hi, there');
}
```

关于函数声明，其一个重要特征就是**函数声明体提升**。它和用`var`声明提升类似，但他是整体提升，所以可以在声明前使用。

```js
// 函数声明提升
test();
function test() {
    console.log('Hi, there');
}
```

函数表达式创建函数有一点不同，它类似于声明一个变量，使用`var`或者`let`来声明一个函数体。

`let`关键字后的变量名就是函数的名字，而函数后没有名称，这个函数称为匿名函数。可以理解为将这个匿名函数赋值给了这个变量。

```js
// 函数表达式
let test = function () {
    console.log('Yo, there');
}
```

函数表达式与其他表达式一样，需要先声明才能使用。尽管`var`创建的变量会声明提升，但是赋值并不会提升。

```js
test();		// 函数还未声明
let test = function () {
    console.log('something...');
}
```

在早期的环境里，函数声明和if语句可能还不能工作的和契合。不过现在多数浏览器与运行环境都能正常执行如下代码：

```js
if (1) {
    function hi() {
        console.log('hi');
    }
} else {
    function hi() {
        console.log('yo');
    }
}
```

我的猜测可能是和函数声明提升有关，因为js没有块级作用域，所以在if语句里根据条件的函数声明都提升了，导致就算条件满足，最后声明的还是下面的函数声明。

如果真的有不能运行的环境，可以做这样的尝试。因为提前声明了变量，在将匿名函数赋值给变量，所以就不存在函数声明提升这个特性了。

```js
let hi;
if (1) {
    hi = function () {
        console.log('hi');
    }
} else {
    hi = function () {
        console.log('yo');
    }
}
```

## 递归

递归函数是在一个函数通过名字调用自身的情况下构成的：

```js
function add(num) {
    if (num <= 1) {
        return 1;
    }
    return num + add(num - 1);
}
```

这是一个经典的递归实例，但是如果将函数名更换一下。并将前一个函数名给解除引用，就会导致函数出错。这是因为函数内部的递归是通过函数名来引用这个函数的。如果更换了函数名，就会导致这种错误。

```js
function add(num) {
    if (num <= 1) {
        return 1;
    }
    return num + add(num - 1);
}

let minus = add;
add = null;
console.log(minus(5));

// return num + add(num - 1);
//                ^
// TypeError: add is not a function

```

但这并不影响递归，可以换种方式来继续引用函数自身。`arguments.callee`就是指向正在执行的函数的指针，因此可以用它来实现对函数递归的调用。从而与函数名拜托关系。

```js
function add(num) {
    if (num <= 1) {
        return 1;
    }
    return num + arguments.callee(num - 1);
}

let minus = add;
add = null;
console.log(minus(5));
```

但`arguments.callee`不能在strict下使用。不过可以通过命名函数表达式来达到相同的效果。

在使用函数表达式时，使用小括号可以为函数体添加一个任然有效的名称。再将这个函数赋值给这个变量，无论函数怎么更换引用，函数名任然有效。这种方式再严格模式和非严格模式都行得通。

```js
let add = (function a(num) {
    if (num <= 1) {
        return 1;
    }
    return num + a(num - 1);
})
```

## 闭包

闭包就是在一个函数的内部返回另一个函数，返回的函数将还能访问外部函数的AO。

在compare这个函数里返回了另一个内部函数（一个匿名函数），这个匿名函数使用了compare函数的`prep`参数。即使这个函数被返回到了外部使用，依然能访问到prep变量。这涉及到作用域链的细节。

当一个函数运行时（被调用时），会创建一个执行环境（execution context）及相应的作用域链，然后使用arguments和其他参数的值来初始化函数的活动对象（Activation Object）。这个AO会随着作用域链，链给内部的函数，并使内部函数可以访问外部函数的变量。

[JavaScript的作用域与链](https://www.defectink.com/defect/javascript-scope-and-chain.html)

```js
function compare(prep) {
    return function (obj1, obj2) {
        let o1 = obj1[prep];
        let o2 = obj2[prep];
        if (obj1[prep] < obj2[prep]) {
            return -1;
        } else if (obj1[prep] > obj2[prep]) {
            return 1;
        } else {
            return 0
        }
    }
}
```

当创建compare函数时，会创建一个包含全局对象的作用域链，这个作用域链被保存在内部的[[scope]]属性中。当调用`compare()`函数时，会为函数创建一个执行环境，然后赋值[[scope]]属性中的对象构建起执行环境的作用域链。

作用域链本质上是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。

无论什么时候访问函数中的一个变量时，就会从作用域链中搜索具有相应名字的变量。一般来说，当函数执行完后，局部活动对象就会被销毁，内存中仅保留全局作用域（全局执行环境的活动对象GO）。

但闭包的情况有所不同，当外部函数执行完后，其活动对象也不会被销毁，内部函数依然引用着外部函数的作用域链，。在将内部函数返回后，其执行环境的作用域链会被销毁，但是它的活动对象依然会留在内存中，直到匿名函数被销毁。

> 由于闭包会携带着包含它的函数的作用域，所以会占用更多的内存。虽然2020年不差内存，且像v8等js引擎会尝试回收闭包的内存，但还是推荐谨慎使用。

### 闭包与变量

作用域链的机制以及没有块级作用域的特性引出了一个副作用，即闭包只能取得外部函数AO中变量任何最后一个值。

```js
function cycle() {
    let arr = [];
    for (var i = 0; i < 10; i++) {
        arr[i] = function () {
            console.log(i);
        }
    }
    return arr;
}
let test = cycle();
test[1]();
```

数组随着for循环将函数赋值到自身，变量i会随着循环的增加而增加。但是函数被赋值时并没有执行，等到函数被返回后在外部被执行时，访问到的i已经是AO里的10了。

可以使用立即执行函数，让i变量成为实参传入数组的函数内，因为**参数是按值传递的**，这样在外部执行时，每个匿名函数中的变量都有一个副本。

立即执行函数在执行后会被销毁，但是它的AO依然被内部的函数所引用。所以对应次数循环的函数内j就对应立即执行函数AO中的j，且每个立即执行函数AO中的j都对应i，因为每次的立即执行函数都不同。

可以使用立即执行函数来为内部的匿名函数再封装一个AO来解决此问题。

```js
function cycle() {
    let arr = [];
    for (var i = 0; i < 10; i++) {
        (function (o) {
            arr[o] = function () {
                console.log(o);
            }
        })(i);
    }
    return arr;
}
```

```js
function cycle() {
    let arr = [];
    for (var i = 0; i < 10; i++) {
        arr[i] = (function (o) {
            return function () {
                console.log(o);
            }
        })(i);
    }
    return arr;
}
let test = cycle();
```

或者直接使用let来声明变量，产生块级作用域，在根本上解决问题。

```js
function cycle() {
    let arr = [];
    for (let i = 0; i < 10; i++) { 
            arr[i] = function () {
                console.log(i);
            }
    }
    return arr;
}
```

### 关于this对象

在闭包中使用this对象可能会出现一些小问题。由于闭包返回的匿名函数是在外部执行的，所以匿名函数的执行环境具有全局性，因此它的this对象通常指向window。

```js
global.name = 'xfy';
// window.name = 'xfy';
let obj = {
    name: 'xxxfy',
    age: 18,
    say: function () {
        return function () {
            console.log(this.name);
        }
    }
}

obj.say()();
```

这个例子在非严格模式下返回的是全局对象的属性。那为什么匿名函数没有取得外部函数的this的值呢？

每个函数在被调用时都会自动取得两个特殊的变量：this和arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量（在匿名函数没有定义形参时可以访问外部函数的实参）。

可以将this实体化，保持在外部函数的AO中，再由匿名函数去访问外部AO中的变量。即使在函数返回之后，that也任然引用着obj。

```js
global.name = 'xfy';
// window.name = 'xfy';
let obj = {
    name: 'xxxfy',
    age: 18,
    say: function () {
        let that = this;
        return function () {
            console.log(that.name);
        }
    }
}

obj.say()();
```

有几种特殊的情况，会导致this发生意外的变化。

```js
let obj = {
    name: 'xfy',
    feature: 'handsome',
    say: function () {
        console.log(this.name);
    }
}
global.name = 'dfy';	// 非严格模式下;
// let name = 'dfy';
```

第一行就是平时最平常的调用了对象的方法，this得到正确的引用。第二行在方法执行前加上了括号，虽然加上了括号之后好像是在引用一个函数，但this的值得到了维持。而第三行代码先执行了一条赋值语句，然后再调用赋值后的结果。因为这个赋值表达式的值是函数本身，所以this的值不能得到维持，返回的就是全局对象里的属性了。

```js
obj.say();	// xfy;
(obj.say)();	// xfy;
(obj.say = obj.say)();	// 'dfy';
```

### 内存泄漏

在高贵的IE9之前的版本，JScript对象和COM对象使用不同的辣鸡收集程序例程。那么在这些版本中的ie使用闭包就会导致一些特殊的问题。如果闭包的作用域中保存着一个HTML元素，那么就意味着该元素无法被销毁。

这样的一个简单的示例为element元素事件创建了一个闭包，而这个闭包又创建了一个循环引用。由于匿名函数保存了对getid函数的活动对象（AO）的引用，因此就会导致无法减少element的引用数。只要匿名函数存在，element引用数至少为1。所以它占用的内存就不会被回收。

```js
function getid() {
    let element = docuemnt.getElementById('test');
    element.onclick = function () {
        alert(element.id);
    }
}
```

不过只需要稍微改下就能够解决这个问题。将`element.id`保存在一个变量中，并且在闭包中引用这个变量消除循环引用。但仅仅还不能解决内存泄漏的问题。闭包会引用包含函数的整个活动对象，而其中包含着element。即使闭不引用element，包含函数的活动对象中也仍然会保存一个引用。因此，有必要把element设置为null。

```js
function getid() {
    let element = docuemnt.getElementById('test');
    let id = element.id;
    element.onclick = function () {
        alert(id);
    }
    element = null;
}
```

## 模仿块级作用域

JavaScript是没有块级作用域的（`let`与`const`声明的变量/常量是有的）。这就意味着块语句中定义的变量，实际上是在包含函数中而非语句中创建的。

在C艹、Java等语言中，变量i只会在for循环的语句块中有定义，一旦循环结束，变量i就会被销毁。而在JS中，变量i是由函数的活动对象所定义的，使用`var`声明的变量将会在函数的AO里。并且在函数的任何位置都能访问它，即使重新声明一次，它的值也不会变。

```js
function test(num) {
    for (var i = 0; i < num; i++) {
        console.log(i);
    }
    var i;
    console.log(i);	// 10
    console.log(i);	// 10
}
test(10);
```

在现在看来，当然是推荐使用`let`来解决这个问题了。在for循环中使用`let`声明变量就会产生块级作用域。

```js
function test(num) {
    for (let i = 0; i < num; i++) {
        console.log(i);
    }
    console.log(i);     // i is not defined
}
test(10);
```

不过在没有`let`关键字的时候，可以使用立即执行函数来模拟块级作用域（私有作用域）。与`let`的效果一样！

```js
function test(num) {
    (function () {
        for (var i = 0; i < num; i++) {
            console.log(i);
        }
    })()
    console.log(i);     // i is not defined
}
test(10);
```

JS将`function`关键字当作一个函数声明的开始，而函数声明后面不能跟园括号。然而函数表达式后面可以跟圆括号，要将函数声明转换为函数表达式，只需要加一对括号即可。

```js
function () {
	// 
}();	// 语法错误;

(function () {
	// 
})();
```

模仿的块级作用域通常作用于函数外部的全局作用域，从而向全局作用域添加变量和函数，而不污染全局作用域。

```js
let name = 'xfy';
(function () {
    let name = 'yyy';
    console.log(name);
})()	// yyy
```

> 这种做法可以减少闭包占用内存的问题，没有匿名函数的引用，只要函数执行完毕，就可以立即销毁其作用域了。

## 私有变量

严格来说，JS是没有私有成员的概念；所有对象属性都是公开的。不过可以使用函数来实现私有变量的概念。任何在函数中定义的变量，都可以认为是私有化变量，因为在函数外部无法访问这些变量。私有变量包含函数的参数、局部变量和在函数内定义的其他函数。

在这个函数内部，有两个参数和一个局部变量。在函数的内部可以访问这些变量，而在函数外部除了主动返回之外则不能访问他们。如果在这个函数内创建一个闭包，那么这个闭包可以通过作用域链来访问到这些变量。利用这一点，就可以创建访问私有变量的共有方法。

```js
function add(num1, num2) {
    let result = num1 + num2;
    return result;
}
```

可以利用构造函数的模式来创建私有和公有属性。带有this的属性将因为构造函数被返回到外部，从而形成闭包。而构造函数内部其他的没有this的属性则不会被赋予到实例上。此时就只能通过定义的公有方法来访问私有的属性。

这种有权访问私有属性的公有方法称之为**特权方法**（privileged method）。

```js
function Person(name) {
    // 私有变量
    let age = 18;
    // 私有方法
    function pv() {
        age++;
        console.log(age);
    }
    // 公有方法
    this.say = function () {
        console.log(name);
        // 通过公有方法执行私有方法
        pv();
    }
}
let xfy = new Person('xfy');
console.log(xfy.name);
xfy.say();
```

因为必须要使用构造函数，且还需要在构造函数内定义方法，所以这种方法一样有着和构造函数一样的缺点，每个实例都会创建一组同样的新方法。

### 静态私有变量

直接使用构造函数会导致方法被重新定义到每个实例。解决构造函数的这个问题的方法就是将方法定义在其原型上，而为了使原型上的方法能够访问到私有化的变量，可以通过在私有作用域中定义方法。

这个方法通过在私有作用域中创建一个全局的构造函数，并且将其方法定义在原型上。当构造函数在全局时，其原型的方法依然能访问私有作用域内的私有变量。

未经声明的创建变量可以提升到全局作用域，但是在严格模式下未经声明的变量则会报错。在目前的版本，可以在全局作用域中将变量先声明，再在私有作用域中赋值。可以到达同样的效果，其原型上的方法依然继承私有作用域的活动对象。

```js
let Person;
(function () {
    'use strict'
    let v = 10;
    function pv() {
        v++;
        console.log(v);
    }

    Person = function () {};
    Person.prototype.say = function () {
        console.log(v);
    }
    Person.prototype.cha = function () {
        pv();
    }

})();

let xfy = new Person();
xfy.say();
```

除了上述的静态私有变量，还有一种写法就是在构造函数内为私有变量赋值。这样创建的实例就能够共享私有变量，并且在创建是就为其赋值。

这种方式创建静态私有变量会因为使用原型而增进代码复用，但每个实例都没有自己私有变量。要使用实例变量，还是静态私有变量。最终视需求而定。

```js
let Person;
(function () {
    let name;
    Person = function (value) {
        name = value;
    }
    Person.prototype.get = function () {
        console.log(name);
    }
    Person.prototype.set = function (value) {
        name = value;
    }
})()

let xfy = new Person('xfy');
xfy.get();
xfy.set('dfy');
xfy.get();
```

### 模块模式

前面所述的方法都是为自定义类型创建私有变量和特权方法的。而道格拉斯所说的模块模式（module pattern）是为单例创建私有变量和特权方法的。所谓单例（singleton），指的就是只有一个实例的对象。

通常，JS都是以对象字面量来创建单例对象的。

```js
let singleton = {
    name: value,
    method: function () {
        return name;
    }
}
```

模块模式通过为单例添加私有变量和特权方法能够让其得到增强。

这个模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部定义了私有变量和函数。然后，将一个对象字面量作为函数的值返回。在返回的字面量中定义了公开的属性和方法。因为这个字面量是在匿名函数内定义的，所以它有权访问匿名的方法和属性。从本质上来讲，这个对象字面量定义的是单例的公共接口。

```js
let singleton = function () {
    let pv = 10;
    function pf() {
        return false;
    }
    return {
        pubp: true,
        prip: function () {
            pv++;
            return pv;
        }
    }
}()

console.log(singleton);
console.log(singleton.prip());
```

这种模式在需要对单例进行某些初始化，同时又需要维护其私有变量时时非常有用的。

```js
let app = function () {
    // 私有变量和函数
    let con = [];
    // 初始化
    con.push(new BaseCon());
    // 公共方法
    return {
        getCon: function () {
            return con;
        },
        regCon: function (con) {
            if (typeof con == 'obejct') {
                con.push(con)
            }
        }
    };
}();
```

### 增强的模块模式

有人改进了模块模式，即在返回对象之前就加入对其增强的代码。这种增强的模块模式适合那些单例必须是某种类型的实例。同时还必须添加某些属性/方法对其加以增强的情况。

```js
let app = function () {
    // 私有变量和函数
    let con = [];
    // 初始化
    con.push(new BaseCon());
    // 公共方法
    return {
        getCon: function () {
            return con;
        },
        regCon: function (con) {
            if (typeof con == 'obejct') {
                con.push(con)
            }
        }
    };
}();
```

## 小结

在JavaScript编程中，函数表达式是一种非常有用的技术。使用函数表达式可以无须对函数命名，从而实现动态编程。匿名函数，也称为拉姆达函数，是一种使用JavaScript函数的强大方式。以下总结了函数表达式的特点。

* 函数表达式不同于函数声明。函数声明要求有名字，但函数表达式不需要。没有名字的函数表达式也叫匿名函数。
* 在无法确定如何引用函数的情况下，递归函数就会变得比较复杂；
* 递归函数应该始终使用`arguments.callee`来递归地调用自身，不要使用函数名———函数名可能会发生变化。

当在函数内部定义了其他函数时，就创建了闭包。闭包有权访问包含函数内部的所有变量，原理如下。

* 在后台执行环境中，闭包的作用域链包含着它自己的作用域、包含函数的作用域和全局作用域。
* 通常，当函数返回一个闭包时，这个函数的作用域将会一直在内存中保存到闭包不存在为止。

使用闭包可以在JavaScript中模仿块级作用域（JavaScript本身没有块级作用域的概念），要点如下。

* 创建并立即调用一个函数，这样既可以执行其中的代码，又不会在内存中留下对该函数的引用。
* 结果就是函数内部的所有变量都会被立即销毁——除非某些变量赋值给了包含作用域（即外部作用域）中的变量。

闭包还可以用于在对象中创建私有变量，相关概念和要点如下。

* 即使JavaScript中没有正式的私有对象属性的概念，但可以使用闭包来实现公有方法，而通过公有方法可以访问在包含作用域中定义的变量。
* 有权访问私有变量的公有方法叫做特权方法。
* 可以使用构造函数模式、原型模式来实现自定义类型的特权方法，也可以使用模块模式、增强的模块模式来实现单例的特权方法。

JavaScript中的函数表达式和闭包都是极其有用的特性，利用它们可以实现很多功能。不过，因为创建闭包必须维护额外的作用域，所以过度使用它们可能会占用大量内存。