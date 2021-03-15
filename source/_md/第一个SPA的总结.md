## 平均空间

使用 flex 布局，在左右设置等距的 padding，然后使用 space-arorund。

```css
.goods {
  display: flex;
  flex-flow: row wrap;
  padding: 0px 6px 0 6px;
  justify-content: space-around;
}
```

内部的单个项目需要指定宽度小于 50%，为中间留空白的空间

```html
style="width: 48%; margin-top: 10px"
```

![](../images/第一个SPA的总结/2021-03-01-12-15-31.png)

## 瀑布流

两列的排列，图片的高度不统一。使用`flex`的横向换行排列会留出空白。

使用`flex`将两列图片分别作为两个容器，纵向排列

```html
<div class="goods">
  <!-- 从 home 组件接受的 list，循环创建 item -->
  <div class="col">
    <GoodsListItem
      v-for="(item, index) of list1"
      :key="item.iid + index"
      :item="item"
      style="margin-top: 10px"
    />
  </div>
  <div class="col">
    <GoodsListItem
      v-for="(item, index) of list2"
      :key="item.iid + index"
      :item="item"
      style="margin-top: 10px"
    />
  </div>
</div>
```

```css
.goods .col {
  display: flex;
  flex-flow: column;
  width: 48%;
}
```

![](../images/第一个SPA的总结/2021-03-12-10-48-27.png)

## 停留标题

## 首页滑动位置记录

## 详情页

### 传递参数

## keep-alive

缓存的组件一定要设置`name`属性！

* [vue.js的keep-alive include无效](https://segmentfault.com/q/1010000009117672#)

## 路由过渡动画

通过添加 [过渡模式](https://cn.vuejs.org/v2/guide/transitions.html#%E8%BF%87%E6%B8%A1%E6%A8%A1%E5%BC%8F) 来定义在多个路由或组件中的平滑过渡

```html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

## 控制`v-for`

```html
<span v-for="index of goods.services.length - 2" :key="index">
  <img src="" alt="" />
  <span> {{ goods.services[index].name }}</span>
</span>
```