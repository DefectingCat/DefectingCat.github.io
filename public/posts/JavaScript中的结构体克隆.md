---
title: JavaScript 中的结构体克隆
date: 2021-12-17 15:29:30
tags: [JavaScript]
categories: 实践
url: javascript-structured-clone
# index_img: /
---

由于 JavaScript 中值的特性，加上语言标准库没有实现深克隆的方法。导致很长一段时间依赖深克隆都是依赖第三方库或者使用 `JSON` 来处理，甚至是使用递归来自己拷贝值。

目前最新的语言特性中提供了一个新的方法 `structuredClone()`，一个内建（built-in）的深克隆方法。

听上去是个好消息。不过，现在这个 API 还在 nightly 阶段。目前（_2021.12_）只有 Firefox 94、Node 17 和 Deno 1.14 实现了该方法。

## 浅克隆

JavaScript 中和其他大多数语言一样，在堆内存中保存的值将由引用的方式传递。除了几个常见的基本值，JavaScript 几乎都是由 **对象** 这个引用值组成的。浅克隆，相对于深克隆，就是指两个变量指向同一个引用而完成变量值的移动。

创建一个浅克隆较为现代的最简单的方式就是使用 [对象展开语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)：

```js
const originObj = {
  name: 'xfy',
  age: 18,
  otherInfo: {
    nickName: 'xxfy',
  },
};

const shallowObj = { ...originObj };
```

这样看上去没有什么问题，如果我们直接修改克隆后的变量上的基本值，也不会影响到原变量的：

```js
shallowObj.name = 'dfy';
console.log('origin: ', originObj.name);
console.log('shallow copy: ', shallowObj.name);
// origin:  xfy
// shallow copy:  dfy
```

但如果我们修改对应的嵌套引用值时，原变量的值就会随着浅克隆的值一起变化。这可常常不是我们所期望的。

```js
shallowObj.otherInfo.nickName = 'dfy';
console.log('origin: ', originObj.otherInfo);
console.log('shallow copy: ', shallowObj.otherInfo);
// origin:  { nickName: 'dfy' }
// shallow copy:  { nickName: 'dfy' }
```

这是因为对象展开语法 `{ ...originObj }` 会迭代所有可枚举（enumerable）的属性，并一个一个的复制到新的对象上。但是值也是复制到新的对象上，对于基本值，可以直接复制。对于引用值，则复制引用，且不会再处理值上的引用值。这就是为什么我们修改嵌套的对象时，原变量会被一起修改了，因为它只复制了值 `otherInfo` 的引用。

基本值/原始值（primitive）在 MDN 上的定义：

> In JavaScript, a primitive (primitive value, primitive data type) is data that is not an object and has no methods. There are seven primitive data types: string, number, bigint, boolean, undefined, symbol, and null.

## 深克隆

顾名思义，深克隆就是与浅克隆相反的操作。浅克隆会复制引用值的引用，而深克隆就是要复制所有的原始值。

实现一个深克隆不是一件简单且不是非常优雅的操作。我们可以使用第三方库，像是 [Lodash cloneDeep](https://lodash.com/docs/#cloneDeep) 或者使用 `JSON` API 来 hack：

```js
const deepValue = JSON.parse(JSON.stringify(originObj));
console.log('deepValue: ', deepValue);
```

这里本质上是利用了 `JSON.stringify()` 来将原对象的所有值都序列化（serialize）为 json 格式，并在将其处理回对象。这样两个对象就不会指向相同的引用了。

这是一个常见的作法，V8 甚至还对其做过 [深度优化](https://v8.dev/blog/cost-of-javascript-2019#json)。

### Structured cloning

目前已经有一些需要创建深拷贝 JavaScript 值的场景：在 IndexedDB 中存储 JavaScript 值需要序列化的值才能被存储在磁盘上，并且随后再从磁盘上处理（deserialized）为 JavaScript 值。在 WebWorker 中通过 `postMessage()` 传递值等。这种算法被称之为结构体克隆（Structured cloning）。

在现在，我们可以使用全局方法 `structuredClone()` 来实现对 JavaScript 对象的结构体克隆了。

```js
const originObj = {
  name: 'xfy',
  age: 18,
  otherInfo: {
    nickName: 'xxfy',
  },
};

const deepObj = structuredClone(originObj);
deepObj.otherInfo.nickName = 'dfy';
console.log('deepObj: ', deepObj.otherInfo);
console.log('originObj: ', originObj.otherInfo);
```

只需要调用一下全局方法，即可实现以前难以实现的深克隆。

不过它也是有一些限制的：

- 方法（Function）对象无法克隆，会得到一个 `DataCloneError` 错误。`DOMException [DataCloneError]: () => {} could not be cloned.`
- 克隆 DOM 节点也会得到一个 `DataCloneError` 错误。
- 属性描述、getters、setters 和元数据都无法克隆。
- 原型链也无法克隆。

## DLC：手动实现一个经典的递归深克隆

递归来实现深克隆是经典的面试手写题，主要能考察到对引用值和函数递归的理解。其实现原理不是非常复杂：通过遍历一个对象，将其所有的原始值属性都克隆给目标对象。当遇到引用值时，判断引用值的类型，根据类型在目标对象上创建个同样的属性，并该引用值递归到克隆函数里，直到遇到原始值，并复制给目标对象。

在 JavaScript 当年的第一个难题就是判断类型，由于数组就是一个特殊对象的特性， `typeof` 关键字用来判断数组等数据结构并不准确。

```js
typeof [];
// 'object'
```

这就导致了第一步就需要一个其他的 hack 技巧来准确判断值的类型。好在 `Object` 给我们留了一手。`Object.prototype.toString()` 方法可以利用 `call()` 来对其他值进行调用，通过这种方式调用时，就能准确的返回其类型。

```js
Object.prototype.toString.call([]);
// '[object Array]'
```

确定了类型之后，接下来就很简单了，根据其类型在目标对象上创建和复制对应的值即可。

```js
if (matched) {
  target[k] = matched;
  deepClone(origin[k], target[k]);
} else {
  target[k] = origin[k];
}
```

完整步骤：

```js
/**
 * 通过递归遍历原对象，将其所有原始值复制到目标对象，以实现深克隆。
 * @param {Object} origin
 * @param {Object} target
 * @returns undefined
 */
function deepClone(origin, target) {
  const matchTypes = {
    '[object Object]': {},
    '[object Array]': [],
  };

  for (const k in origin) {
    const matched = matchTypes?.[Object.prototype.toString.call(origin[k])];
    if (matched) {
      target[k] = matched;
      deepClone(origin[k], target[k]);
    } else {
      target[k] = origin[k];
    }
  }

  return target;
}

const originObj = {
  name: 'xfy',
  age: 18,
  otherInfo: {
    nickName: 'xxfy',
  },
  lists: [1, 2, 3, { console: 'xbox' }],
};

const myClone = {};
deepClone(originObj, myClone);

myClone.otherInfo.nickName = 'test';
console.log('copy: ', myClone.otherInfo);
console.log('origin: ', originObj.otherInfo);

myClone.lists[3].console = 'playstation';
console.log('copy: ', myClone.lists);
console.log('origin: ', originObj.lists);
```

## 参考

- [Deep-copying in JavaScript using structuredClone](https://web.dev/structured-clone/)
