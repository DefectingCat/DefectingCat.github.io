---
title: 异步JavaScript-Promise信任问题
date: 2021-07-16 18:50:04
tags: JavaScript
categories: 笔记
url: asynchronous-javascript-trust-promise
---

继前篇 [异步JavaScript-现在与将来 | 🍭Defectink](/defect/asynchronous-javascript-now-and-future.html) 对异步 JavaScript 有了个大概的了解之后，就要来真正的上手一下 Promise 了。但在了解 Promise 解决了哪些问题时，我们要先了解一下传统的回调会带来哪些问题。

## 回调信任问题

回调为什么会有信任问题？回调的本质就是等待将来执行完成的事件来执行我们所准备的函数。

```js
// A
ajax('url.1', () => {
  // B
});
// C
```

A 与 B 部分的块是同步的，发生于现在，在 JavaScript 主程序的控制之下。但 C 程序块将延迟执行，并且由（虚构的）ajax 函数来调用。这就是一种控制转移，绝大部分情况下，这种控制转移通常不会给程序带来任何问题。

但实际上，回调带来的信任问题正是由这种控制反转（inversion of control）带来的。

### 哪些问题

对于回调的信任问题，包括但不限于：

* 调用回调过早；
* 调用回调过晚；
* 调用回调次数过少或或多；
* 参数/环境值未传递；
* 吞掉可能出现的错误或异常；

等。

人们用虚构的恶魔 Zalgo 来描述这种同步/异步的噩梦，在 [Don't release Zalgo!](https://oren.github.io/articles/zalgo/) 一文中，针对回调信任问题的描述为：

> When you write a function that accept a callback, make sure your function always sync or always async. don't mix the two.

当我们有一个接收回调的函数时，要确保该函数拥有以异步或同步的方式运行，二者不能混淆。如果该函数运行的方式无法确定，就会出现回调过早，过晚等情况。

这些情况会带来什么问题呢？这是一段伪代码：

```js
function result(data) {
  console.log(a);
}

let a = 0;

ajax('url.1', result);

a++;
```

假设虚构的 ajax 函数无法确定它时同步执行（从缓存读取）还是异步执行（发送一个新的请求），这就导致了 result 函数打印 a 的值变的不确定。如果是同步的，则 a = 0；反之，a = 1；

这还只是多个信任问题中的一个，在 JavaScript 高速发展的今天，对于异步来说，回调函数已经不够用了。我们需要一个更好的异步编程方式，一种更同步、更顺序、更阻塞的方式来表达异步，就像我们的大脑一样。

## Promise

ES6 为我们带来了新的异步概念，即任务队列（微任务）。Promise API 就是基于微任务之上的，它能够更好的处理回调所带来的信任问题。

> Promise 是一个很优秀的 API，到处都能看到它的详细介绍，这里便不再多费口舌。

### 调用过早

根据上述的 Zalgo 所带来的问题，调用过早主要的根本原因就是我们无法确定回调函数是以同步的方式还是异步的方式执行的。而 Promise 本身就不必担心这个问题，根据任务队列的定义，即便是立即完成的 Promise `Promise.resolve(42)` 也无法被同步所察觉到。

也就是说，对一个 Promise 调用`then(...)`的时候，即使这个 Promise 已经 resolve，提供给`then(...)`的回调也总是会异步调用。因为这就是宏任务与微任务的运行方式： [任务 | 🍭Defectink](/defect/asynchronous-javascript-now-and-future.html#任务)

```js
console.log(41);

Promise.resolve(42).then((val) => {
  console.log(val);
});

console.log(43);
// 41 43 42
```

### 调用过晚

和调用过早类似，根据微任务的定义，一个 Promise 被 resolve 或者 reject 后，一定会在当前宏任务后添加到微任务队列。这就确保了注册在 Promise 上的回调在下个宏任务开始之前一定会被依次调用，并且他们中的任意一个都无法影响或延误对其他回调的调用。

```js
p.then((val) => {
  p.then((val) => {
    console.log('C');
  });
  console.log('A');
});
p.then((val) => {
  console.log('B');
});
// A B C
```

这里的三个微任务，C 永远无法打断或抢占 B，这是因为 Promise 的运作方式。

#### 调度技巧

微任务虽然给我们带来了不少好处，但也有很多调度的细微差别。如果两个 Promise p1 和 p2 都已经 resolve，那么注册在 p1 上的`then(...)`回调通常应该先于 p2 所注册的回调执行。但某些细微的场景下可能不是如此：

```js
const p3 = new Promise((resolve) => {
  resolve('B');
});
const p1 = new Promise((resolve) => {
  resolve(p3);
});
const p2 = new Promise((resolve) => {
  resolve('A');
});

p1.then((val) => {
  console.log(val);
});
p2.then((val) => {
  console.log(val);
});
// A B
```

由于 p1 不是立即值， 而是 resolve 另一个 Promise p3。规定的行为是把 p3 展开到 p1，但是是异步的展开，所以这里的 p2 的回调先执行。

> 如果 p1 是`Promise.resolve()`，结果则不同，它会返回同一个 Promise。

### 回调未调用

目前没有任何办法能够阻止 Promise 向我们通知它的决议（resolve 或者 reject）。如果我们对 Promise 注册了回调的话，那么它在决议时，总是会调用回调函数（完成回调或拒绝回调中的一个）。

> 决议一词参考自《你不知的 JavaScript 中卷》中文版，这也是本文对 Promise resolve 或 reject 的表达词。

但如果回调永远不会被决议呢？Promise 为我们提供了一个竞态的高级抽象机制的 API：`Promise.race()`。

```js
const timeoutPromise = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout!');
    }, delay);
  });
};

// 假设 foo 不会被决议
// 尝试给它 3000ms
Promise.race([foo(), timeoutPromise(3000)])
  .then((val) => {
    console.log('foo done');
  })
  .catch((e) => {
    console.log(e);
  });
```

利用该 API，即便目标 Promise 永远不会被决议，我们也能为其设置超时并防止它永久阻塞程序。

> 这里如果 foo 是微任务死循环的话，race 也无能为力！

### 调用次数过少/过多

正常情况下的调用次数应该是 1 次，调用次数过少也就是 0 次，这与上述回调未调用是一个意思。剩下的就是调用次数过多了。

本质上，Promise 的定义方式使得它只能被决议一次。如果出现某种情况，我们的代码试图调用`resolve(...)`或`reject(...)`多次，或者试图二者都调用，那么这个 Promise 只会接收第一次决议，并默默的忽略后续的任何调用。

由于 Promise 只能被决议一次，任何通过`then(...)`注册的回调只会被调用一次。这是在链式调用的情况下，多次注册 then 回调（`p.then(); p.then()`）时，它的调用次数与注册次数相同。

### 未能传递参数/环境值

Promise 最多只能有一个决议值，完成或拒绝。

如果没有手动决议任何值，那么这个值就是 undefined。如果决议时传递了多个参数，剩余的参数都会被默默忽略。如果需要传递多个值，则需要封装为一个对象或数组。

对于环境值来说，我们提供的回调函数依然可以访问对应的作用域和闭包。

### 吞掉错误或异常

如果拒绝一个 Promise 并给出一个理由，那么这个值就会传给拒绝回调。

如果 Promise 在创建或决议的过程中发生了错误，那这个错误就会被捕捉，并且使这个 Promise 被拒绝。

```js
const p = new Promise((resolve, reject) => {
  foo.bar(); // 错误！foo 未定义
  resolve(42);
});

p.then(
  (val) => {
    console.log(val);
  },
  (err) => {
    console.log(err); // 在这里捕获错误
  }
);
```

这是一个很好的防止 Zalgo 出现的机制。`then(...)`可以注册两个回调，一个成功时调用，一个出错时调用。这和以前回调函数的方式好似相同。但如果在回调期间出现的错误就无法被当前`then(...)`中的另一个失败回调所捕获，这看似防护就是错误被吞掉了。好在，现在的 Promise 还支持和`try...catch...`类似的方式防止吞掉错误。

```js
const p1 = new Promise((resolve) => {
  resolve(42);
});

p1.then((val) => {
  foo.bar();
  console.log(val);
})
  .catch((err) => {
    console.log('Catch in catch');
    console.log(err);
  })
  .finally(() => {
    cleanFunc();
  });
```

## 是可信任的Promise吗

Promise 看上去解决了不少回调无法被信任的问题，那么 Promise 是完全可信的吗？在此之前，得先看另一个问题。

### thenable 的鸭子类型

> 当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。

常见的 Promise 都是由其构造函数实例化而来，或许我们可以通过`p instanceof Promise`来检查某样东西是否是真正的 Promise。但这个方法并不完善，如果 Promise 来自其他窗口或某个自己实现 Promise 的库中，我们就无法判断其是否是真正可用的 Promise。

例如这样的 thenable 类型对象，它可能类似于 Promise 的方式工作完全就是侥幸。

```js
const p = {
  then(cb, ecb) {
    cb(42);
  },
};

p.then((val) => {
  console.log(val); // 42
});
```

如果情况是这样，那么在 thenable 的对象上注册的回调都会被执行，这样的行为和 Promise 完全不一致。

```js
const p = {
  then(cb, ecb) {
    cb(42);
    ecb('evil laugh');
  },
};

p.then(
  (val) => {
    console.log(val); // 42
  },
  (err) => {
    console.log(err); // 同样也被执行了！
  }
);
```

好在，Promise 给了我们解决办法：`Promise.resolve()`。`Promise.resolve()`可以接收任何 thenable 的值，将其解封为它的非 thenable 值。从`Promise.resolve()`得到的值将是一个真正的 Promise。

```js
Promise.resolve(p).then(
  (val) => {
    console.log(val); // 42
  },
  (err) => {
    console.log(err); // 没有被执行！
  }
);
```

所以在面对无法信任的 Promise 时，可以使用`Promise.resolve()`对其进行封装，将其变成真正的 Promise。

### 另外的调度技巧

在上述调度技巧中，p1 如果 resolve p3，则需要在下一个异步中将其展开。

```js
const p3 = new Promise((resolve) => {
  resolve('B');
});
const p1 = new Promise((resolve) => {
  resolve(p3);
});

p1.then((val) => {
  console.log(val);
});
```

而使用`Promise.resolve()`则会立即返回一个相同的 Promise。

```js
const p3 = new Promise((resolve) => {
  resolve(42);
});

const p1 = Promise.resolve(p3);

console.log(p1 === p3); // true
```

