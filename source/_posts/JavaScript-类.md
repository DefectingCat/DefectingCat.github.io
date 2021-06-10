---
title: JavaScript-类
date: 2021-07-12 15:19:24
tags: JavaScript
categories: 笔记
url: javascript-class
---

## 对象

### 将数组当作对象

数组和对象的差距貌似并不大，好像完全可以将一个数组当作对象使用，但这并不是一个好主意。数组和普通的对象都根据其对应的行为和用途进行了优化，所以最好只用对象来存储键/值对，只用数组来存储下标/值对。

如果试图给一个数组添加一个类似数字的属性，例如字符串`'3'`，那么在数组进行存储之后会将其作为下标，并且转为数字。

```js
let arr = []
arr.a = 123
arr.length  // 0
arr['3'] = 333
arr.length  // 4
arr  // (4) [空 ×3, 333, a: 123]
```

### [[Get]]

对象属性访问有些很微妙同时非常重要的细节，例如一次经典的属性访问：

```js
const obj = {
  name: 'xfy',
};
obj.name;
```

`obj.name`是一次属性访问，但这不是简单的在对象 obj 中查找这个属性。

在语言规范中，`obj.name`在 obj 上实现了`[[Get]]`操作（这有点类似于函数调用：`[[Get]]()`）。对象默认的`[[Get]]`操作会先在该对象中查找是否具有名称相同的属性，如果有就返回。

如果没有找到名称相同的属性，则会继续遍历原型链，直到找到为止。如果原型链上也没有找到同名的属性，那么`[[Get]]`操作就会返回 undefined。

```js
obj.age; // undefined
```

这和访问变量时行为略微不同，如果引用了一个当前词法作用域中不存在的变量，则会抛出 ReferenceError。

所以仅通过返回值无法判断一个属性是否存在：

```js
const myObj = {
  a: undefined,
};
myObj.a; // undefined
myObj.b; // undefined
```

### [[Put]]

有`[[Get]]`操作就有对应的`[[Put]]`操作。`[[Put]]`被触发时，实际行为取决于很多因素，包括对象中是否已经存在这个属性。

如果已经存在这个属性，`[[Put]]`算法大概会检查这些内容：

1. 属性是否是访问描述符 Setter？如果是，则直接调用 Setter。
2. 属性的数据描述符中 writable 是否是 false？如果是，非严格模式下静默失败，严格模式抛出 TypeError 异常。
3. 如果都不是，将该值设置为属性的值。

### Getter 和 Setter

对象有默认的`[[Get]]`与`[[Put]]`操作可以分别控制属性值的设置与获取。在 ES5 中可以是使用 getter 和 setter 来改写单个属性的默认操作。

> 目前只能改写对象的某个属性，未来可能能够修改整个对象的默认行为。

当给一个属性定义了一个 getter 或者 setter 时，这个属性会被定义为“访问描述符”（和“数据描述符”相对）。这会使其忽略他们的 value 和 writable 属性，取而代之的时 set 与 get（还有 configurable 和 enumerable）特性。

两种定义方式相同，都会在对象中创建一个不包含值的属性。

```js
let obj = {
  get a() {
    return 123;
  },
};
console.log(obj.a);

Object.defineProperty(obj, 'b', {
  get: function () {
    return this.a * 2;
  },
});
console.log(obj.b);
```

getter 和 setter 通常成对出现

```js
let myObj = {
  get a() {
    return this._a_;
  },
  set a(val) {
    this._a_ = val * 3.14;
  },
};
myObj.a = 15;
console.log(myObj.a);
```

### 存在性

前面介绍过一般情况下对象无法区分属性值不存在还是其值为 undefined。我们可以使用`in`操作符与`Object.hasOwnProperty()`方法来判断一个对象中是否有这个属性。

```js
let obj = {
  a: 123,
};
console.log('a' in obj);
console.log('b' in obj);

console.log(obj.hasOwnProperty('a'));
console.log(obj.hasOwnProperty('b'));
```

这两个方法不同的是：

* `in`会检查属性是否存在于对象以及原型链中；
* `Object.hasOwnProperty()`只会检查属性是否在对象中。

```js
let obj = {
  a: 123,
};

let myObj = Object.create(obj);
console.log('a' in myObj);
```

另外，enumerable 属性描述符直接影响到`for/in`的遍历，不可枚举的属性`for/in`会直接忽略。

```js
let obj = {
  a: 123,
};

Object.defineProperty(obj, 'b', {
  enumerable: false,
  value: 456,
});

for (const i in obj) {
  console.log(i);
}
```

还有另外几个方法也能区分属性是否可枚举：

```js
let obj = {
  a: 123,
};

Object.defineProperty(obj, 'b', {
  enumerable: false,
  value: 456,
});

console.log(obj.propertyIsEnumerable('a'));
console.log(obj.propertyIsEnumerable('b'));

console.log(Object.keys(obj));

console.log(Object.getOwnPropertyNames(obj));
```

他们的区别是：

* `propertyIsEnumerable()`当前对象中的属性是否可枚举，不检查原型链；
* `Object.keys()`返回当前对象所有可枚举属性的数组；
* `getOwnPropertyNames()`会返回对象的所有属性，无论是否可枚举；

### 遍历

这里记录下`[Symbol.iterator]()`方法的一些使用习惯。一个可迭代对象需要拥有`[Symbol.iterator]()`方法才是可迭代对象，而`[Symbol.iterator]()`方法是这样组成的：

```js
let obj = {
  start: 0,
  end: 10,
  [Symbol.iterator]() { // Symbol.iterator是对象中的一个方法
    return { // 它返回一个next方法
      next: () => {
        return { // next方法还需要返回一个包含 value 和 done 的对象
          value: ++this.start,
          done: this.start > this.end,
        };
      },
    };
  },
};
```

Symbol.iterator 是对象中的一个方法，它返回一个 next 方法（当然也可以不返回），而 next 方法还需要返回一个包含 value 和 done 的对象。这样才构成了一个可迭代的对象。

Symbol.iterator 方法可以直接通过 this 访问原对象，而 next 方法是 Symbol.iterator 方法返回的一个方法，它需要通过 this 来获取原本对象时就需要使用箭头函数，因为普通函数会有自己的 this 值。

```js
let obj = {
  start: 0,
  end: 10,
  [Symbol.iterator]() {
    return {
      next() {
        return {
          value: ++this.start, // undefined
          done: this.start > this.end,
        };
      },
    };
  },
};
```

另外，Symbol.iterator 也可以不返回 next 方法，它通过返回 this，然后在原对象中定义一个 next 方法。这样迭代器就照样能找到 next 方法，且能够使用 this 了。

```js
// 这样也是可以的
let obj = {
  start: 0,
  end: 10,
  [Symbol.iterator]() {
    return this;
  },
  next() {
    return {
      value: ++this.start,
      done: this.start > this.end,
    };
  },
};
```

## 类

类是一种设计模式。许多语言提供了对于面向类软件设计的原生语法。JavaScript 也有类似的语法，但是和其他语言的类完全不同。

类意味着复制。

传统的类被实例化时，它的行为会被复制到实例中。类被继承时，行为也会被复制到子类中。

多态（在继承链的不同层次名称相同但是功能不同的函数）看起来似乎是从子类中引用父类，但是本质上引用的其实是复制的结果。

JavaScript 并不会（像类那样）自动创建对象的副本。

## 原型

考虑原型链之前先来看下什么是原型。我在《JavaScript 权威指南》中读到的最容易理解的一句话就是：对象不仅仅是简单的字符串（和 Symbol）到值的映射。除了维持自己的属性之外，JavaScript 对象也可以从其他对象继承属性，这个其他对象称其为“原型”。

JavaScript 与传统的 OOP 语言不同的是，它没有通常的类的概念。对象的方法通常是继承来的属性，而这种“原型式继承”也是 JavaScript 的主要特性。

JavaScript 的对象有个特殊的`[[Prototype]]`内置属性，也就是原型，其实就是对于其他对象的引用。几乎所有对象在创建时`[[Prototype]]`属性都会被赋予一个非空的值。一个对象的原型是其他的对象的引用，而其他的对象也会拥有原型，这样就形成了所谓的“原型链”。看上去和作用域链有点类似，虽然他们是两种东西，但是某些查找值的行为确实很类似。

`[[Prototype]]`引用有什么用呢，上述介绍过`[[Get]]`操作会在当前对象内寻找指定的属性，如果找不到，它就会继续上`[[Prototype]]`上寻找。

> 这里对`[[Get]]`的讨论是不考虑 ES6 的 Proxy 的情况下的。

这样的代码在前面可能已经见过，`Object.create`应该是用来描述原型最方便的方法了。先不考虑它的实现，它在这里的作用就是将 obj 设置为 otherObj 的原型。这样在对`otherObj.name`实施`[[Get]]`操作时，otherObj 本身并 name 这个属性，但是它会随着原型查找到 obj 上，并成功的访问到了值。

```js
let obj = {
  name: 'xfy',
};
const otherObj = Object.create(obj);
console.log(otherObj.name);
```

### 原型链的尽头

前面说过，一个对象的原型是其他的对象的引用，而其他的对象也会拥有原型，这样就形成了所谓的“原型链”。那么这样的原型链到哪里才是个头呢？

所有普通的对象原型最终都会指向`Object.prototype`。这也就是为什么几乎所有对象都有`toString()`和`valueOf()`之类的方法了，因为他们是通过原型链访问到 Object 对应的方法的。

### 属性设置和屏蔽

在我刚学 JavaScript 的时候，有人曾告诉过我，如果给一个对象设置一个和其原型链上同名的方法，那么就会屏蔽它的方法，访问到的是该对象自己定义的同名方法。这种情况称之为重写。

重写方法这里就不多说了，但重写远比我们想象中的更复杂。它只是多种情况下的一种。如果为一个对象 obj 赋值一个 foo 属性，假设它的原型链已经有这个同名的属性了，那么它会出现三种情况：

1. 如果在`[[Prototype]]`链上这个同名属性没有被设置为只读（`writable:false`）属性，那么就会直接在 obj 添加一个 foo 属性，它是屏蔽属性。
2. 如果`[[Prototype]]`链上这个同名属性为只读，那么无法修改已有属性或者在 obj 上创建屏蔽属性。在严格模式下会抛出一个错误，非严格模式下会静默失败。
3. 如果`[[Prototype]]`链上这个同名属性是一个 setter，那就一定会调用这个 setter。不会创建屏蔽属性，也会重新定义这个 setter。

前面两种情况都好理解，来看下 setter 的情况：

```js
let myObj = {
  name: 'xfy',
  set foo(val) {
    this._a_ = val * 2;
  },
  get foo() {
    return this._a_;
  },
};
const obj = Object.create(myObj);
obj.foo = '110';
console.log(obj.foo); // 220
```

也就说属性屏蔽只是三种情况种的一种而已。

> 第二种令人意外的情况主要是为了模拟类属性的继承。更令人意外的是它只会发生在使用`=`赋值中，使用`Object.defineProperty()`并不会受到影响。

### 原型式继承

本咸鱼曾经在读高程三的时候研究过 JavaScript 的原型式继承： [JavaScript 面向对象的程序设计 - 🍭Defectink](https://www.defectink.com/defect/javascript-object-oriented-programming.html) 。所以这里不再赘述关于构造函数还有模拟类的历史问题等，这里记录一些那篇文章没有提到的东西。

那篇文章里记录过 Douglas Crockford 所介绍的实现继承的方法。

```js
function object(o) {
    function F() {};
    F.prototype = o;
    return new F();
}
```

也就是`Object.create()`。

但当时并没有讨论构造函数之间的继承为什么用这种方式。如果有两个构造函数 Foo 和 Bar，假设 Bar 需要继承自 Foo，那么这两种写法为何不行？

```js
// 引用机制！
Bar.prototype = Foo.prototype;
// 可能会有副作用
Bar.prototype = new Foo();
```

第一种方法有很严重的问题，因为 JavaScript 中的对象并不是按值赋值的，而是而引用赋值的。直接将`Bar.prototype = Foo.prototype`，那么二者就会关联起来，任何在子类原型上的修改都会翻译到父类原型上，因为他们本质上是一个 prototype。

第二种方法确实可能正常关联，但是如果父类 Foo 有一些副作用操作（例如修改状态、注册到其他对象，给 this 添加属性，等等），这样就会影响到子类创建的实例。

所以合适的方法就是使用`Object.create()`。但这是在 ES6 之前的情况，ES6 添加了新的辅助函数`Object.setPrototypeOf()`，可以用标准且可靠的方法来修改关联。

```js
// ES6 之前需要抛弃默认的 Bar.prototype
Bar.prototype = Object.create(Foo.prototype);
// ES6 之后可以直接修改现有的 Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype);
```

### 检查“类”关联

在传统的面向类的环境中，检查一个实例（JavaScript 的对象）的继承祖先（JavaScript 的委托关联）通常被称之为内省（反射）。

在 JavaScript 中也有类似的操作：

```js
function Foo() {}
const obj = new Foo();

obj instanceof Foo; // true
```

instanceof 操作符的左侧是一个对象，右侧是一个函数。它回答的问题是：在 obj 的整条原型链`[[Prototype]]`上是否有`Foo.prototype`指向的对象？

但这个方法只能用在对象和函数之间的关系，如果需要判断两个对象之间是否通过`[[Prototype]]`关联，只用 instanceof 无法实现。

可以使用`.isPrototypeOf()`来检查两个对象之间是否关联，当然，它也可以用来检查“实例”和“类”之间的关联。

因为 JavaScript 中的类本质上就是使用原型链模仿出的结果，所以判断 obj 与其构造函数 Foo 之间的关系也可以这样：

```js
Foo.prototype.isPrototypeOf(obj);
```

由于类是虚假的，实际上我们并不需要 Foo，只需要它的原型对象 prototype。`.isPrototypeOf()`回答的问题是：在 obj 的整个原型链中是否出现过`Foo.prototype`？

在 ES5 中我们可以直接获取一个对象的原型：

```js
class Foo {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}

const obj = new Foo('xfy');

Object.getPrototypeOf(obj)
// {constructor: ƒ, sayName: ƒ}
// constructor: class Foo
// sayName: ƒ sayName()
// __proto__: Object
```

如果经常和 Chrome 之类的浏览器打交道的话，可能还在对象中见到过`.__proto__`属性。这个属性神奇的引用了`[[Prototype]]`对象，并且在 ES6 成为了标准。