* [类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)

在JS中所谓的类不过是ECMAScript 2015为其引入的语法糖。这个糖它只有甜味，它是构造函数的另一种写法，类语法**不会**为JavaScript引入新的面向对象的继承模型。

在之前学习[JS面向对象](https://www.defectink.com/defect/javascript-object-oriented-programming.html)的编程时，详细的研究过了关于JS构造函数以及继承的问题。从工厂模式一直发展至今的寄生式继承，也解决了很多语言本有的问题。虽然类只是个语法糖，但是从很多地方来说它也解决了关于构造函数继承等的复杂写法。

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

这和一些常见的语言，例如C艹和JAVA较为类似。相比较之下，传统的JS构造函数对于其他的面向对象语言的程序员可能不太容易理解，来回顾下传统的构造函数。

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

否则就会抛出一个ReferenceError（引用错误）。

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

一个具名类表达式的名称是类内的一个局部属性，它可以通过类本身（而不是类实例）的name属性来获取。

> 类表达式也同样受到类声明中提到的类型提升的限制。

## 方法定义
