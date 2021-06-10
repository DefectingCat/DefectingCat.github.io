不久前添加到 DOM 规范中的 MutationObserver 接口，可以在 DOM 被修改时异步执行回调。MutationObserver 可以观察整个文档、DOM 树的一部分，或某个元素。此外还可以观察元素属性、子节点、文本，或者前三者任意组合的变化。

> MutationObserver 接口是为了取代废弃的 MutationEvent。

## 基本用法

MutationObserver 的实例需要通过调用 MutationObserver 构造函数，并传入一个回调函数来创建：

```js
const observer = new MutationObserver(() => console.log('<body> attributes changed'));
```

### observe 方法

创建后的实例通过`observe()`方法来监听指定的 DOM，它接收两个必要的参数：观察的 DOM 节点，以及 MutationObserverInit 对象。

观察 body 元素的 attributes 变化：

```js
const observer = new MutationObserver(() => console.log('<body> attributes changed'));
observer.observe(document.body, { attributes: true });
```

### 回调与 MutationRecord

每个监听的回调都会收到一个 MutationRecord 实例的数组，它包含了发送的变化，以及 DOM 的哪部分收到了影响。

```js
const observer = new MutationObserver((recoeds) => console.log(recoeds));
observer.observe(document.body, { attributes: true });
```

属性变化的 MutationRecord 实例数组：

```js
document.body.className = '123';
// [MutationRecord]
// addedNodes: NodeList []
// attributeName: "class"
// attributeNamespace: null
// nextSibling: null
// oldValue: null
// previousSibling: null
// removedNodes: NodeList []
// target: body.123
// type: "attributes"
```

连续修改属性会生成多个 MutationRecord 实例。

### disconnect 方法

默认情况下，只要观察的 DOM 不被垃圾回收，MutationObserver 的回调就会一直响应 DOM 变化事件。可以使用 `disconnect()`方法来提前终止回调。终止后，不仅停止此后变化事件的回调，也会抛弃已经加入任务队列要异步执行的回调。

```js
const observer = new MutationObserver((recoeds) => console.log(recoeds));
observer.observe(document.body, { attributes: true });
document.body.className = '123';
observer.disconnect();
document.body.className = '456';
// 没有输出
```