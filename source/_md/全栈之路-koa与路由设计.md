最近想使用 koa 与 mongodb 做一个简单的后端。

## 监听文件更改

* [How to watch and reload ts-node when TypeScript files change](https://stackoverflow.com/questions/37979489/how-to-watch-and-reload-ts-node-when-typescript-files-change)

## 参数

参数`ctx`是由koa传入的封装了request和response的变量，我们可以通过它访问request和response，`next`是koa传入的将要处理的下一个异步函数。

```ts
// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
```

## middleware

每收到一个 http 请求，koa 就会调用通过`app.use()`注册的 async 函数，并传入`ctx`和`next`参数。koa 允许有多个异步函数，并且每个函数都可以用来处理对应部分的事情。在异步函数内使用`await next()`来调用下一个 async 函数。

我们将一个异步函数称之为 middleware。

我们可以将多个 middleware 串联在一起工作，组成处理链。并且由于`awit`的特性，我们可以手动控制下个 middleware 的执行时机。这样就可以非常简单的做一个记录处理时间的 middleware。

我们都是知道 JavaScript 代码是自上往下执行的，所以在前面的 middleware 如果没有调用`next()`方法，则后面的 middleware 就不会执行。

同理，最后一个 middleware 是不需要额外调用`next()`方法的。

```ts
import Koa from 'koa';
const app = new Koa();

app.use(async (ctx, next) => {
  // 记录时间
  const start = new Date().getTime();
  // 处理下个异步函数
  await next();
  // 处理结束后，记录处理的耗时
  const ms = new Date().getTime() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} Time: ${ms}ms`);
});

app.use(async (ctx, next) => {
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello, koa2!</h1>';
});

app.listen(3000);
console.log('⚡[server]: running on 3000!');
```

### koa-router

新的 koa router 使用的是 class。所以引入后使用`const router = new Router();`来初始化路由。

router 是直接定义了路径的访问规则`router.routes`，它最后被`app.use(router.routes)`所调用。它是一个 middleware，所以一般情况下在它内部不需要额外的调用`next()`

```ts
import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/hello/:name', async (ctx, next) => {
  // 获取 params
  const name: string = ctx.params.name;
  ctx.body = `<h1>hello! ${name}</h1>`;
});

router.get('/', async (ctx, next) => {
  ctx.body = `<h1>Index!</h1>`;
});

app.use(async (ctx, next) => {
  // 记录时间
  const start = new Date().getTime();
  // 处理下个异步函数
  await next();
  // 处理结束后，记录处理的耗时
  const ms = new Date().getTime() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} Time: ${ms}ms`);
});

app.use(router.routes());

app.listen(3000);
console.log('⚡[server]: running on 3000!');
```

#### allowedMethods

当所有路由中间件执行完成之后,若`ctx.status`为空或者404的时候,丰富`response`对象的`header`头。

```js
  var Koa = require('koa');
  var Router = require('koa-router');
 
  var app = new Koa();
  var router = new Router();
 
  app.use(router.routes());
  app.use(router.allowedMethods());
```

### koa-bodyparser

默认情况下 koa 处理 post 请求时，无法处理其 JSON 等 body。可以再使用一个中间件`koa-bodyparser`来处理post body 中携带的 JSON 请求。

```ts
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/hello/:name', async (ctx, next) => {
  const name: string = ctx.params.name;
  ctx.body = `<h1>hello! ${name}</h1>`;
});

router.get('/', async (ctx, next) => {
  ctx.body = `<h1>Index</h1>
  <form action="/signin" method="post">
      <p>Name: <input name="name" value="xfy" required></p>
      <p>Password: <input name="password" type="password"></p>
      <p><input type="submit" value="Submit"></p>
  </form>`;
});

router.post('/signin', async (ctx, next) => {
  ctx.body = ctx.request.body;
});

app.use(async (ctx, next) => {
  // 记录时间
  const start = new Date().getTime();
  // 处理下个异步函数
  await next();
  // 处理结束后，记录处理的耗时
  const ms = new Date().getTime() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} Time: ${ms}ms`);
});

app.use(router.routes());

app.listen(3000);
console.log('⚡[server]: running on 3000!');
```

### koa-static

koa-static 的目的是方便直接使用 koa 创建一个静态资源的 web 服务器。

```ts
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import staticServer from 'koa-static';

import duration from './middleware/duration';

const app = new Koa();
const router = new Router();

const staticPath = './static';

app.use(bodyParser());

router.post('/signin', async (ctx, next) => {
  ctx.body = ctx.request.body;
});

app.use(duration);

app.use(staticServer(path.join(__dirname, staticPath)));

app.listen(3000);
console.log('⚡[server]: running on 3000!');
```

## 路由设计

目录

```
├── nodemon.json
├── package.json
├── server
|  ├── app.ts
|  ├── controllers // 控制页面
|  |  └── test.ts  // test 路由等
|  ├── interface
|  |  └── index.ts
|  ├── middleware
|  |  └── duration.ts 
|  └── routers
|     └── index.ts  // 路由集合
├── static
```

这里将单独的路由都拆分到`controllers`目录内，并和其他单独页面逻辑放一起。然后由`routers/index.ts`将所有路由整合到一起，最后交由`app.ts`注册路由。

```ts
// test.ts
import { Context } from 'koa';

const test = async (ctx: Context) => {
  ctx.body = 'test!';
};

export default test;
```

```ts
// index.ts
import Router from 'koa-router';
import test from '../controllers/test';

const router = new Router();

router.get('/test', test);

export default router;
```

```ts
// app.ts
import router from './routers/index';

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
console.log('⚡[server]: running on 3000!');
```

### 处理 404

在访问没有指定的路由或路径时，会遇到 404 的错误。默认情况下 koa 会自己返回一个 Not Found 的页面，并一起发送一个 404 的状态码。

```ts
ctx.throw(404);
```

当然我们也可以手动接管这个处理，一个简单的中间件可以使其在 404 时返回指定的页面：

```ts
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status == 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.body = `<h1>404（；´д｀）ゞ</h1>`;
  }
});
```

## mongodb

