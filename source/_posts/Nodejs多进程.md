---
title: Nodejs多进程
date: 2021-06-01 13:32:29
tags: [JavaScript, Nodejs]
categories: 实践
url: nodejs-multi-process
index_img: /images/Nodejs%E5%A4%9A%E8%BF%9B%E7%A8%8B/logo.webp
---

众所周知，JavaScript 是一门单线程的语言。但它的实现环境可以帮助我们创建多进程甚至是多线程，这样在遇到高压力的性能计算时，可以更好的利用多核 CPU 资源。

## 基本概念

- 调度：线程作为调度和分配的基本单位，进程作为拥有资源的基本单位；
- 并发性：不仅进程之间可以并发执行，同一个进程的多个线程之间也可并发执行；
- 拥有资源：进程是拥有资源的一个独立单位，线程不拥有系统资源，但可以访问隶属于进程的资源；
- 系统开销：在创建或撤消进程时，由于系统都要为之分配和回收资源，导致系统的开销明显大于创建或撤消线程时的开销。进程和线程的关系：

基本总结，一个进程可以有多个线程，线程之间可以相互通信。

进程是 `CPU资源分配` 的最小单位；进程内的线程共享进程的资源。

线程是 `CPU计算调度` 的最小单位。线程是真正用来执行程序的，执行计算的

### 多进程与多线程

- 多进程：在同一个时间里，同一个计算机系统中如果允许两个或两个以上的进程处于运行状态。多进程带来的好处是明显的，比如你可以听歌的同时，打开编辑器敲代码，编辑器和听歌软件的进程之间丝毫不会相互干扰。
- 多线程：程序中包含多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务，也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。

以Chrome浏览器中为例，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。

## 多进程优势

例如我们有大量的 CPU 计算任务需要进行，而使用单个进程的性能必定需要等待前个任务计算完才能计算下一个。因为是 CPU 大量计算的任务，这使用事件循环也不好处理。

做个简单的例子，这里使用斐波那契数列做个 CPU 任务的模拟，为了模拟到位，这里使用比较耗时的递归来计算斐波那契数列。

```ts
const start = Date.now();
const fibo = (n: number): number => {
  if (n <= 1) {
    return n;
  }
  return fibo(n - 1) + fibo(n - 2);
};

console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
console.log(`pid: ${process.pid} result: ${fibo(40)} time: ${Date.now() - start}ms`);
```

我的 Ryzen 7 4800U 有 16 个核心（超线程），但不推荐直接占满所有的进程，所里这里计算了 8 次，用于等下与 8 个进程对比。由于是但进程的模式，所有整个计算过程是阻塞的，且 pid 是相同的，耗时也是累加的。也就是说计算完这 8 个斐波那契数列需要总共花费 8321 毫秒。

```bash
$ npx ts-node test.ts 
pid: 2112 result: 102334155 time: 1549ms
pid: 2112 result: 102334155 time: 2600ms
pid: 2112 result: 102334155 time: 3549ms
pid: 2112 result: 102334155 time: 4472ms
pid: 2112 result: 102334155 time: 5445ms
pid: 2112 result: 102334155 time: 6388ms
pid: 2112 result: 102334155 time: 7360ms
pid: 2112 result: 102334155 time: 8321ms
```

## 多进程改造

Node 是单进程，这就会存在一个问题，无法充分利用CPU等资源。Node提供 [child_process](http://nodejs.cn/api/child_process.html) 实现子进程，从而试下广义的多进程模式。通过 `child_process` 可以实现一个主进程，多个子进程模式，主进程称为 `master` 进程,子进程称为`worker` 进程。

Node 提供了 `child_process` 模块来创建子进程，创建的方法包括*异步*和*同步*。这里只涉及到异步创建。

### 创建多进程

node 中有提供`child_process`模块，这个模块中，提供了多个方法来创建子进程：

```js
const { spawn, exec, execFile, fork } = require('child_process');
```

在这里的 fork 创建是最为方便且容易理解的，后续就使用 fork 来进行多进程改造。当然 exec 和 execFile 也可以运行其他的脚本，这里只需要用上 fork。

关于其他的，可以去 [Child process | Node.js v16.1.0 Documentation (nodejs.org)](https://nodejs.org/api/child_process.html#child_process_asynchronous_process_creation) 查看。

### 进程间通信

node 主要是主进程与子进程间的通信，主进程和子进程之间是通过 IPC（Inter Process Communication，进程间通信）进行通信的，IPC 也是由底层的 libuv 根据不同的操作系统来实现的。

我这里将斐波那契的计算分为两个文件，分别是`app.ts`作为主进程用来创建和管理子进程，和`worker.ts`用来计算斐波那契数列。

主进程这里使用`for`循环来根据 CPU 的数量创建子进程。同时因为 node 使用事件循环的工作模式，所以这里不推荐一次性沾满所有的 CPU 超线程，node 底层会用到其他核CPU进行事件循环的处理。如果创建了过多的子进程，可能会导致内存溢出，甚至阻塞事件循环。最终导致整体性能下降。

```ts
// app.ts
import os from 'os';
import { fork } from 'child_process';
import path from 'path';

const cpus = os.cpus().length;
// 大于4个超线程时，派分子进程
const len = cpus >= 4 ? cpus / 2 : 1;

const file = path.resolve(__dirname, 'worker.ts');

for (let i = 0; i < len; i++) {
  const worker = fork(file);
  worker.send(40);
}
```

而 worker 就简单一点了，它只负责接受主进程发送的消息并计算即可。

```ts
const start = Date.now();
const fibo = (n: number): number => {
  if (n <= 1) {
    return n;
  }
  return fibo(n - 1) + fibo(n - 2);
};

process.on('message', (num) => {
  const result = `pid: ${process.pid} result: ${fibo(num)} time: ${
    Date.now() - start
  }ms`;
  console.log(result);
});
```

### 运行

虽然将子进程单独分成了一个文件，但这里只需要运行主进程文件即可。可以看到相较于之前的单进程逐个计算八次，这里利用多个进程同时计算，总共耗时在 2000 毫秒左右。

```bash
$ node app.js 
pid: 30800 result: 102334155 time: 2116ms
pid: 34432 result: 102334155 time: 2043ms
pid: 26580 result: 102334155 time: 2052ms
pid: 21552 result: 102334155 time: 2148ms
pid: 1648 result: 102334155 time: 2112ms
pid: 18840 result: 102334155 time: 2131ms
pid: 33228 result: 102334155 time: 2213ms
pid: 26144 result: 102334155 time: 2184ms
```

这里只涉及到了多进程的九牛一毛，面对多进程的管理后续还有许多工作需要做，包括进程守护与管理，以及监听端口的问题。使用 fork 都有对应的解决方案，不过这里不深究。上述斐波那契案例只是为了体验下多进程带来的性能上的提升，而 Node.js 常用的案例还是作为 Web 服务器。下面就使用官方基于 fork 的模块 cluster 来改造我之前的一个 koa 后端。

## cluster

cluster 就是在 fork 的基础上进行封装的模块，它可以更方便的使我们去创建多个进程并进行管理。

### 项目概览

先来看下这个项目的大概情况，这个项目很简单，使用 koa 搭建的一个后端 API 服务器。数据库使用的 MongoDB 来存储数据，koa 的主要工作就是根据 http 携带的参数查询数据库中的数据，并返回。

```ts
import Koa from 'koa';
import option from './config';
import router from './routers/index';
import logger from 'koa-logger';
import { cors } from './middleware/CORS';

const app = new Koa();

app.use(logger());
app.use(cors);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(option.port);

console.log(`⚡[server]: running on ${option.port}!`);
```

目前这是标准的 koa 服务器，为了后续对比，先使用 ab（Apache HTTP server benchmarking tool）来进行个简单的测试：

```bash
root@xfy-virtual-machine:~# ab -c 100 -n 3000 http://192.168.0.110/home/multidata
# ...省略一部分不重要的内容
Concurrency Level:      100
Time taken for tests:   25.130 seconds
Complete requests:      3000
Failed requests:        0
Total transferred:      14250000 bytes
HTML transferred:       13299000 bytes
Requests per second:    119.38 [#/sec] (mean)
Time per request:       837.660 [ms] (mean)
Time per request:       8.377 [ms] (mean, across all concurrent requests)
Transfer rate:          553.77 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    7   1.8      7      13
Processing:    80  824 179.3    764    1620
Waiting:       68  775 168.3    717    1614
Total:         83  831 179.4    771    1629

Percentage of the requests served within a certain time (ms)
  50%    771
  66%    802
  75%    861
  80%    896
  90%   1102
  95%   1223
  98%   1346
  99%   1488
 100%   1629 (longest request)
root@xfy-virtual-machine:~#
```

发了 100 个并发，3000 个请求，耗时 25 秒，吞吐量 119。数据还行，虽然当时测的时候它占满了我 16 个超线程有点震惊，但最后每秒请求还是只有 120 左右。

### 添加进程

虽然 JavaScript 是单线程的，但是它的实现环境 NodeJs 是多线程的。在没有实现多进程的情况下，node 的事件循环也会利用到当前系统下多余的 CPU 超线程的。也就是说，单进程的情况下，它也可以占满所有的 CPU 核心，最大化性能。

但一个主进程的事件循环和多个主进程同时工作，在某些情况下，提供的性能是不同的。同时进程不推荐直接占满所有 CPU 的超线程，最好只占一半，留下事件循环等其他的操作的空间。否则可能会适得其反，导致最终性能的下降。

cluster 用起来相比`child_process.fork()`略微要容易理解一点：

```ts
import os from 'os';
import Koa from 'koa';
import option from './config';
import router from './routers/index';
import logger from 'koa-logger';
import cluster, { worker } from 'cluster';
import { cors } from './middleware/CORS';

const app = new Koa();
const cpus = os.cpus().length;
// 大于4个超线程时，派分子进程
const len = cpus >= 4 ? cpus / 2 : 1;

if (cluster.isMaster) {
  console.log(`主进程${process.pid}正在运行`);

  // 衍生工作进程
  for (let i = 0; i < len; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程${worker.process.pid}已经退出`);
  });

  console.log(`⚡[server]: running on ${option.port}!`);
} else {
  app.use(logger());
  app.use(cors);
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(option.port);
  console.log(`工作进程${process.pid}已经启动！`);
}
```

使用`cluster.isMaster`来判断当前是否是主进程，如果是主进程则 fork 对应数量的子进程，如果不是，则直接执行子进程的逻辑。监听的端口等小问题都由 cluster 帮我们解决了。

改造很简单，只需要把之前对应的业务逻辑放到 else 语句里即可。

改造完成之后就是来看下激动人心的数据了：

```bash
root@xfy-virtual-machine:~# ab -c 100 -n 3000 http://192.168.0.110/home/multidata
# ...省略一部分不重要的内容
Concurrency Level:      100
Time taken for tests:   11.157 seconds
Complete requests:      3000
Failed requests:        0
Total transferred:      14250000 bytes
HTML transferred:       13299000 bytes
Requests per second:    268.89 [#/sec] (mean)
Time per request:       371.905 [ms] (mean)
Time per request:       3.719 [ms] (mean, across all concurrent requests)
Transfer rate:          1247.27 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    5   2.0      5      21
Processing:   150  358 108.8    334     968
Waiting:      140  343 104.0    320     949
Total:        168  364 109.6    339     983

Percentage of the requests served within a certain time (ms)
  50%    339
  66%    385
  75%    416
  80%    433
  90%    497
  95%    564
  98%    668
  99%    794
 100%    983 (longest request)
root@xfy-virtual-machine:~#
```

发了 100 个并发，3000 个请求，耗时 11 秒，吞吐量 268。整体性能翻了一倍左右，这应该是当前这个 koa 项目对这颗 4800U 的最大利用了。

### 再快一点点

上述使用多进程已经很快了，但是突然发现了一个盲点，那就是每次请求都会查询一次数据库，无论查询的数据是否是相同的。我们都知道，访问一个数据最快的方式是从内存中取得数据，其次是内存型数据库（如redis）。

```
内存 -> 内存数据库 -> 传统数据库（可能是磁盘上的数据）
```

于是想到了缓存，当查询参数相同时，直接返回上次查询的结果，不用再次劳驾我们的 MongoDB 了。这种缓存方式适用于连续查询同一个数据，当查询不同的数据时，还是需要查询数据库。这也是为了再查询和节约内存之间做了个抉择。

这里为查询 Mongo 做了个小小的更新，每次查询数据库之前，都检查下会不会命中缓存。

```ts
    // 使用 string 在 Map 中存储缓存数据
    const strQuery = JSON.stringify(query);
    /**
     * 检查缓存对象中是否有数据，
     * 如果有数据，则再检查是否有Map，
     * 如果都有，则直接返回缓存的数据，不查询数据库
     */
    if (cacheObj.hasOwnProperty(collection)) {
      if (cacheObj[collection].has(strQuery)) {
        res = cacheObj[collection].get(strQuery);
        console.log('命中缓存');
      } else {
        await queryMongo();
        cacheObj[collection] = new Map();
        res ? cacheObj[collection].set(strQuery, res) : void 0;
      }
    } else {
      await queryMongo();
      cacheObj[collection] = new Map();
      res ? cacheObj[collection].set(strQuery, res) : void 0;
    }
```

再来看下测压的数据：

```bash
root@xfy-virtual-machine:~# ab -c 100 -n 3000 http://192.168.0.112/home/multidata
# ...省略一部分不重要的内容
Concurrency Level:      100
Time taken for tests:   9.406 seconds
Complete requests:      3000
Failed requests:        0
Total transferred:      14250000 bytes
HTML transferred:       13299000 bytes
Requests per second:    318.94 [#/sec] (mean)
Time per request:       313.543 [ms] (mean)
Time per request:       3.135 [ms] (mean, across all concurrent requests)
Transfer rate:          1479.44 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    6   2.1      5      28
Processing:    58  300 176.8    252    1148
Waiting:       47  292 175.0    245    1139
Total:         67  306 177.1    257    1154

Percentage of the requests served within a certain time (ms)
  50%    257
  66%    296
  75%    321
  80%    353
  90%    426
  95%    590
  98%   1092
  99%   1106
 100%   1154 (longest request)
```

发了 100 个并发，3000 个请求，耗时 9 秒，吞吐量 318。但这是 3000 个请求全部都请求同一个数据时的结果，实际情况提升估计没有这么大，但还是有一点的。如果连续访问同一条数据比较多的话，那么这中缓存还是能带来一些性能提升的，至少心里安慰是有了
