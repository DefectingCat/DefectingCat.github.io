响应式网页一直是人们所追求的目标，从早期的为移动端和 PC 端各准备一个网站的方式，到现在的利用 CSS 媒体查询已经各种奇淫技巧来实现的真正的响应式网页。期间经历了很多变化，也实现了很多前所未有的效果。也有很多 Best practice 供我们学习和使用。

## 响应式布局

所谓的响应式布局就是根据浏览器视口的宽度来调整文档的整体布局。响应式的页面主要还是移动端的崛起，和 PC 普遍的 `16:9` 等横屏不同，移动端通常都是以 `9:16` 等比例的竖屏。这就导致了整体的布局必然有很大差距，也就催生了响应式布局的革命。

随着时代的进步，CSS 媒体查询成为了我们设计响应式布局的主要工具之一。它也不负众望，为我们带来了体验极其良好的响应式网页。

所谓媒体查询是 CSS 的一种语法，它类似于条件语句，可以根据特点条件来实现特定的样式表。而它实现响应式主要的条件便是根据浏览器的视口宽度来实现特定的样式。

例如常见的 Grid 布局等：

```css
.grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr));
}

@media (min-width: 1280px)
.xl\:grid-cols-8 {
    grid-template-columns: repeat(8, minmax(0, 1fr));
}
```

![Grid1.png](C:\Users\xfy\Git\DefectingCat.github.io\public\images\响应式Web-以移动端优先构建的响应式网页\Grid1.png)

![Grid2.png](C:\Users\xfy\Git\DefectingCat.github.io\public\images\响应式Web-以移动端优先构建的响应式网页\Grid2.png)

![Grid3.png](C:\Users\xfy\Git\DefectingCat.github.io\public\images\响应式Web-以移动端优先构建的响应式网页\Grid3.png)


