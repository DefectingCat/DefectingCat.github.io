---
title: Vue3!
date: 2021-05-05 18:08:31
tags: Vue
categories: 实践
url: vue3-notes
index_img: 
---

> 早期学习 Vue3 API 的笔记。

## setup

setup 方法在实例被创建（created）之前。

### ref

直接在 setup 中定义变量无法自动成为响应式，需要使用 ref 将其通过 proxy 代理为响应式变量。

```js
const name = ref('xfy')
```

上述是`xfy`变为`Proxy({value: 'xfy'})`这样一个响应式引用。

### reactive

reactive 与 ref 类似，它直接将对象设置为响应式变量。

```js
const state = reactive({
    name: 'xfy'
})
```

解构会使其失去响应性，需要使用 toRefs。

### toRef

使用 toRefs 解构时，如果解构的属性是可选的属性。那么 toRefs 不会自动创建默认值，这种情况下需要使用 toRef 来代替它。

```js
  props: {
    msg: String,
  },
  setup(props) {
    const name = toRef(props, "name");
    console.log(name.value);
    return {
      name,
    };
  },
```

toRef 如果对应的属性不存在，那么 toRef 会为其创建一个响应式的默认值。

### 解构 reactive

roRefs 可以解构响应式的变量，使其依然保持响应式。对于 reactive 创建的响应式变量也能使用 toRefs 来解构。

```js
  setup() {
    const state = reactive({
      name: "xfy",
    });
    const { name } = toRefs(state);
    return {
      name,
    };
  },
```

## Non-Props

在 Vue3 中，在子组件中可以定义不 Props 属性。在父组件中传递 Props 给子组件时，有多种情况：

* 单根，`inheritAttrs: false`

  在默认情况下，子组件中不定义 Props 属性时，在父组件中传递的 Attribute 会直接传递给单根的子组件元素上。当定义了`inheritAttrs: false`时，将不默认转递 Attribute。

* 多根，`inheritAttrs: false`

  在子组件中有多个根元素的情况下，可以指定某个根元素继承 Attribute。使用`v-bind`方法。也可以直接访问传递的 Props：

  ```html
  <template>
    <div>test</div>
    <div v-bind="$attrs">{{ $attrs.msg }}</div>
    <div>test</div>
  </template>
  ```

## Context

Setup 方法接受两个参数，分别是传递的 Props 和 Context。Context 里分别有三个有用的属性：

```js
  setup(props, context) {
    // Attribute (非响应式对象)
    console.log(context.attrs)

    // 插槽 (非响应式对象)
    console.log(context.slots)

    // 触发事件 (方法)
    console.log(context.emit)
  }
```

### attrs

attrs 是父组件传递给子组件的 Non-Props，可以直接在 attrs 中进行访问。attrs 和 Props 类型，它是有状态对象。会随组件本身的更新而更新，这意味着应该避免对它们进行解构，并始终以 `attrs.x` 或 `slots.x` 的方式引用 property。

与 `props` 不同的是，`attrs` 和 `slots` 是**非**响应式的。如果打算根据 `attrs` 或 `slots` 更改应用副作用，那么应该在 `onUpdated` 生命周期钩子中执行此操作。

### slots

slots 是父组件传递给子组件的插槽内容，可以直接访问具名插槽。

访问的插槽是一个渲染函数，会直接渲染成虚拟 DOM。还可以直接使用 render 函数来渲染出插槽内容。

```html
  <!-- 父组件 -->  
  <HelloWorld msg="Hello Vue 3 in CodeSandbox!"
    >this is a test.
    <template #test> oh,test </template>
  </HelloWorld>
```

```js
// 子组件内
import { h } from "vue";
export default {
  name: "HelloWorld",
  setup(props, { attrs, slots }) {
    console.log(slots.default());
    console.log(slots);
    console.log(attrs);
    return () => h("div", {}, [slots.default(), slots.test()]);
  },
};
```

相当于`this.$slots`

### emit

相当于`this.$emit`；

## watch

watch 是惰性的。

对于使用 ref 创建的响应式对象，watch 可以直接进行监听。而对于 reactive 的响应式对象，需要返回一个函数才能正常监听。

```js
  setup() {
    const nameObj = reactive({ name: "" });
    const nameHistory = reactive([]);
    const { name } = toRefs(nameObj);
    watch(
      () => nameObj.name,
      (cur, pre) => {
        nameHistory.push(pre);
      }
    );
    return {
      name,
      nameHistory,
    };
  },
```

watch 还支持同时监听多个数据的变化，它的两个参数分别都接受数组。不同的是，在回调函数中，参数的顺序是`([第一个当前值, 第二个当前值], [第一个上次值, 第二个上次值])`

```js
    watch(
      [() => nameObj.name, () => nameObj.engName],
      ([curN, curEn], [preN, preEn]) => {
        console.log([curN, curEn], [preN, preEn]);
      }
    );
```

### watchEffect

为了根据响应式状态*自动应用*和*重新应用*副作用，我们可以使用 `watchEffect` 方法。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

watchEffect 是非惰性的

```js
    watchEffect(() => {
      console.log(nameObj.name);
    });
```

### 停止所有的 watch

两个 watch 方法都返回一个方法，通过调用返回的方法就能够取消监听。

```js
    const stopWacth = watchEffect(() => {
      console.log(nameObj.name);
      setTimeout(() => {
        stopWacth();
      }, 5000);
    });
```

## 生命周期函数

`setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。

| 选项式 API        | Hook inside `setup` |
| ----------------- | ------------------- |
| `beforeCreate`    | Not needed*         |
| `created`         | Not needed*         |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `beforeUnmount`   | `onBeforeUnmount`   |
| `unmounted`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |

`renderTracked`：每次渲染之后重新手机响应式依赖；

`renderTriggered`：每次触发页面重新渲染时自动执行；

## Composition API 获取 DOM

首先先在 DOM 节点上赋予对应的 ref attr

```html
<template>
  <div ref="test"></div>
</template>
```

然后在 setup 中使用 ref 方法创建一个空的响应式变量（null），变量名需要与获取的 DOM ref 相同。随后直接 return 该变量。

之后在例如 onMounted 这样的生命周期函数中就能访问到对应的 DOM 元素。

```js
  setup() {
    const test = ref(null);
    onMounted(() => {
      console.log(test.value);
    });
    return {
      test,
    };
  },
```

[Composition API 获取 DOM](https://codesandbox.io/s/composition-api-huoqu-dom-dgvro)

## 一些练习

* [composition-api-provide-inject](https://codesandbox.io/s/composition-api-provide-inject-kbows)
* [Composition API 获取 DOM](https://codesandbox.io/s/composition-api-huoqu-dom-dgvro)
* [composition-api ToDoList](https://codesandbox.io/s/composition-api-todolist-f1fv4)