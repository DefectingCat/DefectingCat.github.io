---
title: 性能优化-useMemo and useCallback
date: 2021-08-21 16:05:33
tags: [JavaScript, React]
categories: 实践
url: useMemo-and-useCallback
---

性能优化一直是一个值得考虑的问题，但更值得考虑的是什么时候该优化。如果优化不得当，对于向 React 这类成熟的框架来说，即可能会过早优化。反而花了过多的时间来降低其性能。

React 的 `useMemo` 和 `useCallback` 这两个 hook 基本上就是为性能优化而准备的。既然有了优化的方案，剩下的就是什么时候该做优化。对其我目前的看法就是除非性能明显降低，否则不必太早考虑去进行优化性能。对于这两个 hook 也是如此，不过他们的也有别的作用。

![hooks](../images/useMemo%20and%20useCallback/hooks.webp)

## 引用相等性

引用相等性，简单来说就是因为引用值的特殊性，导致经常看起来可能是相等的值，其本身并不相等。

来看一个最常见的例子：

```js
{} === {} // false
[] === [] // false

'xfy' === 'xfy' // true
```

这是因为基本值是不可变的，两个看上去相同的基本值，他们绝大部分情况都是相同的。而每创建引用值时都会使用一个新的地址空间，这就导致了引用值的相等性问题。

更常见的例子是在函数中创建引用值：

```js
const test = () => {
  return {
    name: 'xfy',
  };
};

const a = test();
const b = test();

console.log(a === b);
```

在 React 的函数组件中，每个函数组件都是普通的函数，我们常常会遇到在父组件中创建一个引用值，将其传递给子组件，而子组件可以根据父组件传递的状态来重新渲染。

这时候就会遇到一个问题，因为引用值的特殊性，每次传递给子组件的状态与前一次都是不相同的。即使这个引用值根本没有任何变化。

来看一个刻意设计的例子，这是一个父组件，它会传递两个状态给子组件，分别是一个函数与数组，他们都是引用值：

```tsx
import Child from "./Child";

export default function App() {
  const bar = () => console.log("bar executed");
  const foo = () => [1, 2, 3];
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
      <Child bar={bar} foo={foo} />
    </div>
  );
}
```

而子组件则负责根据这两个状态的变化打印对应的消息，这样我们就能清楚的知道它什么时候重新渲染了。

```tsx
import { useEffect } from "react";

interface Props {
  bar: () => void;
  foo: number[];
}

export default function Child({ bar, foo }: Props) {
  useEffect(() => {
    bar();
    console.log(foo);
    console.log('update')
  }, [bar, foo]);

  return <div>Hello</div>;
}
```

这乍一看好像没有什么问题，但当我们点击按钮与父组件进行交互时，父组件会根据自身状态的变化重新渲染。而父组件本身是一个函数，当父组件重新渲染时，就意味着函数重新执行，它所传递给子组件的 bar 和 foo 的引用值则会被重新创建。

这就导致了因为引用值的特殊性，其本身没有变化，反而因为父组件的重新渲染导致了创建了新的引用值传递给子组件。子组件也就会因为 props 的变化而重新渲染。

![重新渲染的子组件](../images/useMemo%20and%20useCallback/image-20210821100240966.webp)

这不是我们能想要的结果，好在 `useMemo` 和 `useCallback` 这两个 hook 可以帮我们解决这些问题。

问题其实很简单，父组件每次重新渲染时会创建新的引用值，导致子组件不必要的重新渲染。我们只需要利用到`useMemo` 和 `useCallback` 创建一个 memoized 的值，并根据依赖数组的变化更新其值。

这样当父组件重新渲染时，没有变化的引用值也就不会被重新创建，而是利用之前已经创建好的 memoized 值：

```tsx
import Child from "./Child";
import { useCallback, useMemo, useState } from "react";

export default function App() {
  const bar = useCallback(() => console.log("bar executed"), []);
  const foo = useMemo(() => [1, 2, 3], []);
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
      <Child bar={bar} foo={foo} />
    </div>
  );
}
```

> 这是一个刻意设计的例子，所以 foo 和 bar 没有依赖，永远都不需要更新。

这时候，无论父组件怎么重新渲染，子组件都会只渲染一次。排除了所有的不必要渲染。

### Demo

<iframe src="https://codesandbox.io/embed/usememo-and-usecallback-lwt67?expanddevtools=1&fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useMemo and useCallback"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 避免不必要渲染

上述解决引用值的相等问题时，其实也解决了子组件的必要渲染。同样的，利用 `useMemo` 和 `useCallback` 也可以避免另一种情况的不必要渲染。

这也是一个刻意设计的例子，我们有一个父组件，它负责提供状态给子组件进行展示。听上去和第一个例子很像，不同的是，这里需要复用子组件：

```tsx
import CountButton from "./CountButton";

export default function App() {
  const [count, setCount] = useState(0);
  const inc1 = () => {
    setCount((count) => count + 1);
  };
  const [count1, setCount1] = useState(0);
  const inc2 = () => {
    setCount1((count1) => count1 + 1);
  };

  return (
    <div className="App">
      <CountButton count={count} onClick={inc1} />
      <CountButton count={count1} onClick={inc2} />
    </div>
  );
}
```

这里将 count 和对应的更新状态的方法传递给子组件，由子组件进行展示和交互。并且子组件是复用同一个组件的，只是状态不同。

很明显，这里传递的更新方法 `setCount` 也是引用值，我们可以利用 `useCallback` 来创建一个其 memoized 的版本传递给子组件。

当然这还解决不了所有的问题，这里的子组件是被复用的：

```tsx
interface Props {
  onClick: () => void;
  count: number;
}

export default function CountButton({ onClick, count }: Props) {
  useEffect(() => {
    console.log("re-render");
  });

  return (
    <div className="App">
      <p>{count}</p>
      <button onClick={onClick}>Increase</button>
    </div>
  );
};
```

这里的子组件在父组件中被复用了两次，我们期望的是，当我们和指定的那个子组件进行交互时，就只更新（重新渲染）它。因为只有它的 props 发生了变化，而另一个则不需要无谓的渲染。

要解决这个问题，还是需要 `useMemo` 和 `useCallback` 配合进行使用，不过这次并不完全一样：

```tsx
export default function App() {
  const [count, setCount] = useState(0);
  const inc1 = useCallback(() => {
    setCount((count) => count + 1);
  }, []);
  const [count1, setCount1] = useState(0);
  const inc2 = useCallback(() => {
    setCount1((count1) => count1 + 1);
  }, []);

  return (
    <div className="App">
      <CountButton count={count} onClick={inc1} />
      <CountButton count={count1} onClick={inc2} />
    </div>
  );
}
```

在父组件中，我们将传递的引用值进行 memoized，而子组件本身也是一个函数，我们期望它只根据 props 的变化而进行重新渲染，而不受复用的那一个影响。

所以这里需要对子组件进行 memo 化：

```tsx
export default React.memo(function CountButton({ onClick, count }: Props) {
  useEffect(() => {
    console.log("re-render");
  });

  return (
    <div className="App">
      <p>{count}</p>
      <button onClick={onClick}>Increase</button>
    </div>
  );
});
```

通过如此，子组件就只会根据 props 的变化来重新渲染。而父组件中的引用值也利用 `useCallback` 进行 memoized，这样就避免了只更新其中一个子组件时，导致的另一个子组件也被重新渲染。

### Demo

<iframe src="https://codesandbox.io/embed/usecallback-4ggvv?expanddevtools=1&fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useCallback"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 何时进行优化

上述例子都利用 `useMemo` 和 `useCallback` 对组件进行优化，以避免不必要的重新渲染。但另一个需要思考的问题是：我们何时需要手动进行优化？

> 性能优化总是需要代价的，但并不总是会带来益处。

像 React 这类成熟的框架，其性能还没有低到需要我们每时每刻都关注是否需要进行手动的优化。也就是说 React 或其他类似的框架，其实是很快的，JavaScript 在函数内创建和执行另一个简单的函数也是很快的。对于此，我们不需要对其进行额外的关注，可以把宝贵的时间花在创作内容上。

对于像上面例子中，复用两个简单的子组件其实并不需要用到  `useMemo` 来优化，相反这样简单的组件可能会由   `useMemo` 带来额外的开销，结果适得其反。

而如果上述例子中，子组件是很大的表格或者图表等。每次重新渲染都需要花费很大的开销。这时就很有必要进行   `useMemo` 了。


## 参考

* [When to useMemo and useCallback (kentcdodds.com)](https://kentcdodds.com/blog/usememo-and-usecallback)