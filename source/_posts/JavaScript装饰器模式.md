---
title: JavaScript 装饰器模式🎊
date: 2021-03-09 20:36:26
tags: JavaScript
categories: 笔记
url: javascript-decorator
index_img: /images/JavaScript装饰器模式/logo.webp
---

JavaScript 的函数非常灵活，它们可以被传递，用作对象。除了 this 难以捉摸以外。

## 装饰器

装饰（decorate），将原函数作为一个参数传递给装饰器。利用函数闭包的特性，在父作用域中保存一些执行后的数据（缓存）或执行一些特殊操作。再将其返回出去，在这个返回的函数根据条件来执行原函数。

在实际工作中常见到的函数防抖和节流就是装饰器的工作原理。

## 缓存装饰器

一个简单的透明缓存装饰器可以明确的让我们了解到装饰器的工作方式：

```js
// 一个工作缓慢的 slow 函数
function slow(ds) {
  return `${ds}`;
}

function cachingDcorator(fn) {
  // 创建一个 map 用于缓存
  let cache = new Map();
  // 返回一个闭包
  return function(ds) {
    // 检查缓存中是否有结果
    if (cache.has(ds)) {
      return cache.get(ds);
    }
    // 没有缓存时，执行原函数，并记录缓存
    let res = fn(ds);
    cache.set(ds, res);
    return res;
  }
}
// 装饰
cacheSlow = cachingDcorator(slow);
console.log(cacheSlow('124'));
```

在装饰器 cachingDcorator 内，父作用域中创建了一个名为 cache 的 map 结构，利用闭包的特性就能够访问这个缓存对象。

在每次执行时，都将检查是否有对应的缓存。如果有，则跳过执行原函数，直接返回缓存的数据，以减少函数的执行工作。

上述简单的透明缓存装饰器还有一个问题：带有 this 时会失效。

```js
let worker = {
  foo() {
    return '嘤嘤嘤';
  },
  slow(ds) {
    return `${ds} ${this.foo()}`;
  }
}

function cachingDcorator(fn) {
  'use strict'
  let cache = new Map();

  return function(ds) {
    if (cache.has(ds)) {
      return cache.get(ds);
    }

    let res = fn(ds);
    cache.set(ds, res);
    return res;
  }
}

let worker.slow = cachingDcorator(worker.slow);
// undefined
console.log(worker.slow('xfy'));
```

当一个函数被传递到其他变量中，将丢失其上下文 this。

```js
let func = worker.slow;
func('xfy')
```

同理，缓存装饰器也是将其函数体作为参数传入到方法中，导致了其丢失了上下文 this。所以这样的装饰器在对象中的方法是用不了的。

## 传递 this

### 使用 call

使用 call 可以轻松解决 this 的问题。

```js
let worker = {
  foo() {
    return '嘤嘤嘤';
  },
  slow(ds) {
    return `${ds} ${this.foo()}`;
  }
}

function cachingDcorator(fn) {
  let cache = new Map();

  return function(ds) {
    if (cache.has(ds)) {
      return cache.get(ds);
    }

    let res = fn.call(this, ds);
    cache.set(ds, res);
    return res;
  }
}

worker.slow = cachingDcorator(worker.slow);

console.log(worker.slow('xfy'));
```

在将函数体传回对象时`worker.slow = cachingDcorator(worker.slow);`，在装饰器内部使用了 call 来执行传递的参数`fn.call(worker, ds);`。详细的传递步骤为：

1. worker.slow 被传递为包装器`function (ds) { ... }`；
2. 函数作为对象属性执行时，`this=worker`。（它是点符号 . 之前的对象）；
3. 在包装器内部，假设结果尚未缓存，`func.call(this, ds)`将当前的 `this`（`=worker`）和当前的参数（`=xfy`）传递给原始方法。

## 传递多个参数

原生的 Map 仅将单个值作为键（key）。当然可以使用其他的类似 map 的数据结构来存储缓存的值，或者在 map 中嵌套 map。

还有一种解决方法就是使用一个 hash 函数，来将两个参数做个简单的运算，将其做为一个值保存在 map 的 key 中，并对应结果缓存。

```js
let worker = {
  slow(x, y) {
    return x + y;
  },
};

function cachingDcorator(fn, hash) {
  let map = new Map();
  return function () {
    let key = hash(arguments);
    if (map.has(key)) {
      return map.get(key);
    }

    let res = fn.call(this, ...arguments);
    map.set(key, res);
    return res;
  };
}

function hash(args) {
  return `${args[0]}${args[1]}`;
}

worker.slow = cachingDcorator(worker.slow, hash);
console.log(worker.slow(2, 3));
```

在 JavaScript 中，形参不是必要的。只要传递了实际参数，那么在函数中就能使用`arguments`这个类数组来获取到所有的参数。

所以在这里返回的闭包里使用`let key = hash(arguments);`来获取两个参数做 hash 运算。

由于是一个类数组，所以它也是可迭代的。在传给原函数参数时，使用了展开（Spread）语法`let res = fn.call(this, ...arguments);`来将类数组迭代开来。


### 使用 apply

在传递 this 时，我们使用了 call 来传递参数。call 接受参数为逐个传递，在接受多个参数时，我们使用了展开语法来将可迭代对象的参数传递给 call。

call 与 apply 的唯一区别就是参数的传递方式不同。apply 接受剩余的参数为一个类数组

所以这里两个调用是等价的：

* `fn.call(this, ...arguments)`
* `fn.apply(this, arguments)`

而对于即可迭代又是类数组的对象，例如一个真正的数组，我们使用 call 或 apply 均可，但是 apply 可能会更快，因为大多数 JavaScript 引擎在内部对其进行了优化。

将所有参数连同上下文一起传递给另一个函数被称为“呼叫转移（call forwarding）”。

### 方法借用

能接受的参数还不够多。

上述 hash 方法一次只能处理两个参数`return '${args[0]}${args[1]}'`，将其作为 map 的一个 key 来使用。当遇到两个以上参数时就无能为力了。

所以还需要对 hash 方法做一个小改进，使其能够使用数组的`join()`方法来将所有的参数合并为一个字符串。

由于接受的参数`arguments`是一个类数组，所以它并没有数组的`join()`方法。这里就需要利用 call 来改变 this 的指向从而“借用”一下数组的`join()`方法：

```js
function hash(args) {
  // return Array.prototype.join.call(args);
  return [].join.call(args);
}
```

这种方式称之为**方法借用**。

最常见到的方法借用就是判断数据类型。我们都知道 typeof 在判断引用值时有那么一点不准确，这时候有一位大佬却能够准确的判断所有的类型：`Object.prototype.toString()`方法。

这个方法原本是用来转换为字符串的，但通过借用它还能 [判断数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#%E4%BD%BF%E7%94%A8_tostring()_%E6%A3%80%E6%B5%8B%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B)。

```js
Object.prototype.toString.call(new Array())
// "[object Array]"
typeof new Array()
// "object"
```

> 还有一种判断数据类型的方法是：`xxx.construtor.name`


## 函数属性

通常，函数装饰器是安全的。不过当遇到原函数拥有自身的属性时，通过装饰器返回的函数就会导致其丢失自身的属性。例如：`foo.count`。

一些包装器可能也会包含自身的属性，例如记录函数被调用的次数或者其他的信息。

可以使用 Proxy 对象来包装函数，来保留函数属性的访问权。Proxy 非常强大，Vue 3 就是使用 Proxy 来创建响应式对象的。从而解决了 Vue 2 不能监听到对象新增属性的问题等。

## 实例

一些装饰器的实例，这段内容也是 javascript.info 的 [任务](https://zh.javascript.info/call-apply-decorators#tasks)

### 间谍装饰器

间谍装饰器保存每次函数调用时传递的参数为一个数组。这种装饰器有时对于单元测试很有用。它的高级形式是 [Sinon.JS](https://sinonjs.org/) 库中的`sinon.spy`。

```js
function work(x, y) {
  console.log(x, y);
}

function spy(fn) {
  function ret() {
    // 每次调用原函数时，push 参数到 calls 属性上
    ret.calls.push(`calls:${[].join.call(arguments)}`);
    fn.apply(this, arguments);
  }
  // 在返回的函数上定义一个属性 calls
  ret.calls = [];

  return ret;
}

work = spy(work); 

work(1, 2);
work(3, 4);
console.log(work.calls);
```

### 延时装饰器

这是个非常简单的装饰器，用于为函数设置一个延时后执行。

```js
function foo(x) {
  console.log(x);
}

function delayRun(fn, ms) {
  return function() {
    setTimeout(() => {
      // 保持 this 的指向
      fn.apply(this, arguments);
    }, ms);
  }
}

foo = delayRun(foo, 500);

foo('xfy');
```

### 防抖装饰器

防抖装饰器 debounce 是一个常用的方法。它的主要目的是保证原函数在一定时间内的连续调用只生效一次。

通常在实际中的作用是：假设用户输入了一些内容，我们想要在用户输入完成时向服务器发送一个请求。

我们没有必要为每一个字符的输入都发送请求。相反，我们想要等一段时间，然后处理整个结果。

在 Web 浏览器中，我们可以设置一个事件处理程序 —— 一个在每次输入内容发生改动时都会调用的函数。通常，监听所有按键输入的事件的处理程序会被调用的非常频繁。但如果我们为这个处理程序做一个 1000ms 的 debounce 处理，它仅会在最后一次输入后的 1000ms 后被调用一次。

```js
function foo(x) {
  console.log(x);
}

function debounce(fn, ms) {
  let timer = null;
  return function () {
    // 如果延时内频繁被调用，则取消延时，不执行
    if (timer) clearTimeout(timer);
    // 延时执行
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
}

foo = debounce(foo, 1000);

foo(1);
foo(1);
foo(1);
```

### 节流装饰器

节流装饰器 throttle 和防抖装饰器很相似，但是它要复杂一点。与防抖不同的是，节流的主要作用是：让函数保持一定的**时间间隔**被调用执行。

* `debounce`会在“冷却（cooldown）”期后运行函数一次。适用于处理最终结果。
* `throttle`运行函数的频率不会大于所给定的时间 ms 毫秒。适用于不应该经常进行的定期更新。

```js
function foo(x) {
  console.log(x);
}

function throttle(fn, ms) {
  // 初始状态为不节流
  let isThrottle = false,
    savedArgs,
    savedCont;

  function wrapper() {
    // 如果节流是打开的，则保存当前运行的上下文和参数
    if (isThrottle) {
      savedArgs = arguments;
      savedCont = this;
      return;
    }
    // 第一次直接运行原函数
    fn.apply(this, arguments);
    // 第一次运行完后打开节流
    isThrottle = true;

    setTimeout(() => {
      // 在节流时间后关闭节流阀
      isThrottle = false;
      if (savedArgs) {
        // 调用 wrapper 自身，并传递保存的上下文
        wrapper.apply(savedCont, savedArgs);
        savedArgs = savedCont = null;
      }
    }, ms);
  }
  return wrapper;
}

let f1000 = throttle(foo, 1000);

f1000(1);
f1000(2);
f1000(3);
f1000(4);
f1000(5);
f1000(6);
setTimeout(() => {
  f1000(7);
}, 500);
setTimeout(() => {
  f1000(8);
}, 1000);
setTimeout(() => {
  f1000(9);
}, 1520);
setTimeout(() => {
  f1000('a');
}, 2000);
setTimeout(() => {
  f1000('b');
}, 2500);
setTimeout(() => {
  f1000('c');
}, 3000);
```

## 参考

* [装饰器模式和转发，call/apply](https://zh.javascript.info/call-apply-decorators)
* [Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)