为了深入了解同步与异步编程，和充分理解这一理念。打算详细的了解与对比这两种编程模式。

## Node编程风格

随便搜寻几篇Node.js的文章便会发现，node主要的编程风格便是使用非阻塞（异步）编码风格。先通过一个日常的举例来了解下阻塞（同步）编码与非阻塞（异步）编码之间的差异。

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

这里使用了`while`通过不断的检查系统时间来创建一个阻塞的延迟动作，根据最后打印的时间戳，总共运行时间在21~23毫秒之间。

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

这里的异步使用了`setTimeout`来将事件超时运行。根据最后打印的时间戳，总共运行时间在25~30毫秒之间。

## 场景一小结

同步与异步除了