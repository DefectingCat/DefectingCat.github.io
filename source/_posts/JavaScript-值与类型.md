---
title: JavaScript-值与类型
date: 2021-07-12 11:41:03
tags: JavaScript
categories: 笔记
url: javascript-value-and-type
---

## 值与引用

在许多编程语言中，赋值和参数传递可以通过值赋值（value-copy）或者引用复制（reference-copy）来完成。

例如在 C 中，传递一个引用值可以通过声明类似于这样的`int* num`参数来按引用传递，如果传递一个变量 x，那么`num`就是指向 x 的引用。引用就是指向变量的指针，如果不声明为引用的话，参数值总是通过值来传递的。即便是复杂的对象值也是如此（C++）。

与 C/C++ 不同的是，JavaScript 没有指针这一概念，值的传递方式完全由值来决定。JavaScript 中变量不可能成为指向另一个变量的指针。

基本类型（简单类型）的值总是通过以值复制的方式来赋值/传递，这些类型包括：`null`、`undefined`、字符串、数字、布尔和`symbol`。

而复合值，也就是对象（以及对象的子类型，数组、包装对象等）和函数，则总是以引用复制的方式来赋值/传递。

在了解了基本类型和引用类型的值之后，先来看下他们传递有什么不同：

基本类型：

由于基本类型是按值传递的，所以 a 与 b 是分别在内存中两处保存了自己的值。a 有在内存中有自己的空间，b 也有自己单独的空间，他们互不影响。

```js
let a = 123;
let b = a; // 按值进行传递

a += 1; // 修改 a
console.log(a); // 124
console.log(b); // 123 b 不受影响
```

引用类型：

引用值的情况正好相反，所谓按引用传递，就是`arr1`与`arr2`指向的是内存中的同一块地址，**修改**任何一个变量的值，都会立即反应到另一个变量上。因为他们对应的是同一块内存。

```js
let arr1 = [1, 2, 3];
let arr2 = arr1;

arr1.push(99); // 修改 aar1
console.log(arr1); // [ 1, 2, 3, 99 ]
console.log(arr2); // [ 1, 2, 3, 99 ]
```

但是引用值还有个特性容易犯错，那就是修改：

这里咋一看是修改了`arr1`的值，但为什么没有反应到`arr2`身上呢？说好的一起变呢？

仔细回想一下引用值的定义，他们是因为指向同一块内存地址，所以修改这段地址中的值时，就会同时反应在两个变量上。但是这里的`arr1 = { name: 'xfy' }`并不是修改内存中的值，而是修改了`arr1`的指向，使其指向一块新的内存地址。而`arr2`还是指向以前的地址，所以`arr2`没有改变。

```js
let arr1 = [1, 2, 3];
let arr2 = arr1;

arr1 = { name: 'xfy' };
console.log(arr1); // { name: 'xfy' }
console.log(arr2); // [ 1, 2, 3, 99 ]
```

### 使用函数修改值

由于上述值的传递特性，这也会导致在传递给函数参数时发生个中问题。

修改引用值：

```js
function changeValue(value) {
  // 按引用传递，可以直接修改
  value.push(99);
  // 重新赋值，并没有修改内存中的值
  value = { name: 'xfy' };
}

let arr = [1, 2, 3];
changeValue(arr);
console.log(arr); // [ 1, 2, 3, 99 ] 
```

修改基本值：

```js
function changeValue(value) {
  // 按值传递，value 获取到 num 的值
  // 但是他们分别保存在两个内存中
  value++;
}

let num = 123;
changeValue(num);
console.log(num); // 123
```

这也就是为什么在 Vue3 的 Composition API 中使用 ref 封装的响应式变量必须要有`.value`属性。

![按引用传递与按值传递](../images/%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript-%E4%B8%AD/pass-by-reference-vs-pass-by-value-animation.gif)

## 强制类型转换

将值从一种类型转换为另一种类型通常称为类型转换（type casting），这是显式的情况；隐式的情况称为强制类型转换（coercion）。

也可以这样来区分：类型转换发生在静态类型语言的编译阶段，而强制类型转换则发生在动态类型语言的运行时（runtime）。

### 抽象值操作

在了解强制类型之前，我们需要先掌握类型之间转换的基本规则。ES5 规范第 9 节定义了一些“抽象操作”和转换规则。

#### ToString

ES5 规范 9.8 节定义了抽象操作 ToString。ToString 负责非字符串到字符串的强制类型转换操作。

基本值转换为字符串的规则为直接添加双引号：null 转换为`"null"`，true 转换为`"true"`等。数字也遵循这种规则，不过极大或极小的数字使用指数形式。

```js
(1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000).toString()
// "1.07e+21"
```

`JSON.stringify()`不是强制类型转换，它涉及到 ToString 的规则：

1. 字符串、数字、布尔值和 null 的`JSON.stringify()`规则与 ToString 基本相同。
2. 如果传递给`JSON.stringify()`的对象中定义了`toJSON()`方法，那么该方法会在字符串化之前调用，以便将对象转换为安全的 JSON 值。

#### ToNumber

ES5 规范 9.3 节定义了抽象操作 ToNumber。

其中 true 转换为 1，false 转换为 0。undefined 转换为 NaN，null 转换为 0。

对对象或数组会先转换为相应的基本类型值，如果返回的是非数字类型值，则再遵循上述规则将其强制转换为数字。

为了转换为相应的基本值，抽象操作 ToPrimitive 会首先（通过内部操作 DefaultValue）检查该值是否有`valueOf()`方法。如果有并返回基本类型值，就使用该值进行强制类型转换。如果没有就使用`toString()`的返回值来进行强制类型转换。

如果这两个方法都没有，就会产生 TypeError 错误。

#### ToBoolean

ES5 规范 9.2 节定义了抽象操作 ToBoolean。

这些是假值：

* undefined
* null
* false
* +0、-0 和 NaN
* `""`

假值的布尔强制类型转换结果为 false。

**假值对象**

规范中定义的所有对象都是真值，包括封装了假值的对象：

```js
const a = new Boolean(false);
const b = new Number(0);
const c = new String('');

console.log(Boolean(a && b && c)); // true
```

浏览器在某些特定情况下，在常规 JavaScript 语法基础上自己创建了一些外来值，这些值就是“假值对象”。

例如 IE 已废弃的用法`document.all`。它是一个类数组对象，包含 DOM 列表，曾经是一个真正的对象，不过它现在是一个假值对象。

## 显式强制类型转换

强制显式类型转换是那些显而易见的类型转换，它类似于静态语言中的类型转换，已被广泛接受。

和那些静态语言类似，JavaScript 有可以直接调用构造函数来显式的转换类型：

```js
String(123)
Number('123')
```

### 奇特的`~`运算符

`~`运算符是位操作符（按位非），它比较令人费解。

字位运算只适用于 32 位整数，运算符会将操作数强制转换位 32 位格式。这是通过 ES5 规范 9.5 节定义的 ToInt32 来实现的。

严格来说这不是强制类型转换，因为返回的值的类型并没有变化。但字位运算符和某些特殊数字在一起使用时会产生类似强制类型转换的效果，返回另外一个数字。

```js
0 | -1			// 0
0 | NaN			// 0
0 | Infinity	// 0
0 | -Infinity	// 0
```

上面这些数字不能被转换为 32 为数字，因此 ToInt32 返回 0。

`~`运算符和`!`很像，它首先将值转换为 32 位数字，然后执行字位操作“非”（反转每一位）。类似于：

```js
~32 // -(32 + 1) = -33
```

它可以被应用在`indexOf()`中，`indexOf()`如果没有找到则返回 -1。这种返回值很难直接被 if 语句隐式转换所利用，所以我们可以使用`~`运算符来强制转换类型为布尔值。

```js
let str = 'xfy'
if (str.indexOf('x') != -1) // 找到
if (~str.indexOf('x')) 		// -1 真值 找到
```

### 显式解析数字字符串

上述介绍过，JavaScript 可以和静态语言类似的转换类型，数字也不例外。

但使用`Number('123')`转换数字与解析字符串到数组`parseInt('123')`有一点不同。解析字符串允许带有非数字的字符串：

```js
Number('123')		// 123
parseInt('123')		// 123

Number('123xfy')	// NaN
parseInt('123xfy')	// 123
```

`parseInt()`会从左往右一直解析到第一个非数字的字符串为止，并返回所有的数字。而`Number()`不能包含任何非数字的字符串。

并且`parseInt()`会尽可能尝试隐式的转换操作数的类型，下面这个示例之所以等于 18 是因为`1 / 0`返回 Infinity，而`parseInt()`会将 Infinity 当作字符串处理。当 19 进制遇到 Infinity 时会解析到第二个字符 n 为止，而 I（区分大小写）正好等于 18。

```js
parseInt(1/0, 19)  // 18
```

## 隐式强制类型转换

隐式强制类型转换指的是那些隐蔽的强制类型转换，副作用也不是很明显。隐式强制类型转换的作用是减少冗余，让代码更简洁。

### 字符串与数字之间

字符串和数字之间利用一些操作符会触发隐式的强制类型转换。通过重载，`+`运算符既能用于数字加法，也能用于字符串拼接。

在遇到字符串与数字相加时，它从左向右开始，如果遇到的都是数字，则进行数学相加；如果下一位遇到了字符串，则执行字符串拼接。遇到一次字符串后，后续再遇到数字也时执行拼接操作。

```js
console.log('42' + 0); 		// 420
console.log(20 + 1 + '0');  // 210
console.log(20 + 1 + '0' + 2);	// 2102
```

另外，`+`运算符如果遇到了非字符串或数字，它会尝试进行隐式转换。

```js
[1, 2] + [3, 4];  // "1,23,4"
```

根据规范 11.6.1 节，如果某个操作数是字符串或者能转换为字符串的话，`+`进行拼接操作。如果其中一个是对象，则首先对其调用 ToPrimitive 抽象操作，该抽象操作再调用`[[DefaultValue]]`，以数字作为上下文。

简单来说，就是对数组进行`valueOf()`操作时无法得到简单的基本值，于是转而使用`toString()`操作。因此两个数组分别得到了`"1,2"`和`"3,4"`。最终拼接为`"1,23,4"`。这和 ToNumber 抽象操作处理对象的方式一样。

上述提到过，如果从左到右遇到了一个字符串，那么`+`运算符就会执行拼接操作。可以利用这个特性来将数字转换为字符串。

```js
console.log(21 + '');
```

这是一种隐式的转换，它和显式的`String(21)`很类似。但是他们之间有一个细微的差别，根据 ToPrimitive 抽象操作，`21 + ''`会对 21 调用`valueOf()`方法，然后通过 ToString 抽象操作转换为字符串。而`String(21)`则是直接调用`toString()`。

```js
const a = {
  toString() {
    return 99;
  },
  valueOf() {
    return 210;
  },
};
console.log(a + ''); // 210
console.log(String(a)); // 99
```

通常情况下这两种操作各有各的有点。`a + ''`更常见一点，虽然饱受诟病，但隐式强制类型转换仍然有它的用处。

### 隐式强制转换为布尔值

一些语句会触发隐式强制转换为布尔值的操作：

1. `if (...)`语句中的条件判断表达式。
2. `for (...;...;..)`语句中的条件判断表达式。
3. `while (...)`和`do .. while (...)`循环中的条件判断表达式。
4. `? : `三元运算符中的条件判断表达式。
5. `||`和`&&`左边的操作数。

### || 和 &&

逻辑运算符`||`和`&&`再大多数语言中都有，但在 JavaScript 中的表现与其他语言略有不同。

ES 5 规范中 11.11 节：

> `||`和`&&`运算符的返回值不一定是布尔类型，而是两个操作数其中一个。

`||`和`&&`首先会对左边操作数进行条件判断，如果其值不是布尔值就先进行 ToBoolean 强制类型转换，然后再执行条件判断。

`||`返回结果为 true 的那个，但它是从左到右进行运算的，如果左侧操作数为 true，则不会对右侧操作数进行运算。反之亦然。

`&&`则相反，只有左侧操作数为 true 时才会对右侧操作数进行运算。

换一个角度来看：

```js
const a = 32;
const b = 'xfy';

a || b;
// 大致相当于
a ? a : b;

a && b;
// 大致相当于
a ? b : a;
```

这里的大致相当于是因为三元运算符在条件判断中，如果 a 为 true 的话，a 可能会被执行两次。

`&&`有个类似于 if 语句的用法，在代码压缩工具中比较常见：

```js
if (a) { b() };
a && b();
```

这是利用了`&&`的短路机制。

### 符号的强制类型转换

ES6 中引入了符号类型，它允许显式的强制类型转换，而不允许隐式的类型转换。

```js
let s1 = Symbol('xfy');
console.log(String(s1)); // "Symbol(xfy)"

let s2 = Symbol('dfy');
console.log(s2 + ''); // TypeError: Cannot convert a Symbol value to a string
```

## 宽松相等和严格相等

宽松相等（loose equals）和严格相等（strict equals）都用来	判断两个值是否“相等”。

他们的区别是：`==`允许在相等比较中进行强制类型转换，而`===`不允许。

### 抽象相等

ES5 规范 11.9.3 节的“抽象相等比较算法”定义了`==`运算符的行为。该算法简单而又全面，涵盖了所有可能出现的类型组合，以及它们进行强制类型转换的方式。

有几个特殊的情况需要注意：

* NaN 不等于 NaN。
* +0 等于 --0。

11.9.3.1 的最后定义了对象的宽松相等。两个对象指向同一个值时即视为相等，不发生强制类型转换。

此外，`==`在毕竟两个不同类型的值时会发送隐式强制类型转换，会将其中的一或两者都转换为相同的类型后再比较。

#### 字符串与数字

字符串与数字是两种不同的数据类型，在进行宽松相等比较时，会触发隐式类型转换。

```js
42 == '42'
```

根据 ES5 规范 11.9.3.4-5 定义：

1. 如果`x == y`中，x 是数字，y 是字符串，则返回`x == ToNumber(y)`的结果。
2. 如果`x == y`中，x 是字符串，y 是数字，则返回`ToNumber(x) == y`的结果。

总的来说，就是会将非数字的类型优先转换为字符串来与数字进行比较。

#### 其他类型与布尔值

`==`操作最容易出错的地方就是与布尔值 true 和 false 相比较。

```js
42 == true // false
```

数字 42 肯定是一个真值，但它居然不等于 true？

根据规范 11.9.3.6-7 中：

1. 如果`x == y`中，x 是布尔类型，则返回`ToNumber(x) == y`的结果。
2. 如果`x == y`中，y 是布尔类型，则返回`x ==ToNumber(y) `的结果.

也就是说，布尔值会先被转换为数字，然后再与其他类型相比较。上述例子中，true 会先被转换为 1，然后`42 == 1`得到的结果为 false。

根据规范的定义，这也就意味着`42 == false`返回的也是 false。这看上去非常奇怪，一个真值居然既不等于 true，也不等于 false。

但仅仅只是看上去，根据规范的定义，宽松相等与布尔值相比较时并不涉及 ToBoolean 的转换，所以 42 是真值还是假值也无从上述判断。

目前宽松相等都会优先将布尔值转换为数字，再将剩下的操作数也转换为数字进行比较。所以不要使用宽松相等用来和布尔值比较，从而判断一个值的真假。

如果需要，下面的用法会更好：

```js
if (a) {...}
if (!!a) {...}
if (Boolean(a)) {...}
```

#### null 与 undefined

null 和 undefined 之间的宽松相等也涉及隐式强制类型转换。ES5 规范 11.9.3.2-3 规定，他们之间宽松相等返回 true。

也就是说，再宽松相等中，`null == undefined`（它们与其自身也相等）。除此之外的值都不和他们两个相等。

所以 null 和 undefined 之间的类型转换是安全可靠的。如果需要判断一个值是 null 或 undefined，就可以使用宽松相等。

```js
const a = doSomething();
if (a == null) {
	// ...
}
```

这样的条件判断仅在 a 返回 null 或者 undefined 时才成立，除此之外的其他值都不成立，包括0、false和`''`这样的假值。

#### 对象与非对象

对象与基本类型值之间，ES5 规范 11.9.3.8-9 规定：

1. 如果`x == y`中，x 是基本值，y 是对象，则返回`x == ToPrimitive(y)`的结果。
2. 如果`x == y`中，x 是对象，y 是基本值，则返回`ToPrimitive(x) == y`的结果。

> 基本类型布尔值会优先被转换为数字。

```js
const a = ['123'];
console.log(a == 123); // true
```

这种情况 a 会先被调用 ToPrimitive 操作，得到字符串`'42'`，然后`'42' == 42`则又会将字符串转换为数字 42，最后`42 == 42`得到 true。

另外，手动包装的对象在隐式强制类型转换中也会被拆封。

```js
console.log('xfy' == new String('xfy')); // true
```

### 其他情况

上述已经全面的介绍了`==`运算符中的隐式强制类型转换，接下来再来看下一些较为极端的情况。

先来看看修改内置原生原型会导致哪些奇怪的结果。

#### 返回其他数字

```js
a == 2 && a == 3 && a == 4
```

这个表达式看上去怎么也不能成立，但是了解了上述的隐式类型转换之后，仿佛有了一线生机。只要变量 a 不是基本值，那它就有可能成立。

根据上述的 ToPrimitive 操作，对象会先调用`valueOf()`来尝试获取一个基本值，所以这里需要将 a 手动包装为Number 的一个实例。并修改内置原生原型`valueOf()`方法，让它产生副作用，使得每次转换时，都会将`valueOf()`返回的值增加。这样在`==`触发类型转换时，就可以使上述表达式成立。

```js
let x = 2;
Number.prototype.valueOf = function () {
  return x++;
};
const a = new Number(2);
```

#### 极端的情况

```js
[] == ![] // true
```

事情看起来变得疯狂了，这仿佛表明一个空数组即是真值也是假值。但我们不能被表明现象所欺骗了，抽象相等会优先将布尔值转换为数字。也就是说`![]`的值为 false 会被转换为 0；而空数组`[]`不会涉及到 ToBoolean 的转换，它最终会 ToNumber 进行转换。空数组在 ToNumber  后得到的也是 0。所以二者相等。

## 小结

使用抽象相等时，两边的值都需要认真的推敲。

* 如果两边的值有 true 或 false，坚决不要使用`==`；
* 如果两边的值有`[]`、`''`或 0，尽量不要使用`==`；

显式强制类型转换会明确的告诉了我们哪些地方进行了类型转换，有助于提高代码的可读性和可维护性。

而隐式强制类型转换则没有那么明显，是其他操作的副作用。实际上隐式强制类型转也有助于提高代码的可读性。

> 知其然，知其所以然