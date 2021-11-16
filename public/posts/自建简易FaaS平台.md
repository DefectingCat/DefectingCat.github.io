---
title: 自建简易 FaaS 平台
date: 2021-07-11 12:02:45
tags: [JavaScript,TypeScript]
categories: 实践
url: built-simply-faas
---

近些年来，传统的 IaaS、PaaS 已经无法满足人们对资源调度的需求了。各大云厂商相继开始推出自家的 Serverless 服务。Serverless 顾名思义，它是“无服务器”服务器。不过并不是本质上的不需要服务器，而是面向开发者（客户）无需关心底层服务器资源的调度。只需要利用本身业务代码即可完成服务的运行。

Serverless 是近些年的一个发展趋势，它的发展离不开 FaaS 与 BaaS。这里不是着重讨论 Serverless 架构的，而是尝试利用 Node.js 来实现一个最简易的 FaaS 平台。顺便还能对 JavaScript 语言本身做进一步更深的研究。

Serverless 平台是基于函数作为运行单位的，在不同的函数被调用时，为了确保各个函数的安全性，同时避免它们之间的互相干扰，平台需要具有良好的隔离性。这种隔离技术通常被称之为“沙箱”（Sandbox）。在 FaaS 服务器中，最普遍的隔离应该式基于 Docker 技术实现的容器级别隔离。它不同于传统虚拟机的完整虚拟化操作系统，而且也实现了安全性以及对系统资源的隔离。

但在这我们尝试实现一个最简易的 FaaS 服务，不需要利用上 Docker。基于进程的隔离会更加的轻便、灵活，虽然与容器的隔离性有一定差距。

## 环境搭建

这里利用 TypeScript 来对 JavaScript 做更严格的类型检查，并使用 ESlint + Prettier 等工具规范代码。

初始化环境：

```bash
yarn --init
```

添加一些开发必要工具：

```bash
yarn add typescript ts-node nodemon -D
```

以及对代码的规范：

```js
yarn add eslint prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```

当然不能忘了 Node 本身的 TypeScript lib。

```bash
yarn add @types/node -D
```

## 基础能力

在 [Nodejs多进程 | 🍭Defectink](https://www.defectink.com/defect/nodejs-multi-process.html) 一篇中，我们大概的探讨了进程的使用。这里也是类似。在进程创建时，操作系统将给该进程分配对应的虚拟地址，再将虚拟地址映射到真正的物理地址上。因此，进程无法感知真实的物理地址，只能访问自身的虚拟地址。这样一来，就可以防止两个进程互相修改数据。

所以，我们基于进程的隔离，就是让不同的函数运行再不同的进程中，从而保障各个函数的安全性和隔离性。具体的流程是：我们的主进程（master）来监听函数的调用请求，当请求被触发时，再启动子进程（child）执行函数，并将执行后的结果通过进程间的通信发送给主进程，最终返回到客户端中。

### 基于进程隔离

`chlid_process`是 Node.js 中创建子进程的一个函数，它有多个方法，包括 exec、execFile 和 fork。实际上底层都是通过 spawn 来实现的。这里我们使用 fork 来创建子进程，创建完成后，fork 会在子进程与主进程之间建立一个通信管道，来实现进程间的通信（IPC，Inter-Process Communication）。

其函数签名为：`child_process.fork(modulePath[, args][, options])`。

这里利用`child.process.fork`创建一个子进程，并利用`child.on`来监听 IPC 消息。

```ts
// master.ts
import child_process from 'child_process';

const child = child_process.fork('./dist/child.js');

// Use child.on listen a message
child.on('message', (message: string) => {
  console.log('MASTER get message:', message);
});
```

在 Node.js 中，process 对象是一个内置模块。在每个进程启动后，它都可以获取当前进程信息以及对当前进程进行一些操作。例如，发送一条消息给主进程。

子进程则利用 process 模块来和主进程进行通信

```ts
// child.ts
import process from 'process';

process.send?.('this is a message from child process');
```

执行这段方法后，master 就会创建一个子进程，并接收到其发来的消息。

```bash
$ node master.js
MASTER get message: this is a message from child process
```

![主进程与子进程间的通信](../images/%E8%87%AA%E5%BB%BA%E7%AE%80%E6%98%93FaaS/%E4%B8%BB%E8%BF%9B%E7%A8%8B%E4%B8%8E%E5%AD%90%E8%BF%9B%E7%A8%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1.svg)

到此，我们就实现了主进程与子进程之间的互相通信。但是需要执行的函数通常来自于外部，所以我们需要从外部手动加载代码，再将代码放到子进程中执行，之后将执行完的结果再发送回主进程，最终返回给调用者。

我们可以再创建一个`func.js`来保存用户的代码片段，同时在主进程中读取这段代码，发送给子进程。而子进程中需要动态执行代码的能力。什么方式能在 JavaScript 中动态的执行一段代码呢？

### Devil waiting outside your floor

没错，这里要用到万恶的 evil。在 JavaScript 中动态的加载代码，eval 函数是最简单方便，同时也是最危险和性能最低下的方式。以至于现代浏览器都不愿意让我们使用

```js
console.log(eval('2 + 2'))

// VM122:1 Uncaught EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self' blob: filesystem:".
```

执行来自用户的函数与普通函数略有一点区别，它与普通的函数不同，它需要利用 IPC 来返回值，而普通函数则之间 return 即可。我们不应该向用户暴露过度的内部细节，所以，用户的函数可以让他长这样：

```js
// func.js

(event, context) => {
  return { message: 'it works!', status: 'ok ' };
};
```

eval 函数不仅可以执行一行代码片段，它还可以执行一个函数。在拿到用户的匿名函数后，我们可以将其包装成一个立即执行函数（IIFE）的字符串，然后交给 eval 函数进行执行。

```js
const fn = `() => (2 + 2)`;
const fnIIFE = `(${fn})()`;
console.log(eval(fnIIFE));
```

> 不用担心，evil 会离我们而去的。

这里我们使用主进程读取用户函数，并使用 IPC 发送给子进程；子进程利用 eval 函数来执行，随后再利用 IPC 将其结果返回给主进程。

```ts
// master.ts
import child_process from 'child_process';
import fs from 'fs';

const child = child_process.fork('./dist/child.js');

// Use child.on listen a message
child.on('message', (message: unknown) => {
  console.log('Function result:', message);
});

// Read the function from user
const fn = fs.readFileSync('./src/func.js', { encoding: 'utf-8' });
// Sent to child process
child.send({
  action: 'run',
  fn,
});
```

```ts
// child.ts
import process from 'process';

type fnData = {
  action: 'run';
  fn: () => unknown;
};

// Listen function form master process
process.on('message', (data: fnData) => {
  // Convert user function to IIFE
  const fnIIFE = `(${data.fn})()`;
  const result = eval(fnIIFE);
  // Sent result to master process
  process.send?.({ result });
  process.exit();
});
```

![通过子进程动态运行函数代码片段](../images/%E8%87%AA%E5%BB%BA%E7%AE%80%E6%98%93FaaS/%E9%80%9A%E8%BF%87%E5%AD%90%E8%BF%9B%E7%A8%8B%E5%8A%A8%E6%80%81%E8%BF%90%E8%A1%8C%E5%87%BD%E6%95%B0%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5.svg)

### Devil crawling along your floor

前面我们利用 eval 函数获得了执行动态代码的能力，但与 Devil 做交易是需要付出代价的。很明显，我们付出了不小的安全性以及性能的代价。

甚至于用户代码能够直接修改 process，导致子进程无法退出等问题：

```js
(event, context) => {
  process.exit = () => {
    console.log('process NOT exit!');
  };
  return { message: 'function is running.', status: 'ok' };
};
```

eval 函数能够访问全局变量的原因在于，它们由同一个执行其上下文创建。如果能让函数代码在单独的上下文中执行，那么就应该能够避免污染全局变量了。

所以我们得换一个 Devil 做交易。在 Node.js 内置模块中，由一个名为 vm 的模块。从名字就可以得出，它是一个用于创建基于上下文的沙箱机制，可以创建一个与当前进程无关的上下文环境。

具体方式是，将沙箱内需要使用的外部变量通过`vm.createContext(sandbox)`包装，这样我们就能得到一个 contextify 化的 sandbox 对象，让函数片段在新的上下文中访问。然后，可执行对象的代码片段。在此处执行的代码的上下文与当前进程的上下文是互相隔离的，在其中对全局变量的任何修改，都不会反映到进程中。提高了函数运行环境的安全性。

```js
const vm = require('vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Contextify the object.

const code = 'x += 40; var y = 17;';
// `x` and `y` are global variables in the context.
// Initially, x has the value 2 because that is the value of context.x.
vm.runInContext(code, context);
```

在我们的 FaaS 中，我们无须在外层访问新的上下文对象，只需要执行一段函数即可。因此可以通过`vm.runInNewContext(code)`方法来快速创建一个无参数的新上下文，更快速创建新的 sandbox。

我们只需要替换到 eval 函数即可：

```ts
// child.ts
import process from 'process';
import vm from 'vm';

type fnData = {
  action: 'run';
  fn: () => unknown;
};

// Listen function form master process
process.on('message', (data: fnData) => {
  // Convert user function to IIFE
  const fnIIFE = `(${data.fn})()`;
  const result = vm.runInNewContext(fnIIFE);
  // Sent result to master process
  process.send?.({ result });
  process.exit();
});
```

现在，我们实现了将函数隔离在沙箱中执行，流程如图：

![在隔离的沙箱中执行函数](../images/%E8%87%AA%E5%BB%BA%E7%AE%80%E6%98%93FaaS/%E5%9C%A8%E9%9A%94%E7%A6%BB%E7%9A%84%E6%B2%99%E7%AE%B1%E4%B8%AD%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0.svg)

但 vm 真的安全到可以随意执行来自用户的不信任代码吗？虽然相对于 eval 函数来，它隔离了上下文，提供了更加封闭的环境，但它也不是绝对安全的。

根据 JavaScript 对象的实现机制，所有对象都是有原型链的（类似`Object.crate(null)`除外）。因此 vm 创建的上下文中的 this 就指向是当前的 Context 对象。而 Context 对象是通过主进程创建的，其构造函数指向主进程的 Object。这样一来，通过原型链，用户代码就可以顺着原型链“爬”出沙箱：

```js
import vm from 'vm';
(event, context) => {
  vm.runInNewContext('this.constructor.constructor("return process")().exit()');
  return { message: 'function is running.', status: 'ok' };
};
```

这种情况就会导致非信任的代码调用主程序的`process.exit`方法，从而让整个程序退出。

也许我们可以切断上下文的原型链，利用`Object.create(null)`来为沙箱创建一个上下文。与任何 Devil 做交易都是需要付出代价的：

> **The `vm` module is not a security mechanism. Do not use it to run untrusted code**.

### Devil lying by your side

好在开源社区有人尝试解决这个问题，其中一个方案就是 vm2 模块。vm2 模块是利用 Proxy 特性来对内部变量进行封装的。这使得隔离的沙箱环境可以运行不受信任的代码。

当然，我们需要手动添加一下依赖：

```bash
yarn add vm2
```

另一个值得庆幸的是，代码改动也很小。我们只需要对`child.ts`简单修改即可：

```ts
import process from 'process';
import { VM } from 'vm2';

type fnData = {
  action: 'run';
  fn: () => unknown;
};

// Listen function form master process
process.on('message', (data: fnData) => {
  // Convert user function to IIFE
  const fnIIFE = `(${data.fn})()`;
  const result = new VM().run(fnIIFE);
  // Sent result to master process
  process.send?.({ result });
  process.exit();
});
```

## HTTP服务

在实现了动态执行代码片段的能力后，为了让函数能够对外提供服务，我们还需要添加一个 HTTP API。这个 API 使得用户可以根据不同的请求路径来动态的执行对应的代码，并将其结果返回给客户端。

这里 HTTP 服务器选用的是 Koa。

```bash
yarn add koa
```

当然还要有其类型

```bash
yarn add @types/koa -D
```

为了响应 HTTP 请求并运行我们的函数，我们需要进一步的将运行子进行的方法封装为一个异步函数，并在接收到子进程的消息后，直接 resolve 给 Koa。

将前面的子进程的创建、监听以及读取文件都封装进一个函数：

```ts
// master.ts
import child_process from 'child_process';
import fs from 'fs/promises';
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
  ctx.response.body = await run();
});

const run = async () => {
  const child = child_process.fork('./dist/child.js');
  // Read the function from user
  const fn = await fs.readFile('./src/func.js', { encoding: 'utf-8' });
  // Sent to child process
  child.send({
    action: 'run',
    fn,
  });

  return new Promise((resolve) => {
    // Use child.on listen a message
    child.on('message', resolve);
  });
};

app.listen(3000);
```

现在我们的流程如下：

![用户通过HTTP触发函数的流程](../images/%E8%87%AA%E5%BB%BA%E7%AE%80%E6%98%93FaaS/%E7%94%A8%E6%88%B7%E9%80%9A%E8%BF%87HTTP%E8%A7%A6%E5%8F%91%E5%87%BD%E6%95%B0%E7%9A%84%E6%B5%81%E7%A8%8B.svg)

这样还不够，到目前为止，用户还只是请求的根路径，而我们响应的也只是同一个函数。因此我们还需要一个路由机制来支持不同的函数触发。

使用`ctx.request.path`就能获取到每次 GET 请求后的路径，所以这里也不用大费周章的去划分路由，直接把路径作为函数名，读取文件，执行即可。所以这里的改造就简单多了：

```ts
// master.ts
app.use(async (ctx) => {
  ctx.response.body = await run(ctx.request.path);
});

const run = async (path: string) => {
  const child = child_process.fork('./dist/child.js');
  // Read the function from user
  const fn = await fs.readFile(`./src/func/${path}.js`, { encoding: 'utf-8' });
  // Sent to child process
  child.send({
    action: 'run',
    fn,
  });

  return new Promise((resolve) => {
    // Use child.on listen a message
    child.on('message', resolve);
  });
};
```

至此，我们就实现了一个最简单的进程隔离 FaaS 方案，并提供了动态加载函数文件且执行的能力。

但这还不是全部，还有很多方面的问题值得去优化。

## 进阶优化

FaaS 并不只是简单的拥有动态的执行函数的能力就可以了，面对我们的还有大量的待处理问题。

### 进程管理

上述的方案看上去已经很理想了，利用子进程和沙箱防止污染主进程。但还有个主要的问题，用户的每一个请求都会创建一个新的子进程，并在执行完后再销毁。对系统来说，创建和销毁进程是一个不小的开销，且请求过多时，过多的进程也可能导致系统崩溃。

所以最佳的办法是通过进程池来复用进程。如下图，进程池是一种可以复用进程的概念，通过事先初始化并维护一批进程，让这批进程运行相同的代码，等待着执行被分配的任务。执行完成后不会退出，而是继续等待新的任务。在调度时，通常还会通过某种算法来实现多个进程之间任务分配的负载均衡。

![通过进程池管理子进程](../images/%E8%87%AA%E5%BB%BA%E7%AE%80%E6%98%93FaaS/%E9%80%9A%E8%BF%87%E8%BF%9B%E7%A8%8B%E6%B1%A0%E7%AE%A1%E7%90%86%E5%AD%90%E8%BF%9B%E7%A8%8B.svg)

早在 Node.js v0.8 中就引入了 cluster 模块。cluster 是对`child_process`模块的一层封装。通过它，我们可以创建共享服务器同一端口的子进程。

这时候我们就需要对`master.ts`进行大改造了。首先需要将`child_process`更换为 cluster 来管理进程，我们根创建CPU 超线程数量一半的子进程。这是为了留下多余的超线程给系统已经 Node 的事件循环来工作。顺便在每个子进程中监听对应的 HTTP 端口来启动 HTTP 服务。

```ts
// master.ts
import cluster from 'cluster';
import os from 'os';

const num = os.cpus().length;
const CPUs = num > 2 ? num / 2 : num;

if (cluster.isMaster) {
  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }
} else {
  const app = new Koa();

  app.use(async (ctx) => {
    ctx.response.body = await run(ctx.request.path);
  });

  app.listen(3000);
}
```

这里看上去有点匪夷所思，我们都知道，在操作系统中，是不允许多个进程监听同一个端口的。我们的多个子进程看上去监听的都是同一个端口！

实际上，在 Node.js 的 net 模块中，当当前进程是 cluster 的子进程时，存在一个特殊的处理。

简单来说就是，当调用 listen 方法监听端口后，它会判断是否处于 cluster 的子进程下。如果是子进程，则会向主进程发送消息，告诉主进程需要监听的端口。当主进程收到消息后，会判断指定端口是否已经被监听，如果没有，则通过端口绑定实现监听。随后，再将子进程加入一个 worker 队列，表明该子进程可以处理来自该端口的请求。

这样一来，实际上监听的端口的依然是主进程，然后将请求分发给 worker 队列中子进程。分发算法采用了 Round Robin 算法，即轮流处理制。我们可以通过环境变量`NODE_CLUSTER_SCHED_POLICY`或通过配置`cluster.schedulingPolicy`来指定其他的负载均衡算法。

总的来说，虽然我们的代码看上去是由子进程来多次监听端口，但实际上是由我们的主进程来进行监听。然后就指定的任务分发给子进程进行处理。

回到我们的逻辑上，由于可以直接在当前代码中判断和创建进程，我们也就不再需要`child.ts`了。子进程也可以直接在作用域中执行 run 函数了。

所以我们将`master.ts`完整的改造一下，最终我们就实现了基于 cluster 的多进程管理方案：

```ts
import cluster from 'cluster';
import os from 'os';
import fs from 'fs/promises';
import Koa from 'koa';
import { VM } from 'vm2';

const num = os.cpus().length;
const CPUs = num > 1 ? Math.floor(num / 2) : num;

const run = async (path: string) => {
  try {
    // Read the function from user
    const fn = await fs.readFile(`./src/func/${path}.js`, {
      encoding: 'utf-8',
    });
    // Use arrow function to handle semicolon
    const fnIIFE = `const func = ${fn}`;
    return new VM().run(`${fnIIFE} func()`);
  } catch (e) {
    console.log(e);
    return 'Not Found Function';
  }
};

if (cluster.isMaster) {
  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }
} else {
  const app = new Koa();

  app.use(async (ctx) => {
    ctx.response.body = await run(ctx.request.path);
  });

  app.listen(3000);
}
```

### 限制函数执行时间

上述，我们利用多进程方案来提高整体的安全性。但是，目前还没有考虑死循环的情况。当用户编写了一个这样的函数时：

```js
const loop = (event, context) => {
  while (1) {}
  return { message: 'this is function2!!!', status: 'ok ' };
};
```

我们的进程会一直为其计算下去，无法正常退出，导致资源被占用。所以我们理想的情况下就是在沙箱外限制没个函数的执行时长，当超过限定时间时，之间结束该函数。

好在，vm 模块赋予了我们这一强大的功能：

```js
vm.runInNewContext({
    'loop()',
    { loop, console },
    { timeout: 5000 }
})
```

通过 timeout 参数，我们为函数的执行时间限制在 5000ms 内。当死循环的函数执行超 5s 后，随后会得到一个函数执行超时的错误信息。

由于 vm2 也是基于 vm 进行封装的，因此我们可以在 vm2 中使用和 vm 相同的能力。只需要小小的改动就可以实现限制函数执行时长能力：

```js
return new VM({ timeout: 5000 }).run(`${fnIIFE} func()`);
```

看上去不错！但 Devil 不会就这么轻易放过我们的。JavaScript 本身是单线程的语言，它通过出色的异步循环来解决同步阻塞的问题。异步能解决很多问题，但同时也能带来问题。事件循环机制目前管理着两个任务队列：事件循环队列（或者叫宏任务）与任务队列（常见的微任务）。

我们可以把每次的事件循环队列内的每次任务执行看作一个 tick，而任务队列就是挂在每个 tick 之后运行的。也就是说微任务只要一直在运行，或者一直在添加，那么就永远进入不到下一次 tick 了。这和同步下死循环问题一样！

事件循环通常包含：setTimout、setInterval和 I/O 操作等，而任务队列通常为：`process.nextTick`、Promise、MutationObserver 等。

VM2 也有类似 VM 的 timeout 设置，但是同样的是，它也是基于事件循环队列所设置的超时。根本来说，它无法限制任务队列中的死循环。

面对这个难题，考虑了很久，也导致这个项目拖了挺长一段时间的。摸索中想到了大概两个方法能够解决这个问题：

1. 继续使用 cluster 模块，cluster 模块没有直接的 API 钩子给我们方便的在主进程中实现计时的逻辑。我们可以考虑重写任务分发算法，在 Round Robin 算法的的基础上实现计时的逻辑。从而控制子进程，当子进程超时时，直接结束子进程的声明周期。
2. 第二个方法是，放弃使用 cluster 模块，由我们亲自来管理进程的分发已经生命周期，从而达到对子进程设置执行超时时间的限制。

这两个方法都不是什么简单省事的方法，好在我们有优秀的开源社区。正当我被子进程卡主时，得知了一个名为 [Houfeng/safeify: 📦 Safe sandbox that can be used to execute untrusted code. (github.com)](https://github.com/Houfeng/safeify) 的项目。它属于第二种解决办法，对`child_process`的手动管理，从而实现对子进程的完全控制，且设置超时时间。

虽然上述写的 cluster 模块的代码需要重构，并且我们也不需要 cluster 模块了。利用 safeify 就可以进行对子进程的管理了。

所以这里对 Koa 的主进程写法就是最常见的方式，将控制和执行函数的逻辑抽离为一个 middleware，交由路由进行匹配：

```ts
import Koa from 'koa';
import runFaaS from './middleware/faas';
import logger from 'koa-logger';
import OPTION from './option';
import router from './routers';
import bodyParser from 'koa-bodyparser';
import cors from './middleware/CORS';

const app = new Koa();

app.use(logger());
app.use(bodyParser());
app.use(cors);
// 先注册路由
app.use(router.routes());
app.use(router.allowedMethods());
// 路由未匹配到的则运行函数
app.use(runFaaS);

console.log(`⚡[Server]: running at http://${OPTION.host}:${OPTION.port} !`);

export default app.listen(OPTION.port);
```

## 总结

我的简易 FaaS 基本上到这里就告一段落了，对 Devil 的最后针扎就是限制函数的异步执行时间。实际上还有一些可以优化的点。例如对函数执行资源的限制，即便我们对函数的执行时间有了限制，但在函数死循环的几秒钟，它还是占有了我们 100% 的 CPU。如果多个进程的函数都会占满 CPU 的执行，那么到最后服务器的资源可能会被消耗殆尽。

针对这个情况也有解决办法：在 Linux 系统上可以使用 CGroup 来对 CPU 和系统其他资源进程限制。其实 safeify 中也有了对 CGroup 的实现，但我最终没有采用作用这个方案，因为在 Docker 环境中，资源本身已经有了一定的限制，而且 Container 中大部分系统文件都是 readonly 的，CGroup 也不好设置。

还有一个优化的地方就是可以给函数上下文提供一些内置的可以函数，模仿添加 BaaS 的实现，添加一个常用的服务。不过最终这个小功能也没有实现，因为（懒）这本来就是一个对 FaaS 的简单模拟，越是复杂安全性的问题也会随着增加。

## 推荐

无利益相关推荐：

目前市面上大部分对于 Serverless 的书籍都是研究其架构的，对于面向前端的 Serverless 书籍不是很常见。而《前端 Serverless：面向全栈的无服务器架构实战》就是这样一本针对我们前端工程师的书籍，从 Serverless 的介绍，到最后的上云实践，循序渐进。

本篇也大量参考其中。

![book](../images/%E8%87%AA%E5%BB%BA%E7%AE%80%E6%98%93FaaS/book.jpg)

## 把玩

[FaaS](https://demo.defectink.com/faas/#/)
