Canvas 是一个强大的 HTML 特性，它使我们能够在 HTML 中绘制出色的图形。在那个没有 Canvas 的年代，我们还需要借助 Flash 来在网页上进行绘图。而现在的 Canvas 能为我们带来更高的性能，以及更方便的 API。

最近的一个项目里需要实现客户在屏幕上手写签名，和第三方对接无果，所以只好打算自己实现一个较为简单的版本。原本都是对 Canvas 往而远之的，最终上手试一下了，API 的易用性还是比想象中的要好用的。

## 创建一个 Canvas

Canvas 本身在 DOM 中的表现是一个 HTML 标签，所以第一步是我们的 HTML 中创建一个 `<canvas></canvas>` 标签：

```html
 <body>
   <canvas id="canvas"></canvas>
   <script src="src/index.ts"></script>
 </body>
```

剩下的活就交给 JavaScript 来做了。首先需要获取到 Canvas 的上下文，并设置画板为 2d：

```ts
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

if (canvas) {
  const ctx = canvas.getContext("2d");
}
```

除此之外，本次的目的是需要一个类似全屏的画板，所以我们的 canvas 需要占满整个浏览器窗口。这里使用的是 JavaScript 来为 canvas 设置宽和高，主要目的是为了后续的动态修改。使用 CSS 也是同样的效果：

```ts
// 添加
if (canvas) {
  const ctx = canvas.getContext("2d");
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;

  canvas.width = pageWidth;
  canvas.height = pageHeight;
}
```

> 使用 CSS 为 canvas 设置宽高需要注意的是：canvas 本身是以图片的方式存在的，它并不是类似 SVG 的矢量图，如果设置相对值，可能会直接拉伸图片。

## 开始绘画

为了实现鼠标绘画，首先的思路当然是监听鼠标事件。鼠标事件大致分为三个部分：鼠标按下（mousedown）、鼠标移动（mousemove）和鼠标松开（mouseup）。我们的简易画板就由这三个事件组成。

### 第一步

canvas 的绘图离不开坐标，即使是 2d 绘图，也需要横向（x）与纵向（y）两个方向。所以我们事先准备一个对象用于保存每次开始的位置，也就是鼠标按下时的位置。

同时用一个布尔值判断绘画是否开始：

```ts
/** @var painting Whether use is drawing */
let painting = false;
/** @var lastPoint Recored user mouse position */
let lastPoint = {
  x: 0,
  y: 0
};
```



### 点与线

canvas 有许多强大的 API，而实现利用鼠标绘画只需要用到两个最基本的 API：创建圆与直线。

我们主要使用的是鼠标的三个事件，而在鼠标按下时，即表明绘画已经开始，所以我们需要从创建一个点开始。也就是说，当鼠标按下时，在 canvas 中绘制一个圆点。绘制一个圆主要使用 `arc()` 这个方法：

```TS
ctx.arc(x, y, radius, 0, Math.PI * 2);
```

