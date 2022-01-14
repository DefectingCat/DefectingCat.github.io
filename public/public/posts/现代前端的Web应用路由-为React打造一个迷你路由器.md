---
title: 现代前端的 Web 应用路由-为 React 打造一个迷你路由器
date: 2021-08-23 17:28:49
tags: [JavaScript, React]
categories: 实践
url: create-tiny-router-for-react
index_img: /images/为React造一个迷你路由器/react-router.svg
---

路由不仅仅只是网络的代名词，它更像是一种表达路径的概念。与网络中的路由相似，前端中的页面路由也是带领我们前往指定的地方。

![router](../images/%E4%B8%BAReact%E9%80%A0%E4%B8%80%E4%B8%AA%E8%BF%B7%E4%BD%A0%E8%B7%AF%E7%94%B1%E5%99%A8/router.webp)

## 现代前端的 Web 应用路由

时代在变迁，过去，Web 应用的基本架构使用了一种不同于现代路由的方法。曾经的架构通常都是由后端生成的 HTML 模板来发送给浏览器。当我们单击一个标签导航到另一个页面时，浏览器会发送一个新的请求给服务器，然后服务器再将对应的页面渲染好发过来。也就是说，每个请求都会刷新页面。

自那时起，Web 服务器在设计和构造方面经历了很多发展（前端也是）。如今，JavaScript 框架和浏览器技术已经足够先进，允许我们利用 JavaScript 在客户端渲染 HTML 页面，以至于 Web 应用可以采用更独特的前后的分离机制。在第一次由服务端下发了对应的 JavaScript 代码后，后续的工作就全部交给客户端 JavaScript。而后端服务器负责发送原始数据，通常是 JSON 等。

![Web架构](../images/%E4%B8%BAReact%E9%80%A0%E4%B8%80%E4%B8%AA%E8%BF%B7%E4%BD%A0%E8%B7%AF%E7%94%B1%E5%99%A8/Web%E6%9E%B6%E6%9E%84.svg)

在旧架构中，动态内容由 Web 服务器生成，服务器会在数据库中获取数据，并利用数据渲染 HTML 模板发送给浏览器。每次切换页面都会获取新的由服务端渲染的页面发送给浏览器。

在新架构中，服务端通常只下发主要的 JavaScript 和基本的 HTML 框架。之后页面的渲染就会由我们的 JavaScript 接管，后续的动态内容也还是由服务器在数据库中获取，但不同的是，后续数据由服务器发送原始格式（JSON等）。前端 JavaScript 由 AJAX 等技术获取到了新数据，再在客户端完成新的 HTML 渲染。

好像 SPA 的大概就是将原先服务端干的活交给了前端的 JavaScript 来做。事实上，确实如此。AJAX 技术的发展，带动了客户端 JavaScript 崛起，使得原先需要在服务端才能完成渲染的动态内容，现在交给 JavaScript 就可以了。

这么做的好处有很多：

* 主要渲染工作在客户端，减少服务器的压力。简单的场景甚至只需要静态服务器。
* 新内容获取只需要少量交互，而不是服务端发送渲染好的 HTML 页面。
* 可以利用 JavaScript 在客户端修改和渲染任意内容，同时无需刷新整个页面。
* ……

当然同时也有一些缺点，目前最主要的痛点：

* 首屏/白屏时间：由于 HTML 内容需要客户端 JavaScript 完成渲染，前端架构以及多种因素会影响首次内容的出现时间。
* 爬虫/SEO：由于 HTML 内容需要客户端 JavaScript 完成渲染，早期的爬虫可能不会在浏览器环境下执行 JavaScript，这就导致了根本爬取不到 HTML 内容。

> Google 的爬虫貌似已经可以爬取 SPA。

## React 的路由

React 是现代众多成熟的 SPA 应用框架之一，它自然也需要使用路由来切换对应的组件。React Router 是一个成熟的 React 路由组件库，它实现了许多功能，同时也非常还用。

首先来看下本次路由的基本工作原理，本质上很简单，我们需要一个可以渲染任意组件的父组件 `<Router />` 或者叫 `<router-view>` 之类的。然后再根据浏览器地址的变化，渲染注册路由时对应的组件即可。

![迷你路由器](../images/%E4%B8%BAReact%E9%80%A0%E4%B8%80%E4%B8%AA%E8%BF%B7%E4%BD%A0%E8%B7%AF%E7%94%B1%E5%99%A8/%E8%BF%B7%E4%BD%A0%E8%B7%AF%E7%94%B1%E5%99%A8.svg)

### 配置文件

这里选择类似 Vue Router 的配置文件风格，而不是使用类似 `<Route />` 这样的 DOM 结构来注册路由。我们的目的是为了实现一个非常简单的迷你路由器，所以配置文件自然也就很简单：

```ts
import { lazy } from 'react';

export default [
  {
    path: '/',
    component: lazy(() => import('../pages/Home')),
  },
  {
    path: '/about',
    component: lazy(() => import('../pages/About')),
  },
];
```

一个 `path` 属性，对应了浏览器的地址，或者说 `location.pathname`；一个 `component` 属性，对应了到该地址时所需要渲染的组件。

甚至还可以使用 `lazy()` 配合 `<Suspense>` 来实现代码分割。

### 展示路由

一个非常简单的路由就这样注册好了，接下来就是将对应的组件展示出来。我们都知道，JSX 最终会被 babel 转义为渲染函数，而一个组件的 `<Home />` 写法，基本等同于 `React.createElement(Home)`。[元素渲染 – React (reactjs.org)](https://zh-hans.reactjs.org/docs/rendering-elements.html#updating-the-rendered-element)

所以动态的渲染指定的组件基本上也就很容易解决，接下来的思路也就很简单了，我们需要：

* 一个状态：记录当前地址 `location.pathname`；
* 根据当前地址在配置文件中寻找对应注册的组件，并将它渲染出来；
* 一个副作用：当用户手动切换路由时，该组件需要重新渲染为对应注册的路由；

先不考虑切换路由的问题，前两个基本上已经就实现了：

```tsx
// Router.tsx
import React, { useState, Suspense } from 'react';
import routes from './routes';

const Router: React.FC = () => {
  // 获取地址，并保存到状态中
  const [path, setPath] = useState(location.pathname);
  // 根据地址，寻找对应的组件
  const element = routes.find((route) => route.path === path)?.component;

  return (
    <>
      <Suspense fallback={<p>loading...</p>}>
      	{/* 使用 React.createElement() 渲染组件 */}
        {element ? React.createElement(element) : void 0}
      </Suspense>
    </>
  );
};

export default Router;
```

看上去很简单，事实上，确实很简单。

现在我们直接从地址栏访问对应的路由，我们的 Router 组件应该就可以根据已经注册好的路由配置文件来找到正确的组件，并将其渲染出来了。

![image-20210823154009498](../images/%E4%B8%BAReact%E9%80%A0%E4%B8%80%E4%B8%AA%E8%BF%B7%E4%BD%A0%E8%B7%AF%E7%94%B1%E5%99%A8/image-20210823154009498.webp)

### 切换路由

到目前为止，我们实现了根据对应地址访问到对应组件的功能。这是一个路由必不可少的功能，但它还不能称得上是一个简单的路由器，因为它还无法处理用户手动切换的路由，也就是点击标签前往对应的页面。

简单梳理一下我们需要实现的功能：

* 一个 Link 组件，用于点击后导航到指定的地址；
* 导航到地址后，还要修改浏览器的地址栏，并不真正的发送请求；
* 通知 Router 组件，地址已经改变，重新渲染对应路由的组件；

```tsx
import React from 'react';

interface Props {
  to: string;
  children?: React.ReactNode;
}

const RouterLink: React.FC<Props> = ({ to, children }: Props) => {
  /**
   * 处理点击事件
   * 创建自定义事件监听器
   * 并将 path 发送给 router
   * @param e
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const nowPath = location.pathname;
    if (nowPath === to) return; // 原地跳转

    history.pushState(null, '', to);
    document.dispatchEvent(
      new CustomEvent<string>('route', {
        detail: to,
      })
    );
  };

  return (
    <>
      <a href="" onClick={handleClick}>
        {children}
      </a>
    </>
  );
};

export default RouterLink;
```

我们将 Link 组件实际的渲染为一个 `<a></a>` 标签，这样就能模拟跳转到指定的导航了。这个组件它接收两个参数：`{ to, children }`，分别是前往的路由地址和标签的内容。标签的内容 children 就是展示在 a 标签内的文本。

我们需要解决的第一个问题就是点击标签后跳转到指定的导航，这里其实需要分成两个部分，第一个部分是悄悄的修改浏览器地址栏，第二个部分则是通知 Router 组件去渲染对应的组件。

修改地址栏很简单，利用到浏览器的 history API，可以很方便的修改 `pathName` 而不发送实际请求，这里只需要修改到第一个参数 to 即可：`history.pushState(null, '', to);`。

但使用 `pushState()` 并不会发出任何通知，我们需要自己实现去通知 Router 组件地址已经变化。本来像利用第三方库来实现一个 发布/订阅 的模型的，但这样这个路由器可能就没有那么迷你了。最后发现利用 HTML 的 CustomEvent 可以实现一个简单的消息订阅与发布模型。

HTML 自定义事件也很简单，我们在对应的 DOM 上 `dispatchEvent` 即可触发一个事件，而触发的这个事件，就是 `CustomEvent` 的实例，甚至还能传递一些信息。在这里，我们将路由地址传递过去。

```ts
    document.dispatchEvent(
      new CustomEvent<string>('route', {
        detail: to,
      })
    );
```

而在 Router 组件中，只需要和以前一样在对应的 DOM 上去监听一个事件，这个事件就是刚刚发布的 `CustomEvent` 的实例。

```ts
  //  Router.tsx
  const handleRoute = (e: CustomEvent<string>) => {
    console.log(e.detail);
    setPath(e.detail);
  };

  useEffect(() => {
    /**
     * 监听自定义 route 事件
     * 并根据 path 修改路由
     */
    document.addEventListener('route', handleRoute as EventListener);

    return () => {
      // 清除副作用
      document.removeEventListener('route', handleRoute as EventListener);
    };
  }, []);

```

在 Router 组件中，根据接收到的变化，将新的地址保存到状态中，并触发组件重新渲染。

这样一个最简单的 React 路由就做好了。

## Vue 的路由

与 React 同理，二者的路由切换都差不多，其主要思路还是使用自定义事件来订阅路由切换的请求。但 Vue 的具体实现与 React 还是有点不同的。

### 配置文件

路由的配置文件还是同理，不同的是，Vue 的异步组件需要在引入时同时引入一个 Loading 组件来实现 Loading 的效果：

```ts
import { defineAsyncComponent } from 'vue';
import Loading from '../components/common/Loading.vue';

export default [
  {
    path: '/',
    name: 'Home',
    component: defineAsyncComponent({
      loader: () => import('../views/Home.vue'),
      loadingComponent: Loading,
    }),
  },
  {
    path: '/about',
    name: 'About',
    component: defineAsyncComponent({
      loader: () => import('../views/About.vue'),
      loadingComponent: Loading,
    }),
  },
];
```

### 展示路由

同理，Vue 也是利用根据条件来渲染对应路由的组件。不同的是，我们可以使用模板语法来实现，也可以利用 `render()` 方法来直接渲染组件。

首先来看看和 React 类似的 `render()` 方法。在 Vue3 中，使用 `setup()` 方法后，可以直接返回一个 `createVNode()` 的函数，这就是 `render()` 方法。所以可以直接写 TypeScript 文件。

与 React 不同的地方在于，React 每次调用 `setPath(e.detail)` 存储状态时都会重新渲染组件，从而重新执行组件的函数，获取到对应的路由组件。

但 Vue 不同，如果我们仅仅将路由名称 `e.detail` 保存到状态，但没有实际在 VNode 中使用的话，更新状态时不会重新渲染组件的，也就是说，不会获取到对应的路由组件。所以最佳的办法就是将整个路由组件保存到状态，可保存整个组件无疑太过庞大。好在 Vue3 给了我们另一种解决方法：`shallowRef()`。它会创建一个跟踪自身 `.value` 变化的 ref，但不会使其值也变成响应式的。

```ts
import { createVNode, defineComponent, shallowRef } from 'vue';
import routes from './routes';

export default defineComponent({
  name: 'RouterView',
  setup() {
    let currentPath = window.location.pathname;
    const component = shallowRef(
      routes.find((item) => item.path === currentPath)?.component ??
        'Note found'
    );

    const handleEvent = (e: CustomEvent<string>) => {
      console.log(e.detail);
      currentPath = e.detail;
      component.value =
        routes.find((item) => item.path === currentPath)?.component ??
        'Note found';
    };

    document.addEventListener('route', handleEvent as EventListener);

    return () => createVNode(component.value);
  },
});
```

而使用模板语法主要是利用到了全局的 `component` 组件，其他部分与 `render()` 方法相同：

```vue
<template>
  <component :is="component"></component>
</template>

<script lang="ts" setup>
import { onUpdated, shallowRef } from 'vue';
import routes from './routes';

let currentPath = window.location.pathname;
const component = shallowRef(
  routes.find((item) => item.path === currentPath)?.component
);

const handleEvent = (e: CustomEvent<string>) => {
  console.log(e.detail);
  currentPath = e.detail;
  component.value = routes.find((item) => item.path === currentPath)?.component;
};

document.addEventListener('route', handleEvent as EventListener);

onUpdated(() => {
  console.log(component);
});
</script>
```

## 总结

如今的 JavaScript 做能做到的比以前更加强大，配合多种 HTML API，可以将曾经不可能实现的事变为现实。这个简单的迷你路由，主要的思路就是利用 HTML API 来通知 Router 组件该渲染哪个组件了。配合上 `lazy()` 方法，甚至还能实现代码分割。

## Demo

[DefectingCat/react-tiny-router: A tiny react router. (github.com)](https://github.com/DefectingCat/react-tiny-router)

<iframe src="https://codesandbox.io/embed/github/DefectingCat/react-tiny-router/tree/master/?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="tiny-router"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>