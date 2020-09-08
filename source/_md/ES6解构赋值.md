---
title: ES6解构赋值
index_img: /images/
date: 2020-08-30 16:50:30
tags:
categories:
url:
---


解构赋值是一种JavaScript的语法表达式，通过解构赋值，可以将属性/值从对象/数组等中提取出来，赋值给其他变量。

基本规则：

1. 数组的元素是按次序排列的，变量的取值由它的位置决定；
2. 对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

解构赋值采用和字面量类似的表达式，不同的是在表达式左边定义了要从原变量中提取出什么变量。

## 语法

```js
var a, b, rest;
[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]

({ a, b } = { a: 10, b: 20 });
console.log(a); // 10
console.log(b); // 20


// Stage 4（已完成）提案中的特性
({a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40});
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```

```js
var x = [1, 2, 3, 4, 5];
var [y, z] = x;
console.log(y); // 1
console.log(z); // 2
```

## 数组

数组的解构赋值是按顺序排列的，变量的取值由他的位置决定。先来几个简单的例子：

```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
let [a, b, c, d] = arr;

console.log(a, b, c, d); // 1, 2, 3, 4
```

与一般的字面量赋值不同，解构赋值数组是将等式由边的数组按顺序赋值给左边的变量。

### 默认值

当然等式的左右两边长度可能不一样，没有获取到值的变量会被声明为undefined，就和只声明不赋值变量一样。

不过解构赋值还可以为其赋予一个默认值，这样变量在为获取到值的情况下就会被赋予到默认的值。

```js
let [a = 123, b = 123] = [1];
// a: 1;
// b: 123;
```



```
[结构赋值|MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
```