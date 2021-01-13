为了深入了解同步与异步编程，和充分理解这一理念。打算详细的了解与对比这两种编程模式。

## Node编程风格

随便搜寻几篇 Node.js 的文章便会发现，node 主要的编程风格便是使用非阻塞（异步）编码风格。先通过一个日常的举例来了解下阻塞（同步）编码与非阻塞（异步）编码之间的差异。

## 同步与异步的对比 – 场景一

Node.js 官网关于阻塞式 I/O 的定义如下：

> “阻塞表示 Node.js 进程中其他 JavaScript 的执行必须等到非 JavaScript 操作完成后才能继续的情况。发生这种情况的原因在于，当发生阻塞操作时，事件循环无法继续运行 JavaScript。
> 在 Node.js 中，由于 CPU 占用率高而不是等待非 JavaScript 操作（如 I/O）导致性能欠佳的 JavaScript 通常并不被称为阻塞。”

### 同步

普通的同步风格程序。它在 V8 线程上自上而下运行，仅占用少量 CPU，这是非技术层面的阻塞。

```js
'use strict'
console.log(Date.now().toString() + ': 主进程开始;');
console.log(Date.now().toString() + ': 创造一个延迟;');
let start = Date.now();
let end = start;
while(end < start + 20) {
    end = Date.now();   // 阻塞延迟
}
console.log(Date.now().toString() + ': 主进程结束;');
```

这里使用了`while`通过不断的检查系统时间来创建一个阻塞的延迟动作，根据最后打印的时间戳，总共运行时间在 21~23 毫秒之间。

### 异步

使用异步的方式创建了与上述同样效果的实例。

```js
'use strict'
console.log(Date.now().toString() + ': 主进程开始;');
setTimeout(() => {
    console.log(Date.now().toString() + ': 事件循环回调');
}, 20);
console.log(Date.now().toString() + ': 主进程结束;');
```

这里的异步使用了`setTimeout`来将事件超时运行。根据最后打印的时间戳，总共运行时间在 25~30 毫秒之间。

## 场景一小结

经过上述的小实验，不难发现同步的运行时间比异步还短那么几毫秒。异步反而更慢，异步编程风格并不关乎单纯的速度，而是关乎可扩展性。

## 模块系统

模块化是现代软件开发中的一个关键概念。它使我们能够构建更健壮的代码，并在多处复用代码，而无需重复编写相同的代码。

Node 模块化不仅为我们提供了上述所有好处，还提供了：

* 自动封装。默认情况下，一个模块中的所有代码都被打包到函数包装程序中，以便对模块外部的其他 JavaScript 代码隐藏。

* 一种公开模块接口的方式。模块中的函数、变量和其他构造必须通过 module.exports（或者其简短表示：exports）对模块外部的 JavaScript 模块显式公开。

### 引入模块

在 ES6 发布后，module 成为标准。曾经的我们采用的是 CommonJS 规范，使用`require()`来引入模块。目前的 ES6 标准使用`import`来引入模块。

```js
let fs = require('fs');
import fs from 'fs';
```

ES2015 的 module