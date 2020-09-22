## 类体和方法定义

一个类的类体是一对花括号/大括号{}中的部分。这是定义类成员的位置，如方法或构造函数。

### 严格模式

类声明和类表达式的主体都在严格模式下执行。比如，构造函数，静态方法，原型方法，getter和setter都在严格模式下执行。

### 构造函数

`constructor`方法是一个特殊的方法，这个方法用于创建和初始化一个由`class`创建的对象实例。一个类只能拥有一个名为`constructor`的特殊方法。如果类包含多个`constructor`的方法，则将抛出一个`SyntaxError`。

一个构造函数可以使用 super 关键字来调用一个父类的构造函数。

### 原型方法

原型方法与使用传统的构造函数方法实现的效果一样。不过class使用的是方法定义：从ECMAScript 2015开始，在对象初始器中引入了一种更简短定义方法的语法，这是一种把方法名直接赋给函数的简写方式。

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

使用类的方式来写这个原型方法使其看上去更加类似于一些常见的面向对象的语言。当然，类不会为JS引入新的继承模型，所以上述由类写的原型方法也可以使用传统的构造函数来写。不过就是看上去和常见的面向对象的语言不太一样而已。

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
