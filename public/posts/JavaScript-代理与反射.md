---
title: JavaScript-代理与反射
date: 2021-07-12 11:42:03
tags: JavaScript
categories: 笔记
url: javascript-proxy-and-reflect
---

ECMAScript 6 新增的代理和反射为开发者提供了拦截并向基本操作嵌入额外行为的能力。

## 反射 API

在研究代理之前，应该先看下反射。与 Math 类似，Reflect 对象不是类，尽管他们都是大写开头的。它的属性只是定义了一组相关的方法。这些 ES6 添加的函数为“反射”对象及其属性定义了一套 API。

Reflect 对象在同一个命名空间里定义了一组边界函数，这些函数可以模拟核心语言语法的行为，复制各种既有对象功能的特性。这组 Reflect 函数一一对应后续的 Proxy 处理器方法。 这些方法基本上都对应了语言的常规语法，利用在 Proxy 处理器上，可以提供更好的嵌入行为的能力。

反射 API 所包含的方法可以在 MDN 所查询到：[Reflect - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

## 代理

代理对象是目标对象的抽象。利用代理对象，可以修改 JavaScript 对象的基础行为。上述所介绍的反射 API 可以直接对 JavaScript 对象持续基础操作，而 Proxy 则提供了另一种途径，只要在代理上调用，所有捕获器都会拦截他们对应的反射 API 操作。使得我们能创建普通对象无法企及能力的代理对象。

Proxy 是一个类，创建一个代理对象通过 Proxy 类来构造。同时它还接收两个必须的参数，即目标对象`target`与处理对象`handler`。缺少任何一个参数都会抛出 TypeError。

```js
const proxyObj = new Proxy(target, handler);
```

### 无操作转发代理

无操作转发代理，也就是最简单的空代理，即除了作为一个抽象的目标对象，什么也不做。默认情况下，在代理对象上执行的所有操作都会无障碍地传播到目标对象。

要创建空代理，可传入一个简单的空对象作为处理器对象，从而让所有操作都畅通无阻地抵达目标对象。

```js
const obj = {
  name: 'xfy',
};

const proxyObj = new Proxy(obj, {});

proxyObj.name
// "xfy"
proxyObj.name = '123'
// "123"
obj
// {name: "123"}
```

### 捕获与反射 API

代理的主要目的是定义**捕获器**（trap）。捕获器就是在处理器对象中定义的“基本操作的拦截器”。每个处理器都可以包含零个或多个捕获器，每个捕获器都对应一种基本操作，可以直接或间接在代理对象上调用。每次在代理对象上调用这些基本操作时，代理可以在这些操作转发到目标对象前先调用捕获器函数，从而拦截并修改相应的行为。

例如，可以定义一个`get()`捕获器，在 ECMAScript 操作`[[Get]]`算法时触发：

```js
const obj = {
  name: 'xfy',
};

const handler = {
  get(target, property, receiver) {
    return [target, property, receiver];
  },
};

const proxyObj = new Proxy(obj, handler);

proxyObj.name // [{…}, "name", Proxy]
```

这里的`get()`捕获器看上去和属性访问器很类似，事实上对应的`set()`操作也很类似。但他们并不是属性访问器，最简单的判断就是属性访问器对象的`get/set()`操作需要一个属性名称，而代理对象的捕获器会拦截所有对应的操作，并通过参数的形式访问名称、属性等。

这是不是看上去和反射 API 有点相似？没错，反射 API 就是这种用法：

```js
// Object
var obj = { x: 1, y: 2 };
Reflect.get(obj, "x"); // 1
```

事实上，捕获器和反射 API 提供的方法一一对应。这些方法与捕获器拦截的方法具有相同的名称和函数签名，而且也具有被拦截方法相同的行为。

也就是说可以这样创建一个空代理对象：

```js
const obj = {
  name: 'xfy',
};

const handler = {
  get(target, property, receiver) {
    return Reflect.get(...arguments);
  },
};

const proxyObj = new Proxy(obj, handler);
```

甚至更直接一点

```js
const handler = {
  get: Reflect.get,
};
```

所有捕获器都可以基于自己的参数重建原始操作，但并非所有捕获器都像`get()`操作一样简单。所以，通过手写所有捕获器来如法炮制的想法是不现实的。好在，反射 API 为我们提供了便捷，我们不需要手动重建原始行为，而是可以通过调用全局 Reflect 对象上同名的方法来轻松创建。

```js
const obj = {
  name: 'xfy',
};

const handler = {
  get(target, property, receiver) {
    let decoration = '';
    property === 'name' ? (decoration = '! yyds!') : void 0;
    return Reflect.get(...arguments) + decoration;
  },
};

const proxyObj = new Proxy(obj, handler);
```

### 捕获不变式

虽然使用捕获器几乎可以改变所有基本方法的行为，但也不是没有限制。根据 ECMAScript 规范，每个捕获的方法都知道目标对象上下文、捕获函数签名，而捕获器的行为必须遵循“捕获器不变式”（trap invariant）。捕获器不变式因方法不同而异，但通常都会防止捕获器定义出现过于反常的行为。

例如，目标对象有一个不可写且不可配置的属性，那么捕获器在返回一个与该属性不同的值，会抛出 TypeError。

```js
const target = {};

Object.defineProperty(target, 'foo', {
  configurable: false,
  writable: false,
  value: 'bar',
});

const handler = {
  get() {
    return 'bazzz';
  },
};

const proxyObj = new Proxy(target, handler);
```

### 可撤销代理

使用 new 关键字创建的普通代理对象与目标对象之间会在声明周期内一直存在联系。Proxy 暴露了`revocable()`静态方法，使其可以撤销代理对象与目标对象的关联。

```js
const target = {
  foo: 'bar',
};

const handler = {
  get(target, property, recevier) {
    let decoration = '';
    property === 'foo' ? (decoration = '!!!') : void 0;
    return Reflect.get(...arguments) + decoration;
  },
};

const { proxy, revoke } = Proxy.revocable(target, handler);

console.log(proxy.foo);
console.log(target.foo);

revoke();

console.log(proxy.foo);
```

### 代理另一个代理

代理允许多层嵌套，可以创建一个代理，通过它去代理另一个代理。这样就可以在目标对象之上构建多层拦截网络。

```js
const target = {
  foo: 'bar',
};

const firstProxy = new Proxy(target, {
  get() {
    return Reflect.get(...arguments) + 'first proxy!';
  },
});

const secondProxy = new Proxy(firstProxy, {
  get() {
    return Reflect.get(...arguments) + 'second proxy!';
  },
});

console.log(firstProxy.foo);
console.log(secondProxy.foo);
```

### 代理的问题与不足

代理是在 ECMAScript 现有基础上构建起来的一套新 API，因此其实已经尽力做到最好了。很大程度上，代理作为对象的虚拟层可以正常使用。但在某些情况下，代理也不能与现在的 ECMAScript 机制很好的协同。

#### 代理中的 this

方法中的 this 通常指向调用这个方法的对象：

```js
const target = {
  showThis() {
    console.log(this);
    console.log(this.foo);
    console.log(this === proxy);
  },
  foo: 'bar',
};

const proxy = new Proxy(target, {});

proxy.showThis()
// Proxy {foo: "bar", showThis: ƒ}
// bar
// true
```

在代理中亦是如此，符合预期行为。

#### 代理与内部槽位

