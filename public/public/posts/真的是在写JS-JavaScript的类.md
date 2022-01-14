---
title: 真的是在写 JS - JavaScript 的类
date: 2020-12-30 11:14:16
tags: JavaScript
categories: 笔记
url: really-writing-js-javascriptclasses
index_img: /images/真的是在写JS-JavaScript的类/2020-12-30-11-06-25.webp
---
在 JavaScript 中所谓的类不过是 ECMAScript 2015 为其引入的语法糖。这个糖它只有甜味，它是构造函数的另一种写法，类语法**不会**为 JavaScript 引入新的面向对象的继承模型。

在之前学习 [JS面向对象](https://www.defectink.com/defect/javascript-object-oriented-programming.html) 的编程时，详细的研究过了关于 JavaScript 构造函数以及继承的问题。从工厂模式一直发展至今的寄生式继承，也解决了很多语言本有的问题。虽然类只是个语法糖，但是从很多地方来说它也解决了关于构造函数继承等的复杂写法。

## 📍定义类

类实际上是一个特殊的函数，将像函数能够定义的函数表达式和函数声明一样，类语法有两个部分组成：类表达式和类声明。

### 声明

定义一个类的方法是使用一个类声明，要声明一个类，可以使用带有`class`关键字的类名。一个类看上去像这样：

```js
class Person {
    constructor (name, age) {
        this.name = name;
        this.age = age;
    }
    
    otherFunc() {
        console.log(name + age);
    }
}
```

这和一些常见的语言，例如 C艹 和 Java 较为类似。相比较之下，传统的 JavaScript 构造函数对于其他的面向对象语言的程序员可能不太容易理解，来回顾下传统的构造函数。

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.otherFunc() {
    console.log(name + age);
}
```

相较于最传统的构造函数来说，类的声明方式会更让人容易理解。虽然声明看上去只是换了种写法（确实就是换了种写法，包括继承），但是对于继承等操作来说，`class`类的方式省了不少事。

### 提升

函数声明和类声明之间的一个重要区别是函数声明会提升，而类声明不会。和新关键字`let`、`const`等一样，类需要先声明再使用。

```js
let xfy = new Person();     // ReferenceError

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
```

否则就会抛出一个 ReferenceError（引用错误）。

### 类表达式

和函数一样，一个类表达式是定义一个类的另一种方式。类表达式可以是具名的或匿名的。

```js
// 匿名类
let Person = class {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

console.log(Person.name);   // Person

// 具名类
let Person = class Persona {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

console.log(Person.name);   // Persona
```

一个具名类表达式的名称是类内的一个局部属性，它可以通过类本身（而不是类实例）的 name 属性来获取。

> 类表达式也同样受到类声明中提到的类型提升的限制。

## 类体和方法定义

一个类的类体是一对花括号/大括号`{}`中的部分。这是定义类成员的位置，如方法或构造函数。

### 严格模式

类声明和类表达式的主体都在严格模式下执行。比如，构造函数，静态方法，原型方法，getter 和 setter 都在严格模式下执行。

### 构造函数

`constructor`方法是一个特殊的方法，这个方法用于创建和初始化一个由`class`创建的对象实例。一个类只能拥有一个名为`constructor`的特殊方法。如果类包含多个`constructor`的方法，则将抛出一个`SyntaxError`。

一个构造函数可以使用`super`关键字来调用一个父类的构造函数。

### 原型方法

原型方法与使用传统的构造函数方法实现的效果一样。不过 class 使用的是方法定义：从 ECMAScript 2015 开始，在对象初始器中引入了一种更简短定义方法的语法，这是一种把方法名直接赋给函数的简写方式。

```js
class Rectangle {
    // 构造函数
    constructor(h, w) {
        this.h = h;
        this.w = w;
    }
    // get
    get area() {
        return this.calcArea();
    }
    // 自定义方法
    calcArea() {
        return this.h * this.w;
    }
}

let square = new Rectangle(23, 32);
console.log(square.area) // 736
```

使用类的方式来写这个原型方法使其看上去更加类似于一些常见的面向对象的语言。当然，类不会为 JavaScript 引入新的继承模型，所以上述由类写的原型方法也可以使用传统的构造函数来写。不过就是看上去和常见的面向对象的语言不太一样而已。

```js
// 构造函数
function Rectangle(h, w) {
    this.h = h;
    this.w = w;
}

// 自定义方法
Rectangle.prototype.calcArea = function() {
    return this.h * this.w;
}

// get
Object.defineProperty(Rectangle.prototype, 'area', {
    get: function() {
        return this.calcArea();
    }
})

let square = new Rectangle(23, 32);
console.log(square.area);   // 736
```

### 静态方法

`static`关键字用于定义一个类的静态方法。调用静态方法不需要实例化该类，但不能通过一个类实例来调用静态方法。

通常，一个函数也是基于对象的，所以函数也有自己的属性，函数的`prototype`就是一个很好的例子。而一个类中的静态方法就相当于给这个构造函数定义了一个它自己的属性。不是在`prototype`上的属性是不会继承到实例上的。

```js
class test {
    constructor(xx, yy) {
        this.x = xx;
        this.y = yy;
    }

    add() {
        return this.x + this.y;
    }

    static tt() {
        return '嘤嘤嘤';
    }
}
```

```js
test.tt()
"嘤嘤嘤"
```

静态方法类似于将一个构造函数直接用作于一个工具函数。

### 原型和静态方法包装

在`class`体内部执行的代码总是在严格模式下执行，即使没有设置`'use strict'`。所以当调用静态或原型方法时没有指定`this`的值，那么方法内的`this`值将被置为`undefined`。

```js
class test {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    show() {
        return this;
    }

    static ss() {
        return this;
    }
}
```

这是一个简单的返回`this`的函数，它有两个，分别是继承给实例的属性和静态方法。若`this`的传入值为`undefined`，则在严格模式下不会发生自动装箱，`this`的返回值是`undefined`。

```js
let xfy = new test();
xfy.show();
let t = xfy.show;
t(); // undefined

test.ss()
let tt = test.ss;
tt(); // undefined
```

而在传统的构造函数写法下，`this`的值会发生自动装箱，将指向全局对象

```js
function Test(x, y) {
    this.x = x;
    this.y = y;
}

Test.prototype.show = function () {
    return this;
}

Test.ss = function () {
    return this;
}

let xfy = new Test();
xfy.show();
let t = xfy.show;
t(); // Global Object

Test.ss()
let tt = Test.ss;
tt(); // Global Object
```

### 实例属性

实例的属性必须定义在类的`constructor`方法里

```js
class test() {
    constructor(h, w) {
        this.w = w;
        this.h = h;
    }
}
```

## 字段声明

> 公共和私有字段声明是JavaScript标准委员会 [TC39](https://tc39.es/) 提出的 [实验性功能（第3阶段）](https://github.com/tc39/proposal-class-fields) 。浏览器中的支持是有限的，但是可以通过 [Babel](https://babeljs.io/) 等系统构建后使用此功能。

### 公有字段声明

class 提供了声明公有字段的方法，通过预先声明字段，类定义变得更加自我记录，并且字段始终存在。

```js
class Rectangle {
    x;
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
    static y = 1;
    clicked() {
        this.x++;
    }
}

let square = new Rectangle(123, 33);
```

正如上面看到的，这个字段可以用也可以不用默认值来声明。

共有字段重要的不同之处在于，它们会在每个独立对象中被设好，而不是设在`prototype`中。

```js
Rectangle.prototype.x   // undefined
```

### 私有字段声明

从类外部引用私有字段是错误的。它们只能在类里面中读取或写入。通过定义在类外部不可见的内容，可以确保类的用户不会依赖于内部，因为内部可能在不同版本之间发生变化。

私有字段从大佬们之间共有约定的下划线，现在已经换为草案中的`#`了。

```js
class Rectangle {
    #x;
    #width;
    #height;
    constructor(w, h) {
        this.#width = w;
        this.#height = h;
    }
    get area() {
        return this.#width * this.#height;
    }
}

let s = new Rectangle(12, 33);
```

> 私有字段必须先在类中声明。

## 使用`extends`扩展子类

`extends`关键字在*类声明*或*类表达式*中用于创建一个类作为另一个类的一个子类。也就是说，继承。ECMAScript 2015 的继承终于变的更加直观了。

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayName() {
        return this.name;
    }

    get newYear() {
        return ++this.age;
    }
}

class Student extends Person {
    constructor(name, age, classes) {
        super(name, age);
        this.classes = classes;
    }
}
```

不需要再手动写一个用于继承的函数了，也不需要再使用`call`了，在子类中可以直接使用`super()`方法来指向超类的`this`。

当然，因为是语法糖，所以`extends`也可以继承传统基于函数的“类”：

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayName = function () {
    return this.name;
}

Object.defineProperty(Person.prototype, 'newYear', {
    get: function () {
        return ++this.age;
    }
})

class Student extends Person {
    constructor(name, age, classess) {
        super(name, age);
        this.classess = classess;
    }

    sayAge() {
        return this.age;
    }
}
```

除了基于函数的“类”，其他用法还是一模一样。

**但是**，类无法继承常规对象，也就是非构造函数的`prototype`，或者说不可构造的常规对象。如果需要继承，可以使用`Object.setPrototypeOf()`方法。

```js
class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

let someOne= {
    sayName() {
        return this.name;
    }
}

Object.setPrototypeOf(Student.prototype, someOne);

let p = new Student('xfy', 18);
```

又见到老朋友`prototype`了。

### Species

如果我们想在一个派生出数组的构造函数中返回 Array 对象，那么 Species 允许我们覆盖默认的构造函数

```js
class MyArray extends Array {
    static get [Symbol.species]() {
        return Array;
    }
}

let a = new MyArray(1,2,3,4);
```

## 不仅仅是语法糖

前面有提到过，class 不过是新的语法糖。所谓的语法糖，就是旨在不增加语法的情况下，使得代码内容更加容易阅读。根据前面的一些实例，可以发现 class 完全可以使用以前的纯函数来写出相同的内容。

不过他们也有一些重大差异：

1. `class` 创建的函数具有特殊的内部属性标记 `[[FunctionKind]]:"classConstructor"`。所以它与手动创建构造函数并不完全相同，并且 JavaScript 会在很多地方检查该属性。例如类无法当作普通函数来使用，必须配合`new`操作符来使用：

```js
Error: Class constructor User cannot be invoked without 'new'
```

2. 类的方法不可枚举，类定义将 `"prototype"` 中的所有方法的 `enumerable` 标志设置为 `false`。所以当使用`for/in`方法时，类的方法是不会被枚举出来的。

3. 类总是使用`use strict`，类中的所有代码都是严格模式。所以也不会导致 this 的自动装箱。
4. 函数的声明会提升，类的声明不会。
5. `class`内创建的方法既能继承作用域链，同时也是在 prototype 上，不会为每个实例创建同名不相同的方法。

## 参考

* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Class_elements
* https://zh.javascript.info/class

头图来自：[Classes in JavaScript](https://dev.to/samanthaming/classes-in-javascript-30n8)