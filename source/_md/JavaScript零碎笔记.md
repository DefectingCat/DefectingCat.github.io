## 全局对象

Global对象是一个特别的对象，在一般情况下无法访问。它不属于任何其他对象的属性和方法，最终都是它的属性和方法。所有在全局作用域中声明的函数和对象都是Global对象的属性。

在浏览器的执行环境下，window对象将Global的一部分加以实现。所以声明的变量和函数都是window对象的属性。

在nodejs的环境下，全局对象就是Global。

可以让函数在不被任何调用的情况下返回this的方法来得到全局对象。

```js
let g = function () {
    return this;
}
```

## 逻辑运算符

`&&`：逻辑与，进行and操作。全为true时，返回true（返回第二个参数）。第一个参数为false时，返回第一个参数。（通俗理解：谁是false就返回谁，均为false时，返回第一个。）

`||`：逻辑或，进行or操作。全为false时，返回false（返回第二个参数）。第一个参数为true时，返回第一个参数。（通俗理解：谁是true就返回谁，均为true时，返回第一个。）

> 逻辑或与逻辑与是二进制运算，最早的原型就是继电器。CPU中的一个晶体管就相当于一个继电器。

逻辑运算符拥有**优先级**：先运算`&&`再运算`||`。

```js
let a = 1;
let b = 2;
let c = 0;
console.log(a && b);        //2
console.log(c || b);        //2
console.log(a || c && b);   //1
```

## 所有运算符的优先级

1. 一元运算符：`++`、`--`、`!`
2. 算数运算符（符合数学）：先`*`、`/`、`%`后`+`、`-`
3. 关系运算符：`>`、`<`、`>=`、`<=`
4. 相等运算符：`==`、`===`、`!=`、`!==`
5. 逻辑运算符：先`&&`后`||`
6. 赋值运算：`=`

> 任何优先级都可以使用`()`来最优先运算。

## 条件 运算符（？：）

“？：”

这个运算符拥有 三个操 数，第一个 操作数 在“？” 之前， 第二个操作数 在“？” 和“：” 之间， 第三 个操作数 在“：” 之后。

如果条件为真，取值1，否则值2

```js
function ff(user) {
    let greeting = "hello" + (user ? user : "there");
    return greeting;
}
```

同等于

```js
function ff(user) {
    let greeting = "hello";
    if (user) {
        greeting += user;
    }else{
        greeting += "there";
    }
    return greeting;
}
```

## 匿名函数的立即调用

自调用匿名函数。

可以封装一个局部作用域。

```js
(function(){return 'greeting'}())();
"greeting"
```

> 函数不能匿名声明。

## undefined和null不完全相等

```js
username = undefined;
undefined
if (username == null){'is null or undefined'} else {'is undefined'}
"is null or undefined"
if (username === null){'is null or undefined'} else {'is undefined'}
"is undefined"
```

## switch中break语句的作用

如果 没有 break 语句， 那么 switch 语句 就会 从 与 expression 的 值 相 匹配 的 case 标签 处 的 代码 块 开始 执行， 依次 执行 后续 的 语句， 一直 到 整个 switch 代码 块 的 结尾。

在函数中使用switch语句，可以使用return来代替break，return和break都可以用于终止swtich语句，防止继续跳到下个case语句。

> David Flanagan. JavaScript权威指南（原书第6版） (Kindle Locations 2207-2208). 机械工业出版社. Kindle Edition. 

switch实例：

```js
//判断值的类型，并转换为字符串。switch实例
function translate(word){
    switch (typeof word){
        case 'string':
            return "is string:" + '"' + word + '"';
        case 'number':
            return "is number:" + word.toString();
        default:
            return "other type:" + '"' + String(word) + '"';
        }
}
```

## switch工作方式

switch 语句 首先 计算 switch 关键字 后的 表达式， 然后 按照 从上到下 的 顺序 计算 每个 case 后的 表达式， 直到 执行 到 case 的 表达式 的 值 与 switch 的 表达式 的 值 相等 时 为止。 由于 对 每个 case 的 匹配 操作 实际上 是`===` 恒等 运算符 比较， 而 不是`==` 相等 运算符 比较， 因此， 表达式 和 case 的 匹配 并 不会 做 任何 类型 转换。

> David Flanagan. JavaScript权威指南（原书第6版） (Kindle Locations 2219-2222). 机械工业出版社. Kindle Edition. 

## while工作方式

```js
while (expression) {
    statement
}
```

在 执行 while 语句 之前， JavaScript 解释器 首先 计算 expression 的 值， 如果 它的 值 是 假 值， 那么 程序 将 跳过 循环 体中 的 逻辑 statement 转而 执行 程序 中的 下一 条 语句。 反之， 如果 表达式 expression 是真 值， JavaScript 解释器 将 执行 循环 体内 的 逻辑， 然后 再次 计算 表达式 expression 的 值， 这种 循环 会 一直 继续 下去， 直到 expression 的 值 为 假 值 为止。

> David Flanagan. JavaScript权威指南（原书第6版） (Kindle Locations 2238-2240). 机械工业出版社. Kindle Edition. 

## for/in遍历

使用for/in时，在语句内调用对象需要使用标准方法

```js
obj = {a:1, b:2, c:3};
    
for (var prop in obj) {
  console.log(obj[prop]);
}
```

使用`obj.prop`将会输出undefined。

```js
//for...in实例
let arr = [1,2,3,4,5,6,7,8];
for (x in arr){
    console.log(arr[x]);
}
let obj = {
    a:1,
    b:2,
    c:3,
    d:4
}
for (y in obj){
    console.log(obj[y]);
}
//for..in将对象遍历进数组，数组在for...in中对应对象位置。
let obje = {
    a:'x',
    b:'f',
    c:'y',
    d:'6'
}
let arra = [], i = 0, arrb = [];
for (arra[1] in obje) /* empty */;
for (arrb[i++] in obje) /* empty */;
```

## with

只有 在 查找标识符 的 时候 会 用到 作用域 链， 创建 新的 变量 的 时候 不使用它。

```js
with(o) x = 1;
```

with语句提供了一种读取o属性的快捷方式，但它并不能创建o的属性。

> David Flanagan. JavaScript权威指南（原书第6版） (Kindle Locations 2490-2491). 机械工业出版社. Kindle Edition. 

`with`会修改查询的作用域链，但是如果修改后的作用域内没有的值会按照原来的作用域来寻找：

```js
let obj = {
    name: 'xfy'
}

window.name = 'test';

function test() {
    let name = 'scope_test';
    let age = 123;
    with(obj) {
        console.log(name);
        console.log(age);
    }
}

test();
// xfy
// 123
```



## 一元运算符先后顺序

一元运算符在变量前后影响着自增（自减）的顺序。

* 一元运算符在前，在变量一元操作调用前就会进行自增（自减）操作。

* 一元运算符在后，在变量一元操作调用后才会自增（自减）操作。

```js
var n1 = 1;
++n1;               //2，已经自增
var n2 = 2;
console.log(n2);    //2，未自增
console.log(n1+ n2++);		//调用n2进行运算
console.log(n2);    //3，已自增
```

## 函数形参与实参

声明函数时定义的为形式参数：

```js
function fun(形参) {}
```

函数调用时为实际参数：

```js
fun(实参)
```

## 变量提升

js运行分为两个阶段：

1. 即时编译：语法检查，变量及函数进行声明。
2. 运行阶段：变量的赋值，代码流程运行。

```js
var a = 'xfy';
console.log(a);
```

相当于

```js
let a;
console.log(a);
a = 'xfy';
```

## let没有变量提升

```js
let a = 12;
function f(){
    console.log(a);
    let a = 123;
}
f();
//Uncaught ReferenceError: Cannot access 'a' before initialization
```

```js
let a = 12;
function f(){
    console.log(a);
    // let a = 123;
}
f();
//12
```

## 变量和函数同名

函数会优先变量声明，但是`var`不会有任何报错，再执行到`var`声明之前，调用的都是函数。这也是为什么推荐使用`let`。

```js
function a(){
    console.log('test');
}
let a = 1;
```

## 月份

Date中的getMonth月份是从0开始的。

## null和undefined

null通常表示值为空，而undefined更接近表示没有值。

将变量用完后设置为unll，可以让垃圾处理更快的释放变量。

## iterable

遍历`Array`可以采用下标循环，遍历`Map`和`Set`就无法使用下标。为了统一集合类型，ES6标准引入了新的`iterable`类型，`Array`、`Map`和`Set`都属于`iterable`类型。具有`iterable`类型的集合可以通过新的`for ... of`循环来遍历。

`for ... of`是ES6新的语法。`for ... of`在可迭代对象上创建一个迭代循环，调用自定义钩子，并为每个不同属性执行语句。

```js
let arr = [1, 2, 3];
let s = new Set([4, 5, 6]);
let m = new Map([[1, 'q'], [2, 'w'], [3, 'e']]);
let str = 'xiaofeyang';
let x;
for (x of arr) {
    console.log(x);
}
// for (x in arr) {
//     console.log(x);
// }
for (x of s) {
    console.log(x);
}
// for (x in s){
//     console.log(x);
// }
for (x of m) {
    console.log(x[0] + ' = ' + x[1]);
}
// for (x in m){
//     console.log(x);
// }
for (x of str) {
    console.log(x);
}
```

与`for...in`的区别：

* [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 语句以任意顺序迭代对象的[可枚举属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。

* `for...of` 语句遍历[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables)定义要迭代的数据。

```js
Object.prototype.objCustom = function() {}; 
Array.prototype.arrCustom = function() {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // logs 0, 1, 2, "foo"
  }
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

## 轮转时间片

* 解释性语言
* 单线程

js是单线程的，模拟多线程的操作。当有多个任务需要同时执行时，js会将多个任务分成极小时间单位的执行段，轮询在多个任务之间执行。

<hr>

## 主流浏览器


* Internet Explorer  --  trident
* Chrome  --  webkit/blink
* Firefox  --  Gecko
* Safari  --  webkit
* Opera  --  presto

## 栈(stack)和堆(heap)

基础类型保存为栈操作，先进后出。原始值不可改变

引用类型保存为堆操作。

```js
let arr = [1,2],
    arr1 = arr;
    arr = [1,3];
console.log(arr);
console.log(arr1);
```

高内聚，低偶合

## 数字字面量的方法与调用

数字字面量后接一个小数点默认是数学意义的小数点。不能直接点后接方法。

```js
1.toString();
```

可以使用如下方法调用方法：

```js
1..toString();
1 .toString();
(1).toString();
1.0.toString();
```

## 表达式

表达式会忽略函数名

```js
let test = function abc() {
    return arguments;
}
console.log(test);
// console.log(abc);
console.log(test.name);		// abc
```

## 参数映射

在传入实参时，已传入的实参会与arguments想映射，并同时变化。未传入的实参将不会相映射，不会同时变化。

```js
function test(a, b) {
    a = 1;
    console.log(arguments[0]);
    // 形参与实参有映射关系，当实参传入形参的名称时，arguments与其相对应。二者都会同时变化。
}
test(123123);

function test2(a, b) {
    b = 11;
    console.log(arguments[1]);
    // 未传入的那个实参将不会与arguments想映射。二者不会同时变化。
}
test2(123123);
```

## 执行三步

1. 语法分析
2. 预编译
3. 解释执行

由于预编译的效果，存在声明提升。

* 函数整体提升
* 变量 声明提升

## 预编译

imply global暗示全局变量：任何变量如果未经声明就赋值，此变量归全局对象所有。

一切声明的全局变量，也归window所有。

## 函数预编译过程

```js
function test(a) {
    console.log(a);
    var a = 123;
    // let a = 123;变量不会提升
    console.log(a);
    function a() {}
    console.log(a);
    let b = function() {}
    console.log(b);
}
test(1);
```

1. 创建AO对象（Activation Object，执行期上下文）

   ```js
   // 创建AO对象
   AO {
       
   }
   ```

2. 寻找形参和变量声明，将变量和形参名作为AO的属性名，值为undefined。（**变量声明提升**）

   ```js
   // 创建AO对象
   AO {
       a : undefined,
       b : undefined
   }
   ```

3. 将形参赋值为实参

   ```js
   // 创建AO对象
   AO {
       a : 1,
       b : undefined
   }
   ```

4. 寻找函数声明，赋值为函数体（**函数整体提升**）

   ```js
   // 创建AO对象
   AO {
       a : function a() {},
       b : undefined
   }
   ```

> 预编译时不会为变量赋值。

预编译结束后，执行函数。

```js
function test(a) {
    console.log(a);
    // 结果：function a() {},
    var a = 123;
    // let a = 123;变量不会提升
    console.log(a);
    // AO对象中的a被变量赋值，结果：123
    function a() {}
    console.log(a);
    // 函数声明已经被提升，结果：123
    let b = function() {}
    console.log(b);
    // b是函数表达式，刚刚被赋值为函数体。结果：function() {}
}
test(1);
```

预编译后的函数类似于这样的执行顺序：

```js
function test(a) {
    function a() {}
    console.log(a);
    // 结果：function a() {},
    a = 123;
    // let a = 123;变量不会提升
    console.log(a);
    // AO对象中的a被变量赋值，结果：123
    console.log(a);
    // 函数声明已经被提升，结果：123
    let b = function() {}
    console.log(b);
    // b是函数表达式，刚刚被赋值为函数体。结果：function() {}
}
test(1);
```

全局预编译过程和函数类似，生成了一个GO对象（Global Object）。并且少了传参这一步。

在AO与GO中有相同变量时，优先访问最近的那个。

### var/let预编译

```js
gl = 123;
function test() {
    console.log(gl);  // undefined
    gl = 333;
    console.log(gl);
    var gl = 444;
}
console.log(test());
```

使用let就不会出现这种情况

```js
gl = 123;
function test() {
    console.log(gl);  // Cannot access 'gl' before initialization
    gl = 333;
    console.log(gl);
    var gl = 444;
}
console.log(test());
```

## 连等赋值

所有的赋值都是从右到左赋值给变量的。

```js
let a = b = 123;
```

先将123赋值给变量b，再将变量b的值赋给变量a。

但是这样赋值会有一个问题，因为是连等操作。所以第二个变量并没有被let声明到。因此第二个变量将会是未经声明的变量。如果在一个函数中进行连等赋值，那么第二个变量将会是全局变量。

```js
function test() {
    let c = d = 234;
}
test();

window.c;
undefined
window.d;
234
```

> 在浏览器的执行环境中，window就是全局。

在作用域中没有声明的变量将会被添加到GO中。

## 作用域

执行期上下文：当函数运行时，会创建一个执行期上下文的内部对象（AO，Activation Object）。一个执行期上下文定义了一个函数执行时的环境。函数每次执行时对应的执行上下文是独一无二的，所以多次调用一个函数会导致创建多个执行期上下文。当函数执行完毕，它所产生的执行期上下文会被销毁。

[[scope]]：每个js函数都是一个对象，对象中有些属性可以访问，但有些不可以。这些属性仅供JavaScript引擎存取，[[scope]]就是其中一个。

[[scope]]指的就是我们所说的作用域，其中存储了执行期上下文的集合。

作用域链：[[scope]]中所存储的执行期上下文对象的集合，这个集合呈链式链接，我们把这种链式链接叫做作用域链。

```js
function a() {
    function b() {
        let b = 234;
    }
    let a = 123;
    b();
}
let glob = 100;
a();
```

在预编译时（或a函数被定义时），a函数就有了自己是属性和方法了。同时也会有了[[scope]]属性。`a.[[scope]]` 目前只存了一个第0为，也就是GO（Global Object）。

```js
{
    0 : GO
}
```

![image-20200331133634029](images/JavaScript零碎笔记/image-20200331133634029.png)

在a函数执行时，`a.[[scope]]`内第0位添加为a函数的AO。由此形成一个链式结构，在指定函数内查找变量时，从指定函数的作用域链顶端，从上（第0位）到下寻找变量。

```js
{
    0 : AO
    1 : GO
}
```

![image-20200331134656244](images/JavaScript零碎笔记/image-20200331134656244.png)

由于b函数在a的内部，所以b函数在被定义时[[scope]]内就有了A的AO。

![image-20200331135348855](images/JavaScript零碎笔记/image-20200331135348855.png)

而此时b的[[scope]]还不是完整的作用域链，当b函数执行时，将自己的AO添加到[[scope]]顶端。这时才形成了一个完整的作用域链。

![image-20200331195638452](images/JavaScript零碎笔记/image-20200331195638452.png)

在b函数种的AO是a函数的引用。因此在b函数中修改a函数的AO的值，也会将a函数内的AO修改。

```js
function a() {
    function b() {
        let bb = 123;
        aa = 3;
    }
    let aa = 333;
    b();
    console.log(aa);
}
a();	// aa = 3;
```

### 销毁

当函数执行结束后，执行上下文会被销毁。当函数执行结束后，会直接结束[[scope]]中对自身AO的引用，等到下次再需要被执行时，再引用回来。

```js
function a() {
    function b() {
        let b = 234;
    }
    let a = 123;
    b();
}
let glob = 100;
a();
```

## 闭包

### 闭包的形成

多个函数嵌套，将内部的函数返回到了外部执行。并且能够访问到外层函数的AO（引用）。

在a函数执行阶段生成了b函数，但b函数并未被执行，所以`b.[[scope]]`中有a的AO和全局的GO。而在a函数执行结束时，`return `了b函数，b函数并未被执行就被a函数返回了出来。

被返回的b函数中依然有着a函数的AO和GO。所以就算b函数在外部被执行，也能访问到a函数的内容。

```js
function a() {
    function b() {
        let bb = 234;
        console.log(aa);
    }
    let aa = 124;
    return b;
}
let glob = 100;
a()();  // demo = a(); demo();
```

> 内部函数被返回到了外部，便形成了闭包。

![image-20200401112039274](images/JavaScript零碎笔记/image-20200401112039274.png)

不适用return返回函数，直接操作外部变量来保存内部的函数。

```js
let demo;
function test() {
    let go = 100;
    function a() {
        console.log(go);
    }
    demo = a;
}
test();
demo();
```

### 赋值给变量

```js
function a() {
    let num = 100;
    function b() {
        num++;
        console.log(num);
    }
    return b;
}
```

对于num的值，如果是直接执行a函数，a函数的AO中的num不能被b函数持续修改。如果是将a函数赋值给了变量来执行b函数。那么a函数的AO可以被b函数持续修改。

因为a函数返回了b函数，所以：

将a函数赋值给变量。

```js
let demo = a();
demo();		// 执行b函数
```

在a函数执行时，也可以执行b函数。此时的执行a函数并没有销毁自身的AO，所以num的值多次无法持续修改。

```js
a()();		// 执行b函数
```

多个函数也同理：

```js
function test() {
    let num = 100;
    function a() {
        num ++;
        console.log(num);
    }
    function b() {
        num --;
        console.log(num);
    }
    return [a,b];
}
let tt = test();
tt[0]();	//101
tt[1]();	//100
test()[0]();	//101
test()[1]();	//99
```

### 闭包的危害

当内部函数保存到外部时，会形成闭包。闭包会导致原有的作用域链不被释放，造成内存泄漏。

### 缓存测试

```js
function eater() {
    let food = '';
    let obj = {
        name : 'xfy',
        eat : function () {
            console.log('im eating ' + food);
            food = '';
        },
        push : function (myFood) {
            food = myFood;
        }
    }
    return obj;
}
let wo = eater();
wo.push('小肥羊');
wo.eat();
```

obj对象中的两个方法都对eater()中的food变量进行操作。利用变量赋值函数，就能利用闭包对food变量进行操作。

### 循环数组测试

```js
function test() {
    let arr = [],
        i;
    for (i = 0; i < 10; i++) {
        arr[i] = function () {
            console.log(i);
        }
    }
    return arr;
}
let myArr = test();
```

数组随着for循环将函数赋值到自身，变量i会随着循环的增加而增加。但是函数被赋值时并没有执行，等到函数被返回后在外部被执行时，访问到的i已经是AO里的10了。

可以使用立即执行函数，让i变量成为实参传入数组的函数内，这样在外部执行时，访问的就是立即执行函数的AO。

立即执行函数在执行后会被销毁，但是它的AO依然被内部的函数所引用。所以对应次数循环的函数内j就对应立即执行函数AO中的j，且每个立即执行函数AO中的j都对应i，因为每次的立即执行函数都不同。

```js
function test() {
    let arr = [],
        i;
    for (i = 0; i < 10; i++) {
        (function (j) {
            arr[j] = function () {
                console.log(j);
            }
        }(i))
    }
    return arr;
}
let myArr = test();
myArr[0]();
```

```js
function test() {
    let arr = [],
    for (let i = 0; i < 10; i++) {
        arr[i] = function () {
            console.log(i);
        }
    }
    return arr;
}
let myArr = test();
myArr[0]();
```

## 立即执行函数

针对初始化功能的函数。在执行完后立即销毁。

```js
(function (){
    let a = 'xfy';
    let b = 'No.1';
    console.log(a + b);
}())
```

和普通函数一样，也可以传参和返回值。

```js
(function (a, b ,c){
    console.log(a + b - c + a * 2);
}(1, 2, 3))
```

```js
let re = (function (a, b) {
    let d = a + b;
    return d;  
}(1, 2))
```

### 写法

```js
(function (){}())	// 建议第一种写法
(function (){})()
```

错误语法，只有表达式才能被执行符号执行：

```js
function test() {
    let a = 'xfy';
}();
```

函数表达式可以立即执行，但是成为了立即执行表达式后，**会自动放弃函数的名称**：

```js
let xfy = function () {
    console.log('xfy');
}();
```

```js
+ function t() {
    console.log('a');
}();
```

## 逗号操作符

对它的每个操作数求值（从左到右），并返回最后一个操作数的值。

```js
let x = (3, 23);
x; // 23
```

## 对象

构造函数：满足大驼峰式命名规则（TheFirstName）

## 构造函数内部原理

```js
function Make() {
    this.name = 'xfy';
}
```

一个构造函数在生成时使用`new`操作符，此时的函数内部隐式的声明了一个对象：

```js
function Make() {
    // this = {};
    this.name = 'xfy';
}
```

有了this这个对象之后，函数内的赋值操作都被赋值到this上：

```js
function Make() {
    // this = {
    	// name : 'xfy'
	// };
    this.name = 'xfy';
}
```

最后再隐式的return this：

```js
function Make() {
    // this = {
    	// name : 'xfy'
	// };
    this.name = 'xfy';
    // return this;
}
```

总结三步：

1. 在函数体最前面隐式的添加`this = {};`;
2. 执行`this.xx = 'xx';`;
3. 隐式的返回this；

也就是说可以不使用`new`来使用一个构造函数（用普通函数返回）：

```js
function Xfy() {
    let that = {};
    that.name = 'xfy';
    that.age = 18;
    return that;
}
let xfy = Xfy();
```

不赋值给一个对象，直接返回执行的结果：

```js
new Person().say();
```

若给构造函数显示的返回了一个空对象，则显示的返回优先级高于隐式的返回结果：

```js
function Make() {
    this.name = 'xfy';
    return {};
}
```

但是如果显示的返回不是对象值，而是一个基本值，则构造函数不会收到影响：

```js
function Make() {
    this.name = 'xfy';
    return 123;  // 不受影响
}
```

## 包装类

undefined和null不能是对象，不能有属性。

对象可以有属性和方法。

原始值存在栈内存，不能有属性和方法。

当访问原始值的属性时，js会自动包装对象

```js
let str = 'xfy';
// new String(str).length;
console.log(str.length);
```

包装对象在执行完后会立即删除，不会保存任何属性。

```js
let num = 99;
// new Number(num).xfy = 'xfy';  --> deleted
num.xfy = 'xfy';
// num Number(num).xfy; --> undefined
console.log(num.xfy)
```

## 原型

原型是function对象的一个属性，它定义了构造函数制造出的对象的公共祖先。通过该构造函数生产的对象，可以继承该原型的属性和方法。原型也是对象。

当原型中与自身的属性/方法重名时，优先使用自身定义的属性：

```js
Person.prototype.xfy = 'xfy'
function Person() {
    this.xfy = 'notXfy';
}
let person = new Person();
```

原型链起来的方式：

```js
function Person() {
    // let this = {
    	__proto__: Person.prototype
	}
}
```

```js
function Person() {

} // 函数
Person.prototype = {

} // 函数的对象：原型
let p = new Person(); // 构造函数创建对象
p.__proto__ = Person.prototype; // 对象的原型链继承自函数的原型
Person.prototype.__proto__ = Object.prototype; // 函数自身的prototype对象也继承自Object.prototype
```

### 原型的应用

在适用构造函数时，可能有多数不变的属性。放在构造函数内则每次使用时都会调用一次重复的代码运行。如果将其放到函数的原型中，则只需要执行一次相同的代码。每个构造函数构造出的对象将同样包含。

```js
function CarMake(owner, color) {
    this.name = 'Merceds';
    this.height = '1400';
    this.weight = '2t';
    this.color = color;
    this.owner = owner;
}
let car1 = new CarMake('xfy', 'pink');
```

优化：

```js
CarMake.prototype.name = 'Merceds';
CarMake.prototype.height = '1400';
CarMake.prototype.weight = '2t';
function CarMake(owner, color) {
    this.color = color;
    this.owner = owner;
}
let car1 = new CarMake('xfy', 'pink');
```

> 利用原型的特点和概念，可以提取共有属性。

### 增删改查都不可以

对象中有与原型内同名的属性时，修改的是对象内的属性。直接操作对象无法修改原型内的属性。

删除时会返回`true`

### 返回构造函数

`constructor`会返回构造该对象的构造函数

```js
xfy.constructor
function Person()
```

`constructor`来自构造函数的`prototype`中。可以手动修改。

```js
function Car() {

}
Person.prototype = {
    constructor : Car
}
function Person() {
    this.name = 'xfy';
}
let xfy = new Person();
```

### 修改原型

构造函数第一步时，就会将函数的原型赋值给对象。

```js
function Person() {
    let this = {
        __proto__ : Person.prototype
    }
    this.name = 'xfy';
}
```

继承来的原型时可以被修改的：

```js
function Car() {

}
Person.prototype = {
    constructor : Car,
    age : 18
}
function Person() {
    this.name = 'xfy';
}
let person = new Person();
// 此时的person.age还是Person的18，包括constructor都是Person定义的。
let obj = {
    age : 81
}
person.__proto__ = obj;
// 将__proto__修改为指定的函数后，此时的person.age就已经被修改为81了。包括constructor也被修改为Object()。
```

包括继承来的prototype也可以被修改：

```js
Person.prototype = {
    age : 18
}
function Person() {
    this.name = 'xfy';
}
let person = new Person();
// 此时的age为18
Person.prototype.age = 81;
// 此时就被修改为81
```

直接换对象不生效，因为`__proto__`的引用是没有更换的。

```js
Person.prototype = {
    age : 18
}
function Person() {
    this.name = 'xfy';
}
let person = new Person();
// 此时的age为18
Person.prototype = {
    age : 81;
}
// 此时就不会被修改，因为__proto__还是指向修改之前的引用。
```

这样是可以被修改的，因为修改时对象还没有被new

```js
Person.prototype.age = 18;
function Person() {
    this.name = 'xfy';
}
Person.prototype = {
    age : 81;
}
let person = new Person();
```

## 原型链

```js
Grand.prototype = {
    lastName : '小'
}
function Grand() {

}
let grand = new Grand();

Father.prototype = grand;
function Father() {
    this.name = '肥羊';
}
let father = new Father();

Son.prototype = father;
function Son() {
    this.age = 18;
}
let son =  new Son();
```

增、删原型链的父代都需要自身操作。修改在某种情况下可以去修改父代属性。

```js
Grand.prototype = {
    lastName : '小'
}
function Grand() {

}
let grand = new Grand();

Father.prototype = grand;
function Father() {
    this.name = '肥羊';
    this.money = {
        card1 : 'visa'
    }
}
let father = new Father();

Son.prototype = father;
function Son() {
    this.age = 18;
}
let son =  new Son();
son.money.card2 = 'masterCard'
// 调用了父代的引用值。
```

### Object.create()

将一个对象或者函数的属性作为参数，继承给一个新对象的属性。

```js
let obj = {
    name : 'xfy',
    age : 18
}
let obj1 = Object.create(obj);
```

```
let obj = Object.create(原型);
```

使用构造函数同理：

```js
function Person() {

}
Person.prototype = {
    name: 'xfy'
}
let obj = Object.create(Person.prototype);
```

使用`Object.create()`可以创建出一个没有原型的对象。

```js
let obj = Object.create(null);
```

> 大多数对象的原型都继承自Object.prototype

原型是一个隐式的内部属性，给没有原型的对象手动添加是不起作用的。可以添加上，但是并不能访问。（原始值不能作为参数）

![image-20200427212659150](images/JavaScript零碎笔记/image-20200427212659150.png)

> null和undefined是原始值，不能被包装，没有原型。

### 重写

原型上有一个方法，对象自身又有一个同名不同功能的方法，这种情况称为重写。

```js
Object.prototype.toString() = function () { }
Number.prototype.__proto__ = Object.prototype;
Number.prototype.toString() = function () { }
```

```js
Person.prototype = {
    toString: function () {
        return 'test';
    }
}
function Person () {
    name = 'xfy';
}
let p = new Person();
```

> document.write()就会隐式调用toString()方法。

## 计算范围

小数点前16位和后16位。

## call/apply

this的指向性会有几种情况：

1. 预编译`this -> window`；
2. 指向调用对象；
3. call apply
4. 全局`this -> window`；

最简单理解call/apply：

```js
function test() {
    console.log(this);
}
// 默认执行应该是走预编译环节，this指向window
test();
test.call();
let obj = {
    name: 'xfy';
}
// 改变的函数内this的指向为参数的对象
test.call(obj);  // console.log(obj);
```

```js
var name = 'global';
let obj = {
    name: 'xfy',
    say: function () {
        console.log(this.name);
    }
}
obj.say();
obj.say.call(window);
```



### call

call/apply基本作用就是修改this指向。

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
let p = new Person('test', 18);
let obj = {

}
Person.call(obj, 'xfy', 18);
```

函数执行时，就会调用call。

```js
Person() == Person.call()
```

this默认指向winodw，在调用call时，会改变this指向为第一个参数对象。后面的参数为实参。

```js
Person.call(obj, 'xfy', 18);
function Person(name, age) {
    // this = obj
    obj.name = name;
    obj.age = age;
}
```

```js
function Person(name, age, tel) {
    this.name = name;
    this.age = age;
    this.tel = tel;
}
// let p = new Person('xfy', 18, 110);
function Student(name, age, tel, grade, sex) {
    Person.call(this, name, age, tel)
    this.grade = grade;
    this.sex = sex;
}
let s = new Student('xfy', 18, 120, 1, 'female');
```

> 借用其他函数，实现本函数的功能。

### 区别

* call把实参按照形参的个数传进去

* apply需要将参数传为一个arguments

## 继承

1. 传统形式，原型链

```js
Grand.prototype = {
    lastName: 'xfy'
}
function Grand() {

}
let gr = new Grand();

Father.prototype = gr;
function Father() {

}
let fa = new Father();

Son.prototype = fa;
function Son() {

}
let so = new Son();
```

2. 借用构造函数

```js
function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
}
function Student(name, age, sex, grade) {
    Person.call(this, name, age, sex);
    this.grade = grade;
}
let stu = new Student('xfy', 18, 'female', '二年级')
```

这种方法会调用多次函数。

3. 公有原型

```js
// 共享属性
Father.prototype.name = 'xfy';
function Father() {

}

function Son() {

}
// Son.prototype = Father.prototype;
function inherit(Target, Origin) {
    Target.prototype = Origin.prototype;
}
inherit(Son, Father);

let so = new Son();
let fa = new Father();
```

缺点：

```js
// 因为是引用值，所以Son在原型中添加值时，Father也会被添加值。
Son.prototype.sex = 'male';
```

可以添加中间层过渡

```js
// 共享属性
Father.prototype.name = 'xfy';
function Father() {

}

function Son() {

}
// Son.prototype = Father.prototype;
function inherit(Target, Origin) {
    Target.prototype = Origin.prototype;
}
inherit(Son, Father);
// 因为是引用值，所以Son在原型中添加值时，Father也会被添加值。
// 添加中间层，过渡继承Father的原型。
function F() {

}
inherit(F, Father);
Son.prototype = new F();
Son.prototype.sex = 'male';

let so = new Son();
let fa = new Father();
```

```js
Father.prototype.name = 'xfy';
function Father() {

}

function Son() {

}
function inherit(Target, Origin) {
    function I() { };
    I.prototype = Origin.prototype;
    Target.prototype = new I();
}
inherit(Son, Father);
```

此时的son对象虽然是从Son构造函数构造出来的，但是它的constructor指向的是Father构造函数。

```js
son.__proto__ --> new I().__proto__ --> Father.prototype
```

4. 圣杯模式

使函数可以正确的找到自己的constructor，并且指明了超类（真正继承的原型函数）。

```js
Father.prototype.name = 'xfy';
function Father() {

}

function Son() {

}
function inherit(Target, Origin) {
    function I() { };
    I.prototype = Origin.prototype;
    Target.prototype = new I();
    Target.prototype.constructor = Target;
    Target.prototype.uber = Origin.prototype;
}
inherit(Son, Father);
let son = new Son();
let father = new Father();
// son.constructor = Father();
// son.__proto__ --> new I().__proto__ --> Father.prototype
```

## 私有化变量

闭包的另一种应用，在构造函数上的应用。

在使用构造函数构造对象时，属性中的函数会向闭包一样返回为对象的功能，因为闭包的特征，所以构造函数中AO中的变量能被属性内的函数保存和读取。

而构造函数中创建的变量不能使用通常的方法被对象直接访问，只有对象调用指定的方法才能访问。

```js
function Xfy(name, consoled) {
    let anotherConsole = 'ps4';
    this.name = name;
    this.consoled = consoled;
    this.changeConsole = function () {
        this.console = anotherConsole;
    }
    this.buyConsole = function (target) {
        anotherConsole = target;
    }
    this.sayTrueth = function () {
        console.log(anotherConsole);
    }
}
let xfy = new Xfy('xfy', 'xbox');
```

> console.log中的console也是关键字，和变量等不能重名……

## 方法连续调用

```js
let xfy = {
    ps: function () {
        console.log('turn on the ps4');
        return this;
    },
    xbox: function () {
        console.log('turn off the xbox');
        return this;
    },
    nintendo: function () {
        console.log('but the nintendo');
        return this;
    }
}
xfy.ps().xbox().nintendo().ps().ps().ps().ps().xbox();
```

默认情况下一个对象的方法不能连续调用是因为一个函数执行完了默认隐式的返回undefined。语句会从左往右执行，第一个函数执行完了之后就会被返回值所代替。所以导致了对象中的函数不能连续执行。

```js
xfy.ps().xbox()  -->  undefined.xbox()
```

## 对象的枚举

### for...in循环

forin中的prop为变量，语句会将变量变为对象中属性的名称，循环遍历。

```js
let obj = {
    name: 'xfy',
    age: 18,
    sex: 'female',
    num: 133
}
for (let prop in obj) {
    console.log(obj[prop]);
}
```

在for-in中不能使用点表示法，在使用点表示法的时候，将不会被识别为变量，而是字符串。则会导致obj去访问这个属性。

```js
obj.prop  -->  obj['prop']
```

### hasOwnProperty

hasOwnProperty用于循环枚举对象自身的属性，不会访问继承来的属性。for...in会将对象所有的属性都循环打印

```js
let obj = {
    name: 'xfy',
    age: 18,
    sex: 'female',
    num: 133,
    __proto__: {
        test: 'woshixiaofeiyang'
    }
}
for (let prop in obj) {
    if(obj.hasOwnProperty(prop)) continue;
    //     console.log(obj[prop]);
    // }
    console.log(obj[prop]);
}
```

### in

in只用于这个属性能否被这个对象调用，无论是自身还是继承来的属性，都是true

```js
console.log('age' in obj);  //true
```

### instanceof

instanceof用于检测该对象的原型链中有没有该函数的原型

```js
function Person() {

}
Person.prototype = {
    name: 'xfy',
    age: '18'
}
function Professior() {
    this.sex = 'female';
}
function inherit(Target, Origin) {
    function T() { };
    T.prototype = Origin.prototype;
    Target.prototype = new T();
    // Target.prototype.constructor = Target;
}
inherit(Professior, Person);
let obj = new Professior();
console.log(obj.constructor);
console.log(obj instanceof Professior);
```

## 执行函数

不改变this的指向使用apply和call来执行函数，就和普通的直接执行函数没有区别。传入null

```js
function foo() {
    bar.apply(null, arguments);
    // 同等于 bar(arguments);
}
function bar(x) {
    console.log(arguments);
}
foo(1, 2, 3, 4, 5)
```

## typeof

```js
String Number Object undefined null Function
```

## 引用值比对

引用值比对的是内存中的地址。

## this

1. 函数预编译this --> window
2. 全局作用域this --> window
3. apply/call可以改变函数允许时的this指向
4. obj.func()对象中的函数this指向调用时的对象

```js
global.name = 222;  // 全局
let a = {
    name: 111,
    say: function () {
        console.log(this.name);
    }
};
a.say();    // 谁调用this就指向谁
let fun = a.say;    // a.say这个函数体被赋值给fun
fun();  // fun仅仅只是执行了a.say这个函数体，所以this指向window/global

let b = {
    name: 333,
    say: function (f) {
        // b.say: this --> b
        f();
    }
};
b.say(a.say);  // a.say这个函数体被当参数传入，所以也仅仅只是执行了函数体，和fun()同理
b.say = a.say;  // a.say这个函数体被传入b的属性
b.say()  // 所以b.say也只是执行a.say这个函数体，this指向b
```

在对象字面量里使用`this`

```js
function makeUser() {
  return {
    name: "John",
    ref: this
  };
}

let user = makeUser();

alert( user.ref.name );
```

因为`this`的特性，这里的`this`在函数运行时就计算为`window`对象了（非严格模式）。

## callee

callee是函数参数的属性，它的作用是指向这个函数的引用(函数自身)。

```js
function  test() {
    console.log(arguments.callee == test);
}
test();
```

### 作用

在需要使用到匿名的函数名时可以使用callee来引用这个函数。

```js
let num = (function (x) {
    if (x == 1) {
        return 1;
    }
    return x * arguments.callee(x - 1);
}(5))
console.log(num);
```

## caller

caller是函数的属性。打印调用该函数的函数

```js
function test() {
    console.log(arguments.callee);
    function adc() {
        console.log(arguments.callee);
        console.log(adc.caller);
    }
    adc();
}
test();
```

> 在严格模式下无法使用callee和caller。

## 深克隆

基本值按值传递

引用值传递引用的地址

1. 判断属性是基本值还是引用值
2. 创建空的引用值
3. 循环赋值

## 数组

不可以溢出读，但不会返回错误，结果是`undefined`。

可以溢出写，数组长度直接到溢出写的那一位。

```js
let arr = [];
console.log(arr.length);    // 0
arr[12] = 'xfy';
console.log(arr.length);    // 13
```

## 数组方法

es3.0

**改变原数组**

### push

push是在数组的最后一位添加参数。

重写：

```js
Array.prototype.xfyPush = function (x) {
    for (let i = 0; i < arguments.length; i++) {
        this[this.length] = arguments[i];
        this.length++;
    }
    return '嘤嘤嘤';
}
```

### pop

直接用于数组的pop方法用于删除数组的最后一位。

```js
let arr = [1, 2, 3, 1];
arr.pop();	// return 1
```

并且将删除的最后一位返回。可以用作剪切。

```js
let arr = [1, 2, 3, 1];
let num = arr.pop();
console.log(num);	// 1
```

pop不用传任何参数，且无视参数传递。

重写：

```js
let arr = [1, 2, 3, 1];
Array.prototype.pop = function () {
    let num = this[this.length - 1];
    this.length = this.length - 1;
    return num;
}
console.log(arr.pop());
console.log(arr);
```

### unshift

从数组头部添加参数，返回添加的长度。

```js
let arr = [1, 2, 3, 1];
arr.unshift(9, 9 ,8);
console.log(arr)
```

重写：

```js
let arr = [1, 2, 3, 1];
Array.prototype.unshift = function () {
    let arr = [];	
    arr = arguments;	// 形参赋值给新数组
    let count = arr.length;
    let thisLen = this.length;
    for (let i = 0; i < thisLen; i++) {
        arr[count] = this[i];	// 将数组传给参数
        count++;
    }
    for (x in arr) {
        this[x] = arr[x]	// 再将整个数组传回去
    }
    return arr.length;
}
arr.unshift(9, 9 ,8);
console.log(arr);
```

### shift

从数组头部删除参数，返回被删除的那个数。不接受参数。

```js
let arr = [1, 2, 3, 1];
arr.shift();
console.log(arr);	// [2, 3, 1]
```

重写：

```js
let arr = [1, 2, 3, 1];
Array.prototype.shift = function () {
    let arr = [];
    let _arr = this[0];
    let len = this.length;
    for (let i = 1; i < len; i++) {
        arr[i - 1] = this[i];
    }
    this.length = arr.length;
    for (x in arr) {
        this[x] = arr[x];
    }
    return _arr;
}
arr.shift();
console.log(arr);
```

### reverse

`reverse()` 方法将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。

```js
let x = [1, 2, 3, 4];
x.reverse();	// [ 4, 3, 2, 1 ]
```



### splice

通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。

参数：

start：指定修改的开始位置（从0计数）。负数表示倒数。

deleteCount：整数，表示要移除的数组元素的个数。

itemN：从start位置开始要往数组里添加的内容。不指定则指删除数组内容。

```js
let arr = [1, 2, 3, 1];
arr.splice(0, arr.length);
console.log(arr);
```

负数的实现：

```js
Array.prototype.splice = function (posi) {
    posi += posi > 0 ? 0 : this.length;	// 如果参数为负数，侧和数组长度相加，实现倒数。
}
```

### sort

sort方法用[原地算法](https://en.wikipedia.org/wiki/In-place_algorithm)对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的。

```js
let arr = ['x', 'z', 'a', 'd', 'y', 'f'];
arr.sort();
console.log(arr);
```

sort可以传递一个`compareFunction`的比较函数参数，如果没有这个参数，那么元素会按照转换为的字符串的诸个字符的Unicode位点进行排序。就会出现10排在2前面的情况。

`compareFunction`也非常简单，`sort()`接受它的返回值。

`compareFunction(a, b)`：

1. 如果返回值为小于0，那么a会排到b前面。
2. 如果返回值大于0，那么b会排到a前面。
3. 如果等于0，则保持不动。

可以写详细点的`if`语句，也可以直接拿`a - b`得到同样的效果。

```js
let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
arr.sort((a, b) => a - b);
console.log(arr);
```

那么同理`b - a`就能得到**降序**的排序效果。

**不改变原数组**

### concat

连接两个数组，返回一个新的数组。

```js
let x = [1, 2, 3, 4];
let f = [5, 6, 7, 8, 9];
let y = x.concat(f);
```

### slice

与`splice()`不同，`slice()`不改变原数组，且接受两个参数：

begin：提取起始处的索引（从 `0` 开始），从该索引开始提取原数组元素。

end：提取终止处的索引（从 `0` 开始），在该索引处结束提取原数组元素。`slice` 会提取原数组中索引从 `begin` 到 `end` 的所有元素（包含 `begin`，但不包含 `end`）。

```js
let x = [1, 2, 3, 4];
x.slice(0,1)	// 1
```

不传参数将截取整个数组。

### join

`join()` 方法将一个数组（或一个[类数组对象](https://developer.mozilla.org/zh-CN//docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。

```js
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// expected output: "Fire,Air,Water"

console.log(elements.join(''));
// expected output: "FireAirWater"

console.log(elements.join('-'));
// expected output: "Fire-Air-Water"
```

###  split

split与join相反，`split() `方法使用指定的分隔符字符串将一个[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。 

```js
const str = 'The quick brown fox jumps over the lazy dog.';

const words = str.split(' ');
console.log(words);		// ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog."]
```

## 栈内存

原始值存储在栈内

## 类数组

类似数组，但却不是数组，也没有数组方法。

1. 属性要为索引（数字）属性，从0开始。
2. 必须有length属性（必须和索引长度相同）
3. 最好加上push方法
4. 加上splice方法后在console中看到就会和数组一样（2020-07-14未实现）

```js
let obj = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    'length': 3,
    'push': Array.prototype.push,
    'splice': Array.prototype.splice
}
```

### 特殊性

因为数组`push()`方法是根据`length`来添加属性的，所以类数组的索引如果不从0开始会产生不一样的结果。

因为`obj.length = 2`所以`push()`方法会直接修改索引为2的属性。

```js
let obj = {
    '1': 'b',
    '2': 'c',
    'length': 2,
    'push': Array.prototype.push,
    'splice': Array.prototype.splice
}
obj.push('d');
// Object { 1: "b", 2: "d", length: 3, push: push() }
```

### 应用

既可以当作数组来使用，也可以当作对象来使用。

```js
let obj = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    'length': 3,
    name: 'xfy',
    age: 18,
    'push': Array.prototype.push,
    'splice': Array.prototype.splice
}
```

> 在后期的DOM生成的数组全是类数组。

## 随机数

利用`random()`方法可以很简单的得到一个大于等于0小于1的随机数。利用一套公式就可以得出一个范围之间的随机数。

```js
值 = Math.floor(Math.random() * 可能值的总数 + 第一个可能的值);
```

例如，需要取一个2-10之间的随机数：

```js
let roll = Math.floor(Math.random() * 9 + 2);
```

从2数到10总共有9个数，当数值更大时，可以使用另个公式来确定可能值的总数：

```js
可能值的总数 = 最大的值 - 最小的值 + 1
```

当然可以将两个公式组合在一起

```js
let roll = Math.floor(Math.random() * (10 - 2) + 2);
```

或者：

```js
function roll(minValue, maxValue) {
    let choices = (maxValue - minValue + 1);
    return Math.floor(Math.random() * choices + minValue);
}
```

> 记录自《Professional JavaScript for Web Developers 3rd Edition》第 5.7.2 Math对象。

## try...catch

try内的代码按正常顺序执行，到遇到错误时，不抛出错误，也不终止代码的运行。

catch会将try内遇到的错误信息捕捉到

Catch捕捉到的Error对象：

![image-20201201114430208](images/JavaScript%E9%9B%B6%E7%A2%8E%E7%AC%94%E8%AE%B0/image-20201201114430208.png)

`error.name`对应的六种值信息：

1. EvalError：`eval()`的使用与定义不一致；
2. RangeError：数值越界；
3. ReferenceError：非法或不能识别的引用数值；
   * 通常是未定义就使用变量/函数
4. SyntaxError：发生语法解析错误；
5. TypeError：操作类型错误；
6. URIError：URI处理函数使用不当；

Catch捕捉的是try内抛出的内容，使用`throw`手动来抛出一个信息，catch也能捕捉。

```js
try {
    throw 'xfy'
} catch(e) {
    debugger;
    console.log(e);
}
```

![image-20201201115114508](images/JavaScript%E9%9B%B6%E7%A2%8E%E7%AC%94%E8%AE%B0/image-20201201115114508.png)

## 严格模式

现在的浏览器是基于es3.0的方法 + es5.0的新增方法来执行js的。当遇到es3.0与5.0冲突的时候，使用严格模式`use strict`来解决冲突。

使用严格模式会将冲突的部分使用es5.0来执行。

使用方法：

* 在页面逻辑最顶端使用`'use strict'`；
* 在函数内最顶端使用`'use strict'`；

严格模式不支持：

* with
  * with会修改作用域链，导致整个程序变得更加复杂，乃至更加缓慢。

其他规定：

* 变量赋值前必须被声明；
* 预编译this必须被赋值，否则是undefined。

```js
function test () {
    'use strict';
    console.log(this);
}

test.call({});
```

es3.0中的this值不能修改为原始值，会触发包装对象

```js
function test () {
    // 'use strict';
    console.log(this);
}

test.call(123);
// Number {123}
```

严格模式下可以修改为原始值

```js
function test () {
    'use strict';
    console.log(this);
}

test.call(123);
// 123
```

## DOM

DOM(Document Object Model)，DOM 定义了表示和修改文档所需的方法。DOM 对象即为宿主对象，由浏览器厂商定义，用来操作 html 和 xml 功能的一类对象的集合。也有人称 DOM 是对 HTML 以及 XML 的标准编程接口。

### document

`document`代表整个文档。

### querySelector

`querySelector`选择的 DOM 是静态的

`getElementByTagName`选择的 DOM 是动态的：

```js
    // let div = document.querySelectorAll('div');
    let div = document.getElementsByTagName('div');
    let demo = div[0];
    
    // 删除一个div
    // demo.remove();
    // 删除后再生成一个div，选中的标签会实时的变化。
    // document.body.appendChild(document.createElement('div'));
```

### 节点树

文档以树形方式呈现

### 节点类型

`parentNode`

`childNoe`：子节点会捕捉到多个节点类型

* 元素节点 - 1
* 属性节点 - 2
* 文本节点 - 3
* 注释节点 - 8
* document - 9
* Document.fragment - 11

### 遍历元素节点树

`parentElement`：元素父节点

`children`：元素子节点

## 结构树

Document.prototype --> HTMLDocument.prototype --> document

## DOM 基本操作

1. `getElementById`方法定义在`Document.prototype`上，即 Element 节点上不能使用。
2. `getElementByName`方法定义在`HTMLDocument.prototype`上，即非 HTML 中的 document 不能使用（xml document, Element）。
3. `getElementByTagName`方法定义在`Document.prototype`和`Element.prototype`上。
4. `HTMLDocument.prototype`定义了一些常用的属性，body, head 分别指代 HTML 文档中的`<body>, <head>`标签。
5. `Document.prototype`上定义了`documentElement`属性，指代文档的根元素，在 HTML 文档中，它总是指代`<html>`元素。
6. `getElementByClassName`、`querySelector`、`querySelectorAll`在`Document.prototype`、`Element.prototype`中均有定义。

### 增加

JavaScript 可以创建各种 DOM 元素：

* `document.createElement()`
* `document.createTextNode()`
* `document.createComment()`
* `document.createDocumentFragment()`

### 插入

* `ParentNode.append()`
* `Node.appendChild()`
* `ParentNode.insertBefor(a, b)`

文档中已经存在的元素被使用`appendChild()`时，是剪切操作：

```js
        let body = document.body;
        let div = document.createElement('div');
        let text = document.createTextNode('小肥羊');
        let comment = document.createComment('xiaofeiyang');

        body.appendChild(div);
        body.appendChild(text);
        
		div.appednChild(text); // 剪切文本
```

`append()`与`appendChild()`差异：

- `ParentNode.append()`允许追加 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 对象，而` Node.appendChild()` 只接受 [`Node`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node) 对象。
- `ParentNode.append()` [没有返回值](https://repl.it/FgPh/1)，而 `Node.appendChild()` 返回追加的 [`Node`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node) 对象。
- `ParentNode.append()` 可以追加多个节点和字符串，而 `Node.appendChild()` 只能追加一个节点。

`ParentNode.insertBefor(a, b)`：插入（insert）a 标签，在 b 标签之前（before）。

### 删除

* `parent.removeChild()`
* `child.remove()`

### 替换

`parent.replaceChild(new, origin)`

### Element 节点的一些属性

* `innerHTML`：直接修改节点内的 HTML 属性
* `innerText`：取出节点内的 Text 属性，会取出所有子元素的文本。赋值时会覆盖所有的子元素。
* `textContent`：与`innerText`一样。

### Element 节点的一些方法

* `Element.setAttribute()`
* `Element.getAttribute()`

## 日期对象

`new Date()`

纪元年 1970-01-01

