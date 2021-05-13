## 函数

### 重载

重载函数：有多个调用签名的函数。

在多数编程语言中，声明函数时一旦指定了特定的参数和返回类型，就只能使用相应的参数调用参数。但 JavaScript 是一门动态语言，势必需要以多种方式调用一个函数的方法。不仅如此，而且有时输出的类型取决于参数的类型。

TypeScript 也支持动态重载函数声明，而且函数的输出类型却决于输入类型。

一个普通的函数类型注解：

```ts
type Reserve = {
  (from: Date, to: Date, destination: string): string;
};

const reserve: Reserve = (from,toOrDest, destination) => {
  const cost = Math.floor(Math.random() * (998 - 199) + 198);
  return `To ${destination} need ${cost} ${from.toLocaleString()}`
};
console.log(reserve(new Date(), new Date(), 'bali'));
```

函数的重载需要在注解时定义多个类型，在函数声明时需要手动组合两个签名：

```ts
type Reserve = {
  (from: Date, to: Date, destination: string): string;
  (fr om: Date, destination: string): string;
};

const reserve: Reserve = (
  // 参数需要手动在注解并组合两个签名
  from: Date,
  toOrDest: Date | string,
  destination?: string
) => {
  const cost = Math.floor(Math.random() * (998 - 199) + 198);
  if (toOrDest instanceof Date && destination !== undefined) {
    return `To ${destination} need ${cost} ${from.toLocaleString()} ${toOrDest.toLocaleString()}`;
  } else {
    return `To ${toOrDest} need ${cost} ${from.toLocaleString()}`;
  }
};
console.log(reserve(new Date(), new Date(), 'bali'));
console.log(reserve(new Date(), 'bali'));
```

### 多态

使用具体类型的前提是明确知道需要什么类型，并且想确认传入的确实是那个类型。但是，有时事先并不知道需要什么类型，不想限制函数只能接受某个类型。

这种情况可以使用函数泛型（generic type）参数。

> 在类型层面施加约束的占位类型，也称多态类型参数。

例如我们重写一个简单的数组 filter 方法，在我们老朋友 JavaScript 中，这是一个很基本的函数。

```js
const filter = (arr, fn) => {
  let result = [];
  for (const i of arr) {
    if (fn(i)) {
      result.push(i);
    }
  }
  return result;
};
```

但在 TypeScript 中，为了类型保护我们就需要为其添加类型注解。而这个函数的特点就是他可以（需要）接受多种类型的参数，且函数的返回值也是跟着参数的类型变化的。

也许利用重载为其注解所有类型也是可以的：

```ts
type Filter = {
  (arr: number[], fn: (item: number) => boolean): number[];
  (arr: string[], fn: (item: string) => boolean): string[];
};
```

但是如果遇到了对象数组呢：

```ts
type Filter = {
  (arr: number[], fn: (item: number) => boolean): number[];
  (arr: string[], fn: (item: string) => boolean): string[];
  (arr: Object[], fn: (item: Object) => boolean): Object[];
};
```

Object 无法描述对象结构，它可以代表所有类似对象的结构。

这时候就需要使用泛型了：

```ts
type Filter = {
  <T>(arr: T[], fn: (item: T) => boolean): T[];
};
```

这里泛型的意思是：filter 函数使用一个泛型参数 T，在事先我们不知道其具体的类型。TypeScript 从传入的 arr 参数种推导出 T 的类型。调用 filter 时，T 的类型被推导出后，将把 T 出现的每一处替换为推导出的类型。T 就像是一个占位类型，类型检查器会根据上下文填充具体的类型。T 把 Filter 的类型参数化了，因此才称其为泛型参数。

#### 泛型作用域

泛型声明的位置不仅限定了泛型的作用域，还决定了 TypeScript 什么时候为泛型绑定具体的类型。

例如之前 Filter 函数的类型：

```ts
type Filter = {
  <T>(arr: T[], fn: (item: T) => boolean): T[];
};
const filter:Filter = (arr, fn) // ...
```

`<T>`在调用签名中声明（位于签名开始的括号前），TypeScript 将在调用 Filter 类型的函数时为 T 绑定具体类型。

而如果把 T 的作用域