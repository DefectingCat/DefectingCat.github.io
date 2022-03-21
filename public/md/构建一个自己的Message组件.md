现代几乎所有的 UI 组件库都有一个用于全局消息提示的 message 组件。组件本身内容可能并没有多么的特殊，不一样的地方实在调用它的时候：

```tsx
import { message, Button } from 'antd';

const info = () => {
  message.info('This is a normal message');
};

ReactDOM.render(
  <Button type="primary" onClick={info}>
    Display normal message
  </Button>,
  mountNode
);
```

它和传统使用 UI 组件不一样的地方就是它并不是直接以 JSX 的方式写的，而是调用指定的函数来完成 DOM 的创建。

## 挂载方式

React 的 `render` 方法可以将我们的组件挂载到指定的 DOM 上，也就是 `index.tsx` 中最常见的：

```tsx
const rootElement = document.getElementById('root');
render(<App />, rootElement);
```

既然 message 组件不是直接写入到 JSX，那么它将不会挂载在 `<App/>` 中，也就是说，它可能需要自己调用 `render` 方法，并挂载在特定的 DOM 上。

简单的观察一下 ant desing 的 message 组件实际创建的位置是在 `rootElement` 的相邻位置：

```html
<body>
  <div id="root">...</div>
  <div>
    <div class="ant-message">
      <div></div>
    </div>
  </div>
</body>
```

也就是 `append()` 到 body 中的。

## 主要思路

### 挂载到指定 DOM

既然我们有了 React 的 `render` 方法，可以将我们的组件挂载到指定的 DOM 上。那么就可以自己创建一个 `message-wrapper` 的真实 DOM，通过 `document.body.append()` 到 body 中。然后再通过

```tsx
render(<MessageContainer />, el);
```

方法来渲染 React 组件到 DOM 中。

### 渲染方式

挂载的思路有了，接下来就是渲染特定消息的方法。通过调用指定的方法，如：`message.info()`、`message.sucess()` 等来创建不同类别的 message 组件。不同的类别都很容易解决，主要是如何在调用了特定的方法后，将数据渲染到 DOM 中。

React 可以根据我们的状态来渲染视图，也就是 state。在函数式组件中，可以使用 `useState()` 来创建状态。之后 React 会根据这个状态的变化来更改和渲染 DOM。

也就是说，在调用了特定的方法后，我们就更新状态。随后 React 就会根据状态来渲染出 message 组件。

### 组件结构

组件结构很简单：一个用于渲染 message 本身内容的组件、一个用于管理 message 状态，并根据状态来批量渲染 message 组件。

```bash
\---src
      \--index.css
      \--index.tsx
      \--Message.tsx
```

## 父组件

在父组件 `index.tsx` 中，直接进行查找 id 为 `message-wrapper` 的容器。如果不存在，则进行创建并插入到 body 中。

```ts
// Init message wrapper
let el = document.querySelector('#message-wrapper');

if (!el) {
  el = document.createElement('div');
  el.className = `${style['message-wrapper']}`;
  el.id = 'message-wrapper';
  document.body.append(el);
}
```

然后还需要一个 `MessageContainer` 来作为 Message 的父组件。随后就可以通过 React 的 `render` 方法来渲染到刚刚创建的 DOM 上。

```tsx
render(<MessageContainer />, el);
```

整个父组件大概是这样的结构，通过管理状态 `msgList` 来遍历渲染所有队列中的消息。

```tsx
const MessageContainer: FC = () => {
  const [msgList, setMsgList] = useImmer<Msg[]>([]);

  return (
    <>
      <div className={`${style['message-container']}`}>
        <AnimatePresence>
          {msgList.map((msg) => (
            <motion.div
              key={msg.id}
              variants={variants}
              animate="enter"
              className={style.motion}
              exit="exit"
              layout="position"
            >
              <Message type={msg.type} content={msg.content} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
```

添加到消息队列状态肯定是在组件外进行操作的，不会在组件内进行操作。毕竟我们是通过暴露在 `message` 实例上的方法来向队列中添加消息的。

所以这里的思路是在组件前准备一个 `add` 方法：

```tsx
let add: (msg: Msg) => void = () => {};
```

等到组件创建完成后，将添加状态的 方法保存到 `add` 中：

```tsx
add = (msg) => {
  setMsgList((list) => {
    list.push(msg);

    if (list.length > 10) list.shift();

    setTimeout(() => {
      setMsgList((list) => {
        list.shift();
      });
    }, 3000);
  });
};
```

这样就可以在 `message` 实例上暴露对应的方法：

```tsx
const message = {
  info: (content: string) =>
    add({
      id: new Date().getTime(),
      type: 'INFO',
      content,
    }),
  sucess: (content: string) =>
    add({
      id: new Date().getTime(),
      type: 'SUCESS',
      content,
    }),
  warn: (content: string) =>
    add({
      id: new Date().getTime(),
      type: 'WARN',
      content,
    }),
  error: (content: string) =>
    add({
      id: new Date().getTime(),
      type: 'ERROR',
      content,
    }),
};
```
