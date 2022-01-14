React 是时下热门 JavaScript 库，也是我十分热爱的库。一直觉得 React 内部实现一定非常神奇，但却从来都没有想过去尝试实现一个简化版本的。直到我遇到了这个手把手（_Step by Step_）的文章 [didact](https://github.com/pomber/didact)。

## 原生 API

先看看用原生 JavaScript 我们需要如何创建这样的 DOM 结构：

```html
<div id="root">
  <div>
    <h1 id="hello">Hello world!</h1>
    <p>This is a test.</p>
  </div>
</div>
```

几乎所有的创建操作都是在 `document` 下的方法，看起来好像也还行，但这样的写法效率肯定不高：

```js
const container = document.getElementById('root');

const wrapper = document.createElement('div');

const h1 = document.createElement('h1');
h1.setAttribute('id', 'hello');
h1.textContent = 'Hello world!';

const p = document.createElement('p');
p.textContent = 'This is a test.';

wrapper.append(h1, p);

container.appendChild(wrapper);
```

再来看看 React 中 JSX 的写法：

```jsx
const testElement = (
  <div>
    <h1 id="hello">Hello world!</h1>
    <p>This is a test.</p>
  </div>
);

render(testElement, document.querySelector('#root'));
```

由于 JSX 的转义，好像我们直接就将 DOM 结构写在了 JavaScript 代码里，不仅效率变高了，可读性也更好了。

接下来，我们将实现一个简单的 React，它将代替原生 JavaScript API 来为我们创建和更新 DOM。

## 拆开神奇的 React

JSX 是平时与 React 接触最多的，它其实是由像 babel 这样的工具进行转义为普通的 JavaScript。虽然很神奇，但转义通常很简单：替换代码内的标签为调用 `createElement` 方法，传递标签名称、props 和 children 做为参数。

```jsx
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

`React.createElement` 会从接受到的参数来创建一个普通的 JavaScript 对象。除了一些验证以外，该方法和我们想的差不多。所以大致可以替换为这样：

```js
const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
)
```

这就是我们的 Element，一个普通的 JavaScript 对象并包含两个属性：`type` 和 `props`（真正的 React 比这要[复杂点](https://github.com/facebook/react/blob/f4cc45ce962adc9f307690e1d5cfa28a288418eb/packages/react/src/ReactElement.js#L111)，但这需要关心这两个属性就足够实现一个简单的 React 了）。

`type` 属性是一个字符串（_string_），它就是我们需要创建的 HTML 标签名称。也就是创建真正 DOM 时传递给 `document.createElement` 的 `tagName`。

`props` 是一个对象，它包含所有的 JSX 属性（_attributes_）。同时包含一个特殊的属性 `children`。

`children` 就再熟悉不过了，它通常为两种：子元素或者字符串。

另一个神奇的方法就是 `ReactDOM.render`，`render` 方法会根据 `createElement` 创建的对象来创建真正的 DOM，并在状态变化时更新 DOM。

### 要用魔法打败魔法

简单拆开 React 的步骤可实际分为如下：

根据 `element.type` 来创建 DOM，并将 `props` 中除了 `children` 属性创建为 DOM 的 attributes：

```js
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const node = document.createElement(element.type);
node["title"] = element.props.title;
```

创建子元素：

```js
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;
```

这里的 `nodeValue` 是用来专门描述文字节点的对象中的属性，它的 `props` 看起来像这样：`{nodeValue: "hello"}`。

## `createElement` 函数

先抛开 JSX 不谈，我们先实现一个自己的 `createElement` 函数。首先来看下 React 的方法：

```js
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
)
```

很明显，第一个参数为 string，这是将要被创建的 DOM 的 `tagName`。第二个参数为 DOM 的 attributes，是一个普通的 JavaScript 对象。剩下的参数必然就是 children 了。

所以简单的推断下，我们的函数签名应该是这样的：

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
```

顺便再给它上点类型，我们先定义一个自己的 Node 类型，该 Node 就是由我们的 `createElement` 创建的普通对象。

```ts
type DreactNode = DreactElement;
```

而这个 `DreactElement` 就是上述所说的用来描述 DOM 的对象：

```ts
{
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
```

`type` 很简单，必定是 string 类型。而 `props` 中会包含 attributes 和 children。children 肯定是另一个相同的对象，也可能是字符串，也就是 DOM 的内容。关于文字节点，先放到后面再实现。首先先考虑元素节点。

也就是说，它的类型看起来应该像这样：

```ts
export interface DreactElement {
  type: string;
  props: {
    children: DreactNode[];
    [key: string]: string | DreactNode[];
  };
}
```

这下好多了，我们拥有了自己的 Node 类型了！接下来再完善下函数的签名：

```ts
type DreactNode = DreactElement;

export interface DreactElement {
  type: string;
  props: {
    children: DreactNode[];
    [key: string]: string | DreactNode[];
  };
}

function createElement(
  type: string,
  props: { [key: string]: string } | null,
  ...children: DreactNode[]
): DreactElement {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
```

漂亮多了，DOM 的 attributes 可能为空，所以 `props` 可能为 `null`。

这是一个非常简单的工厂函数，如果我们这样调用 `createElement('div', null, [anotherElement])`，则会得到：

```ts
{
  "type": "div",
  "props": { "children": [anotherElement] }
}
```

这正是我们所需要的对象。但是目前还不行，我们还没有自己创建文本节点的方法。

### `createTextElement` 函数

还记得 `nodeValue` 吗，这里我们就要来创建用于创建它的工厂函数 `createTextElement`。

它看起来会相对简单一点：

```ts
{
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
}
```

所以我们的参数只需要一个就足够了：

```ts
function createTextElement(text: string): TextElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
```

当然也需要顺便再描述一下它的类型：

```ts
export interface TextElement {
  type: 'TEXT_ELEMENT';
  props: {
    nodeValue: string;
    children: [];
    [key: string]: string | DreactNode[];
  };
}
```

同时也别忘了再更新下我们的 Node 类型：`type DreactNode = DreactElement | TextElement;`

> 当 `children` 为空时，真正的 React 是不会包含原始值（primitive values）或者空数组的。我们的 Dreact 为了简单，所以会抛弃一些性能。

## 创建 DOM

是时候将 React 替换为我们自己的方法了：

```ts
const testElement = createElement(
  'div',
  null,
  createElement('h1', { id: 'hello' }, createTextElement('Hello world!')),
  createElement('p', null, createTextElement('This is a test.'))
);
```

我们的工厂方法创建用于描述 DOM 的对象看起来应该是这样的：

```ts
{
    "type": "div",
    "props": {
        "children": [
            {
                "type": "h1",
                "props": {
                    "id": "hello",
                    "children": [
                        {
                            "type": "TEXT_ELEMENT",
                            "props": {
                                "nodeValue": "Hello world!",
                                "children": []
                            }
                        }
                    ]
                }
            },
            {
                "type": "p",
                "props": {
                    "children": [
                        {
                            "type": "TEXT_ELEMENT",
                            "props": {
                                "nodeValue": "This is a test.",
                                "children": []
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

## 参考

* [Build your own React](https://pomb.us/build-your-own-react/)
