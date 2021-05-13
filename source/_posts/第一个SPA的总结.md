---
title: 第一个SPA的踩坑总结
date: 2021-05-13 14:18:24
tags: [JavaScript, Vue, TypeScript]
categories: 踩坑
url: first-one-SPA
index_img: /images/第一个SPA的总结/logo.webp
---

## 重制版

在没有写完的情况下弃坑了，后来在写另一个 Vue3 的练手项目时想起来这个曾经入手 Vue2 的入门项目。

所以打算使用 Vue3 + TypeScript 重构一下。

[仓库地址](https://github.com/DefectingCat/gugu-mall)

## TypeScript

### Vuex

在 Vuex 中正确的使用了 TypeScript 可以直接静态提示 state 的类型以及属性。而在 Vuex 中为 state 注解需要用到官方的泛型。

第一步，为 state 做注解：

```ts
// types/state.ts
type CartObj = {
  iid: string | string[];
  imgURL: string;
  title: string | undefined;
  desc: string | undefined;
  newPrice: string | undefined;
};

export type State = {
  cartList: CartObj[];
};
```

在 store 中，使用`createStore()`方法创建 store 时，在泛型中传入刚刚定义好的类型：

```ts
// types
import { State } from '@/types/store';

export default createStore<State>({
  state: {
    cartList: [],
  },
  mutations,
  actions,
  getters,
  // modules: {},
});
```

这时，state 中的数据就已经被注解类型了。

在官方类型注解文件中可以看到`createStore()`方法中参数使用的接口，其中 state 直接被注解为泛型 S。而 mutations 等，需要使用各自的接口。

```ts
export interface StoreOptions<S> {
  state?: S | (() => S);
  getters?: GetterTree<S, S>;
  actions?: ActionTree<S, S>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
  devtools?: boolean;
}
```

到这里仅仅只是注解完了 state，接着就是 mutations。这里的 mutations 使用接口 MutationTree 并传递一个泛型，将刚刚注解的 state 传递过去。

```ts
// mutations.ts
import { MutationTree } from 'vuex';
// types
import { CartObj } from '@/types/detail';
import { State } from '@/types/store';

const mutations: MutationTree<State> = {
  addCart(state, info: CartObj): void {
    console.log(state);
  },
};

export default mutations;
```

### 索引签名

使用下标访问对象时会要求接口中声明了索引签名，否则不允许直接使用下标的方式访问对象属性。

```ts
interface State {
  goods: {
    pop: GoodsData;
    new: GoodsData;
    sell: GoodsData;
  };
}
function someFunc()  {
  state.goods[type].list1.push(...p1);
  state.goods[type].list2.push(...p2);
  state.goods[type].page = page;
  // No index signature with a parameter of type 'string' was found on type '{ pop: GoodsData; new: GoodsData; sell: GoodsData; }'.
}
```

强制用户必须明确的写出索引签名的的原因是：在对象上默认执行的 toString 方法是有害的。例如 v8 引擎上总是会返回 `[object Object]`

### 声明一个索引签名

```ts
interface State {
  goods: {
    pop: GoodsData;
    new: GoodsData;
    sell: GoodsData;
    // 索引签名，通过定义接口用来对对象key的约束
    [key: string]: GoodsData;
  };
}
```

>TypeScript 的索引签名必须是 string 或者 number。symbols 也是有效的，TypeScript 也支持它。

### mouseEvent & Elemet

当使用事件监听器的时候，`e.target`通常为 Element 类型。而`e`本身是 mouseevent 类型，所以在`e`的类型下无法获取到 target 之后的元素方法。

这时候就可以使用`&`操作符，在注解类型的时候就将其属性也注解了。

```ts
const titleClick = (e: MouseEvent & { target: Element }) => {
  const index = e.target.getAttribute('data-xfy-index');
  state.currentIndex = (index as unknown) as number;
};
```

### HTMLElement

当需要在页面中获取到 DOM 节点再操作时，有些时候可能需要推断为 HTMLElement 类型。这样才能正确的使用 DOM 方法。

```ts
type CateData = {
  cateTopYs: number[];
  itemRefs: Record<string, Record<string, number>>[];
  currentIndex: number;
  listRefs: HTMLElement[];
  prePrevious: HTMLElement;
  preNext: HTMLElement;
};
```

在创建响应式对象的时候需要直接使用`document.createElement()`创建一个 HTMLElement
```ts
const cateData: CateData = reactive({
  cateTopYs: [],
  itemRefs: [],
  currentIndex: 0,
  // 小圆角
  listRefs: [],
  // 获取到的节点类型时HTMLElement，所以这里需要使用createElement创建一个HTMLElement
  prePrevious: document.createElement('div'),
  preNext: document.createElement('div'),
});
```

### props 类型

```js
props: {
  path: {
    // https://stackoverflow.com/questions/64831745/props-typing-in-vue-js-3-with-typescript
    type: Object as PropType<string>,
  },
},
```

## v-for

### 控制 v-for

```html
<span v-for="index of goods.services.length - 2" :key="index">
  <img src="" alt="" />
  <span> {{ goods.services[index].name }}</span>
</span>
```

### v-for 中的 Ref 数组

在 Vue 3 中获取循环的 DOM 与 Vue 2 略有不同，在官方文档中有提到：[v-for 中的 Ref 数组](https://v3.cn.vuejs.org/guide/migration/array-refs.html#frontmatter-title)。

具体操作也不是很复杂，在`v-for`循环中绑定一个`:ref` attribute，值为一个方法，方法中能获取到对应的 element。然后 push 到预先准备好的数组内就可以了。

```html
      <SubCategories
        :ref="setItemRef"
        v-for="item in subCategories"
        :key="item"
        :data="item"
      />
```

```ts
  const cateData: CateData = reactive({
    listRefs: [],
  });
```

```ts
  const setListRef = (el: HTMLElement) => {
    if (el) {
      cateData.listRefs.push(el);
    }
  };
```

但是这样有一个问题，那就是这个 setListRef 的执行时机。事实上，这个方法在对应的节点每更新（update）一次，就会执行一次。这样就会导致一个问题，那就是我们通常只需要获取一遍完整的 DOM 节点即可。而每次更新都会将所有的节点 push 到数组内，会导致数组内容成指数型增长，而且内容还是多余的。

所以通常需要额外添加一个判断：

```ts
  const setListRef = (el: HTMLElement) => {
    // 每次节点改变时，都会触发这个方法，会导致一直push
    // 为了防止长度无限增加，需要添加条件判断
    if (el && cateData.listRefs.length < 16) {
      cateData.listRefs.push(el);
    }
  };
```

## keep-alive

缓存的组件一定要设置`name`属性！

* [vue.js的keep-alive include无效](https://segmentfault.com/q/1010000009117672#)

### Vue 3

Vue 3 中的 router-view 与 keep-alive 标签使用方式略有不同。

```html
<router-view v-slot="{ Component }">
  <keep-alive exclude="Detail">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

### 首页滑动位置记录

本来考虑的是使用事件监听器来监听滚动的位置，并保存。在组件激活时再利用`window.scrollTo()`方法滚动到离开时的位置。

不过无脑添加事件监听器可能不是一个非常优雅的办法。后来发现一个简单的方式，利用组件内的导航守卫`onBeforeRouteLeave()`，在路由离开时记录滚动的位置。当组件激活后再直接给`document.documentElement.scrollTop`赋值，即可实现记录滚动位置。

```ts
// 切换路由时记录首页滚动的位置
onBeforeRouteLeave(() => {
  homeData.scrolledY = document.documentElement.scrollTop;
});
onActivated(() => {
  document.documentElement.scrollTop = homeData.scrolledY;
});
```

另外也可以使用路由导航守卫来代替`onActivated()`激活时的方法，在进入路由时为`document.documentElement.scrollTop`赋值。但这样需要注意路由导航的触发顺序几乎都是在更新 DOM 之前：

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

所以需要使用`nextTick()`方法来更新。不过既然使用了`keepAlive`，还是使用对应的生命周期更加方便。

### 动态组件

第一次看到动态组件的时候就很开心，原来组件还能这么玩。这里用到的动态组件主要是用到`keep-alive`来缓存子组件的状态。商品列表的子组件存在一个三栏切换。之前的方案是使用一个组件，每次切换时向里面传递数据，由于只用了一个子组件，每次数据传递完后，还需要重新下载图片。就算用了加载也会发送很多图片的请求。另外，频繁的切换还可能导致节点渲染出现小问题。

将三栏的切换分别放到三个子组件中，然后再使用动态组件来进行缓存。虽然这三个子组件展示数据用的还是那一个组件（为了组件代码的复用），但是由于数据和状态都缓存了之后，每次仅仅只需要过一次 diff 算法即可。不用再下载图片。

```html
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

并且将数据单独抽离为一个 hook，直接进行导出。首页不参与数据的修改，本质上修改数据的只有一个组件，数据改动的流向也没有任何变化。

```ts
// hook
// 配合动态组件即可实现商品数据的缓存
export const state: State = reactive({
  banners: [],
  recommend: [],
  goods: {
    pop: {
      page: 0,
      list1: [],
      list2: [],
    },
    new: {
      page: 0,
      list1: [],
      list2: [],
    },
    sell: {
      page: 0,
      list1: [],
      list2: [],
    },
  },
});

export function homeRequestEffect(): HomeData {
  const listData: ListData = reactive({
    loading: false,
    finished: false,
  });

  // 首页的请求
  const reqSwiper = async (): Promise<void> => {
    const res = await request({
      url: '/home/multidata',
    });
    state.banners = res.data.banner.list;
    state.recommend = res.data.recommend.list;
  };

  // 商品的请求
  const reqGoods = async (type: string): Promise<void> => {
    const page = state.goods[type].page + 1;
    const res = await request({
      url: '/home/data',
      params: {
        type,
        page,
      },
    });
    const paging = Math.floor(res.data.list.length / 2);
    const p1 = res.data.list.slice(0, paging);
    const p2 = res.data.list.slice(paging, res.data.list.length);
    state.goods[type].list1.push(...p1);
    state.goods[type].list2.push(...p2);
    state.goods[type].page = page;
    listData.loading = false;
  };

  const { loading, finished } = toRefs(listData);
  return {
    loading,
    finished,
    reqSwiper,
    reqGoods,
  };
}
```

### 路由过渡动画

通过添加 [过渡模式](https://cn.vuejs.org/v2/guide/transitions.html#%E8%BF%87%E6%B8%A1%E6%A8%A1%E5%BC%8F) 来定义在多个路由或组件中的平滑过渡

```html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

这种方法在 Vue 3 中使用有限制！Vue 3 支持组件多根节点，但目前 transition 只支持但根节点。则多根节点的组件无法使用 transition。

## router

### route path

在`setup()`中使用`route.path`只能获取到`/`目录，原因是因为在`<router-view>`外的组件只能等路由内的组件加载完成后获取到路由信息。可以在`setup()`函数中将`route.path` return 出来。

```js
setup() {
  const nowPath = computed(() => {
    return route.path;
  });
  return {
    nowPath,
  };
}
```

[demo](https://codesandbox.io/s/router-viewyushengmingzhouqi-wl1jn)


## axios

### 数据拦截器

使用了数据拦截器后还是 `AxiosResponse<any>` 类型，导致无法使用请求后的数据。需要自定义一个类型声明：

```ts
// types/axios.d.ts
import * as axios from 'axios';

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}
```

并在`tsconfig.json`中将 types 引入。

```json
// tsconfig.json
"typeRoots": [
  "./node_modules/@types",
  "./src/types/",
],
```

## Vant UI

### List 组件

在使用 List 组件做瀑布流时，需要注意使用 flxe 或其他布局时，有可能会导致内容无限的加载。

这是因为 List 在末尾使用了一个 placeholder 来做加载判断。当 placeholder 在视口内的时候，就会触发加载。

所以当布局被改为横向的时候就会导致无限的触发加载。

就算 flex 横向排列进行换行也会导致无限加载。如果使用 flex 做横向排列，需要额外再嵌套一个 div 做 wrapper。这个wrapper 内部再使用 flex 横向排列。

```html
<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <!-- 额外嵌套一个div，将van-list的placeholder挤下去，否则会影响上拉加载 -->
    <div class="goods-list">
      <div class="goods-list__col">
        <GoodsListItem
          class="goods-list__col__item"
          v-for="item of goods[currentTab].list1"
          :key="item"
          :item="item"
        />
      </div>
      <div class="goods-list__col">
        <GoodsListItem
          class="goods-list__col__item"
          v-for="item of goods[currentTab].list2"
          :key="item"
          :item="item"
        />
      </div>
    </div>
  </van-list>
</template>
```

```scss
.goods-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  margin-bottom: 60px;
  &__col {
    width: 45%;
  }
}
```

### 透传样式

在 scoped 中的样式是不会直接影响到其他组件的。如果使用了 UI 库，需要针对单个组件内的子组件进行样式修改，可以使用`/deep/`来对 CSS 进行修饰。使其能够在 scoped 的情况透传到子组件。

```css
/* 穿透到子组件 */
/deep/ .van-list__loading {
  width: 100%;
}
```

但如果是 dart-scss 的话，需要使用`::v-deep`进行修饰。

```scss
// 穿透到子组件
::v-deep .van-list__loading {
  width: 100%;
}
```

#### 透传样式的再次更新

```scss
  // 穿透到子组件
  :deep(.van-list__loading) {
    width: 100%;
  }
```

## UI & 其他

### px2vw

上一个 Vue3 的项目使用的是 rem 布局，每次要换算倒不是非常的麻烦。但是最终的效果还是一般般。

所以这次试了试 vw 布局。使用的是`postcss-px-to-viewport`的 postcss 插件。

```
yarn add postcss-px-to-viewport -D
```

```js
module.exports = {
  plugins: {
    autoprefixer: {}, // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 375, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    },
  },
};
```

### sass 全局变量

vue-cli 支持 [向预处理器-loader-传递选项](https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9)，从而全局的导入变量文件。

是不需要额外安装`sass-resources-loader`的。参考[Using sass-resources-loader with vue-cli v3.x](https://stackoverflow.com/questions/49086021/using-sass-resources-loader-with-vue-cli-v3-x)

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        prependData: `@import "~@/assets/css/_variables.scss";`,
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      // scss: {
      //   additionalData: `@import "~@/variables.scss";`,
      // },
    },
  },
};
```

### 平均空间

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

![](../images/第一个SPA的总结/2021-03-01-12-15-31.webp)

当然也可以使用 space-evently

### 瀑布流

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

![](../images/第一个SPA的总结/2021-03-12-10-48-27.webp)

### 动画

在尾期的时候，觉得有些地方过渡的不是很自然，于是想添加一些动画。

#### 滑动缓入动画

在商品列表被滑动进入视口时，想添加一个缓入的动画，这样看上去会显得自然一点（应该吧）。既然是进入视口时发生的动画，第一个想到的自然是使用 IntersectionObserver API 来检测是否与视口相交。如果检测到相交之后，则添加对应的行内样式。

```ts
    // 使用 Intersection Observer API 来监听项目是否和视口相交
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 断言为 HTMLElement 才可操作 style
          const target = entry.target as HTMLElement;
          setTimeout(() => {
            target.style.transform = `translateY(0px)`;
            target.style.opacity = `1`;
          }, 300);
          // 动画完成后取消监听
          observer.unobserve(entry.target);
        }
      });
    });
    // vfor 循环中使用两个方法添加列表监听
    const setList1Ref = (el: { $el: HTMLElement }) => {
      el ? observer.observe(el.$el) : void 0;
    };
    const setList2Ref = (el: { $el: HTMLElement }) => {
      el ? observer.observe(el.$el) : void 0;
    };
```

元素本身的样式则提前准备好过渡：

```css
  // 视口相交动画
  transform: translateY(35px);
  opacity: 0;
  transition: all 0.2s ease;
```

这里也顺便提一下，Vue3 中使用 ref 拿取`v-for`循环中的节点需要在节点上绑定一个方法，之后会在更新时自动触发方法。这里就是使用方法来为每个节点添加监视的。

```html
<GoodsListItem
  class="goods-list__col__item"
  v-for="item of goods[currentTab].list1"
  :key="item"
  :item="item"
  :ref="setList1Ref"
/>
```

```ts
 const setList1Ref = (el: { $el: HTMLElement }) => {
   el ? observer.observe(el.$el) : void 0;
 };
```

#### 列表动画

在个人的 Profile 页面有几个无序列表用来展示对应的选项，由于关于页做了个卡片的效果，所以给它写了个简单的 CSS 动画，在每次进入页面时都会执行一次。

```css
@keyframes slidein {
  from {
    transform: translateY(10px);
  }
  to {
    transform: translateY(-20px);
  }
}
@keyframes spin {
  from {
    transform: translateY(5px);
  }
  to {
    transform: translateY(-25px);
  }
}
```

但总感觉还少点什么，于是就给列表也加了一些小过渡。但所有列表同时过渡也不是很自然，于是做了点小操作让它们并不是同一时间开始动画，持续时间也略有不同，这样看上去更和谐一点。

具体的实现方式是使用同样的方式拿到`v-for`循环中的所有元素节点，然后再`onMounted`之后触发动画。

第一个列表的动画持续时间是 200 ms，后面每个的持续时间都增加 100 ms。同时开始也设置了个延迟为 100 ms 后执行，后续每个也递增 100 ms。这样就有了种阶梯的感觉。

```ts
  const setListItem = (el: HTMLElement) => {
    content.list?.push(el);
  };
  const listAnimat = () => {
    // 手搓动画
    // 每个动画间隔增加100ms，持续实际增加100ms
    let time = 0.2;
    let timeout = 0;
    for (const i of content.list) {
      setTimeout(() => {
        i.style.transform = `translateY(0px)`;
        i.style.transition = `all ${time}s`;
        i.style.opacity = `1`;
      }, timeout);
      time += 0.1;
      timeout += 100;
    }
  };

// 组件内使用
    onMounted(async () => {
      await nextTick();
      listAnimat();
    });
```

## 后端

###  备份 mongodb

mongodb 的备份与其他的关系型数据库非常类似，使用`mongodump`命令。不过我当前的测试环境是在 docker on windows 上的，并且忘记映射目录了（虽然他会提示 WSL 目录直接映射会有性能问题，但我还是忘了）。

无论在什么环境的 docker，都可以使用`exec`来执行容器的命令。可以使用`/bin/sh`开打开一个伪终端。

```bash
docker exec -it 979534a50979 /bin/sh
```

然后在容器内使用`mongodump`的命令来 dump 一份备份。

```bash
mongodump -h 127.0.0.1 -d guguMall --out /
```

由于导出的都是 json 与 bson，可以适当的压缩一下

```bash
tar -zcvf guguMall.tar.gz guguMall
```

然后使用 docker 自带的 copy 命令`docker cp`来将文件 copy 到宿主机。

```bash
docker cp 979534a50979:/guguMall.tar.gz /
```

> windows （PowerShell）环境下`/`也就是 C 盘

### 恢复

```bash
mongorestore -h 127.0.0.1 -d guguMall ./guguMall
```

### CORS

跨域是经典的问题了，主要是用来保护客户端的。这里使用 CORS 来解决，做了个简单的中间件：

```ts
import { Context } from 'koa';

export async function cors(ctx: Context, next: () => Promise<unknown>) {
  // 允许来自所有域名请求
  ctx.set('Access-Control-Allow-Origin', '*');
  // 这样就能只允许 http://localhost:8080 这个域名的请求了
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
  // 设置所允许的HTTP请求方法
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
  // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
  ctx.set(
    'Access-Control-Allow-Headers',
    'x-requested-with, accept, origin, content-type'
  );
  // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
  // Content-Type表示具体请求中的媒体类型信息
  ctx.set('Content-Type', 'application/json;charset=utf-8');
  /*
  CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
      Cache-Control、
      Content-Language、
      Content-Type、
      Expires、
      Last-Modified、
      Pragma。
  */
  // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // getResponseHeader('myData')可以返回我们所需的值
  // ctx.set('Access-Control-Expose-Headers', 'myData');
  await next();
}
```