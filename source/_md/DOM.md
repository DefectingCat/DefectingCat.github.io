DOM（文档对象模型，Document Object Model)，是针对 HTML 和 XML 文档的一个 API。DOM 脱胎于 Netscape 以及微软创始的 DHTML。

> IE 中所有 DOM 对象都是以 COM 对象的形式实现的，与原生 JavaScript 对象的行为或活动特点不一致。

## 节点层次

节点之间的关系构成了层次，而所有页面标记则表现为一个以特点节点为根节点的树形结构。也就是文档树。

文档节点是每个文档的根节点，文档节点只有一个子节点，称之为文档元素。在 HTML 中，文档元素始终都是`<html>`元素。

### Node 类型

总共有 12 中节点类型，这些节点类型都继承自一个基类型。DOM1 级定义了一个 Node 接口，该接口将由 DOM 中所有的节点类型实现。Node 接口在 JavaScript 中是作为 Node 类型实现的；除 IE 外（IE8 及以下），其他所有浏览器都可以访问到这个类型。

每个节点都有一个`nodeType`属性，用于表明节点类型。在 Node 类型中分别定义了 12 个数值常量来表示：

**节点类型常量**

| 常量                               | 值   | 描述                                                                                                                                                                                                                              |
| :--------------------------------- | :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Node.ELEMENT_NODE`                | `1`  | 一个 [`元素`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 节点，例如 [`p`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/p) 和 [`div`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div)。 |
| `Node.TEXT_NODE`                   | `3`  | [`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 或者 [`Attr`](https://developer.mozilla.org/zh-CN/docs/Web/API/Attr) 中实际的 [`文字`](https://developer.mozilla.org/zh-CN/docs/Web/API/Text)               |
| `Node.CDATA_SECTION_NODE`          | `4`  | 一个 [`CDATASection`](https://developer.mozilla.org/zh-CN/docs/Web/API/CDATASection)，例如 `<!CDATA[[ … ]]>`。                                                                                                                    |
| `Node.PROCESSING_INSTRUCTION_NODE` | `7`  | 一个用于XML文档的 [`ProcessingInstruction`](https://developer.mozilla.org/zh-CN/docs/Web/API/ProcessingInstruction) ，例如 `<?xml-stylesheet ... ?>` 声明。                                                                       |
| `Node.COMMENT_NODE`                | `8`  | 一个 [`Comment`](https://developer.mozilla.org/zh-CN/docs/Web/API/Comment) 节点。                                                                                                                                                 |
| `Node.DOCUMENT_NODE`               | `9`  | 一个 [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 节点。                                                                                                                                               |
| `Node.DOCUMENT_TYPE_NODE`          | `10` | 描述文档类型的 [`DocumentType`](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentType) 节点。例如 `<!DOCTYPE html>` 就是用于 HTML5 的。                                                                                   |
| `Node.DOCUMENT_FRAGMENT_NODE`      | `11` | 一个 [`DocumentFragment`](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment) 节点                                                                                                                                 |

**已经弃用的节点类型**

| 常量                         | 值  | 描述                                                                                                                                                                                                                                                                                |
| ---------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Node.ATTRIBUTE_NODE`        | 2   | [`元素`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 的耦合[`属性`](https://developer.mozilla.org/zh-CN/docs/Web/API/Attr) 。在 [DOM4](https://www.w3.org/TR/dom/) 规范里[`Node`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node) 接口将不再实现这个元素属性。 |
| `Node.ENTITY_REFERENCE_NODE` | 5   | 一个 XML 实体引用节点。 在 [DOM4](https://www.w3.org/TR/dom/) 规范里被移除。                                                                                                                                                                                                        |
| `Node.ENTITY_NODE`           | 6   | 一个 XML `<!ENTITY ...>` 节点。 在 [DOM4](https://www.w3.org/TR/dom/) 规范中被移除。                                                                                                                                                                                                |
| `Node.NOTATION_NODE`         | 12  | 一个 XML `<!NOTATION ...>` 节点。 在 [DOM4](https://www.w3.org/TR/dom/) 规范里被移除.                                                                                                                                                                                               |

通过比较`nodeType`属性中包含的上述常量，就可以确定节点的类型。由于早期的 IE 没有公开 Node 类型，为了兼容所有浏览器，可以使用`nodeType`属性的数值量进行对比：

```js
if (someNode.nodeType === 1) {
    console.log(`this is an element`)
}
```

要详细的查看节点的信息，还有`nodeName`和`nodeValue`属性。这两个属性的值完全取决于节点的类型。对于 Element 节点，`nodeName`就是其标签名，而`nodeValue`始终为`null`。

```js
let c = document.body.appendChild(document.createComment('test'));
c.nodeName // "#comment"
c.nodeValue // "test"
```

#### 节点关系

每个节点都有一个`childNodes`属性，其中保存着一个 NodeList 对象，这个对象是一个类数组对象，用于保存一组有序的节点。NodeList 对象的独特之处在于，它实际上是基于 DOM 结构动态查询的结果，而不是静态的。

`childNodes`会返回所有子节点，不仅仅只是 Element 元素，可以使用`children`来访问子元素。

```js
div.childNodes
// NodeList(9) [text, span, text, div, text, div, text, img, text]
```

虽然 NodeList 对象是一个类数组，但是可以通过数组方法`slice()`将其直接转换为数组。

```js
let test = Array.prototype.slice.call(div.childNodes, 0);
Object.prototype.toString.call(test)
// "[object Array]"
```

但是 IE 早期无效，在早期 IE 中只能将其遍历转换为数组。因为其是类数组，所以 NodeList 是可迭代的（但是我的 IE 11 貌似不能用使用`for/of`）。

```js
function converToArray(nodes) {
    let arr = null;
    try {
        arr = Array.prototype.slice.call(nodes.childNodes, 0);
    } catch(e) {
        arr = [];
        for (let i in nodes) {
            arr.push(nodes[i]);
        }
    }
    return arr;
}
```

每个节点都有一个父节点，可以使用`parentNodes`属性来访问。父节点是唯一的，所有`childNodes`返回的节点都有同一个父节点。同样的，与`childNodes`相同的是，父节点不一定就是 Element，可以使用`parentElement`返回父元素节点。

```js
let html = document.querySelector('html');
html.parentElement;
// null
html.parentNode;
// #document
```

所有的子节点相互之间都是兄弟/同胞节点，可以通过使用`previousSibling`和`nestSibling`属性来访问相邻的同胞节点。

父节点的`firstChild`和`lastChild`分别指向 childNodes 列表中的第一个和最后一个节点。也就是说，`lastChild`等于`childNodes.length - 1`。

除了确定`childNodes.length`之外，还可以使用`hasChildNodes()`方法来确定是否拥有子节点。

所有节点的最后一个属性是`ownerDocument`，该属性指向整个文档的文档节点，也就是`document`。这种关系表示的任何节点都属于它所在的文档，任何节点都不能同时存在与两个或以上的文档中。有了该属性，就不必层层回溯到顶端，而是可以直接访问文档节点。

> 所有节点类型都继承自 Node，但并不是每种节点都有子节点。

节点关系的小结：

* 父节点是唯一的；
* `childNodes`返回所有类型的子节点，`children`返回子元素节点；
* `childNodes`返回的是类数组；
* `parentNodes`返回父节点，`parentElement`返回父元素节点；
* `previousSibling`和`nestSibling`属性来访问相邻的同胞节点；
* `firstChild`和`lastChild`属性来访问第一个和最后一个子节点；
* `hasChildNodes()`方法来确定是否拥有子节点；
* `ownerDocument`直达`document`。

#### 操作节点

因为节点关系指针都是只读的，所以 DOM 提供了一系列的操作节点的方法。最常用的方法是生成节点：`append()`和`appendChild()`。他们都用于向 childNodes 列表后添加一个节点。

`append()`和`appendChild()`的区别是：

* `append()`方法允许添加 DOMString 对象，而`appendChild()`只允许添加 Node 对象；
* `append()`可以一次添加多个节点和字符串，而`appendChild()`只能追加一个节点；
* `append()`没有返回值，`appendChild()`返回追加的 Node 对象。

除此之外，两个方法其他部分都是相同的。

如果添加的节点是已经存存在与文档上，那么结果就是该节点会从文档中原来的位置移动到新的位置。类似于剪切操作，并且被操作的节点的子节点会跟随父节点一起移动。

还有一些其他的操作方法：

* `Element.insertBefor()`：在特定子元素前插入一个新的子元素；
* `Element.replaceChild()`：替换特定子元素；
* `Element.cloneNode()`：创建调用节点的副本，通过一个布尔参数来决定是否执行深复制，浅复制则不包括其子节点。所有类型节点都有该方法；
* `normalize()`：唯一的左右就是处理文档树中的文本节点。

### Document 类型

JavaScript 通过 Document 类型来表示文档，也就是经常使用的`document`对象。`document`对象是 HTMLDocument 的一个实例。而 HTMLDocument 则继承自 Document 类型。

```
Document --> HTMLDocument.prototype --> document
```

document 对象是 window 的一个属性，所以它可以全局访问。它有一下特点：

* nodeType 为 9；
* nodeName 为`#document`；
* 其他值均为`null`；

它有四种可能的子节点：DocumentType、Element、ProcessingInstruction 或 Comment。

其中 DocumentType 和 Element 都最多只能有一个，他们就是 HTML 文档最常见的开头：

```html
<!DOCTYPE html>
<html lang="en">
```

> 早期 IE 无法访问 Document 类型的构造函数和原型。

#### 文档子节点

* `document.documentElement`始终指向`<HTML>`元素；
* `document.body`指向`<body>`元素；
* `document.doctype`指向`<!DOCTYPE html>`。

不同浏览器之间对于`<html>`标签之外的注释有着不同的见解，这也导致了在`<html>`元素外的注释没有什么用处。

#### 文档信息

* `document.title`：可以直接获取文档标题。

使用`document.title`配合两个定时器就可以设置一个经典的 Title 切换的方法：

```js
setInterval(() => {
    document.title = '小肥羊'
    setTimeout(() => {
        document.title = '无敌螺旋小肥羊'
    }, 500);
}, 1000);
```

* `document.URL`：获取当前文档的完整URL；
* `document.domain`：获取当前域名；
* `document.referrer`：获取来源页面URL。

使用`document.referrer`就可以轻松判断跳转自页面，可以配合 Live2d 做个简单的识别。

```js
document.referrer
// "https://www.baidu.com/link?url=Lx3l1h452xnMy39DdUnl4y2Dl84m7Rb22M2CCwvH6n033Jr7EmLO_LxUYYmg3VMx&wd=&eqid=ba12bd2a000c1485000000055ffdadd3"
```

#### 查找元素

Document 类型有两个可以取得 DOM 元素的方法：

* `getElementById()`
* `getElementByTagName()`

`getElementById()`在早期的 IE7 中调用可能会获取到带有`name="test"`的 Attribute 其他元素的 Bug。

`getElementByTagName()`返回的是一个 HTMLCollection 对象，它是一个动态的集合。该对象与 NodeList 非常类似，他们都可以使用方括号语法或`item()`方法来访问其中的项目。

```js
div[0];
div.item(0);
// 使用名称
div['myDiv'];
```

HTMLDocument 类型也有一个独有的查询 DOM 的方法：

* `getElementByName()`：返回带有特定 name Attribute 的元素。

同样的，它返回的也是一个 NodeList 集合。

#### 特殊集合

除了一些常见的属性和方法之外，document 对象还提供了一些特殊的集合。这些集合都是 HTMLDocument 对象为访问文档常用的部分提供了快捷方式。

* `document.anchors`：文档中所有带 name 特性的`<a>`元素；
* `document.applets`：文档中所有`<applets>`元素，已经弃用；
* `document.forms`：文档中所有`<form>`元素；
* `document.images`：文档中所有`<img>`元素，与`document.getElementByTagName('img')`结果相同；
* `document.links`：文档中所有带`herf`特性的`<a>`元素。

这些特殊的集合也都是动态的。

#### DOM 一致性检测

DOM 分为多个级别，也包含多个部分，因此检测浏览器实现了 DOM 的哪些部分就十分必要了。`document.implementation`属性就是提供检测方法的对象。

#### 文档写入

将输出流写入到网页中的能力已经存在很多年了，这个能力体现在四个方法中：`write()`、`writeIn()`、`open()`和`close()`。

写入文本：

* `write()`：接受一个参数，原样写入；
* `writeIn()`：接受一个参数，添加换行符`\n`写入。

```html
  <body>
    <p>The current date and time is:</p>
  </body>
  <script>
    document.write(`<strong>${(new Date()).toString()}</strong>`)
  </script>
```

在页面呈现期间直接使用`document.write()`向页面添加内容是正常的，但是如果等页面渲染完毕了再使用`document.write()`添加内容就会**重写覆盖整个页面**。

### Element 类型

除了 Document 类型之外，Element 类型就是 Web 编程中最常用的类型了。它用于表现 XML 或 HTML 元素。

* nodeType 为 1；
* nodeName 为元素的标签名；
* nodeValue 为 null；
* parentNode 可能是 Document 或 Element；

