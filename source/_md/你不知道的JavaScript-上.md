# 上卷

## 编译原理

尽管 JavaScript 经常被归类为“动态”或“解释执行”的语言，但实际上它是一门编译语言。JavaScript 引擎进行的编译步骤和传统编译语言非常相似，但有些地方可能比预想的要复杂。

传统编译流程：

* 分词/此法分析（Tokenizing/Lexing）

  这个过程会将有字符组成的字符串分解成（对编程语言来说）有意义的代码块，这些代码块被称为词法单元（token）。例如：`var a = 2`；这段程序通常会被分解成词法单元：`var`、`a`、`=`、`2`；空格是否会被当成词法单元，取决于空格在这门语言种是否具有意义。

* 解析/语法分析（Parsing）

  这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法的树。这个树被称为“抽象语法树”（Abstract Syntax Tree，AST）。

  `var a = 2`的 AST 为：

  ```
  VariableDeclaration
  --Identifier = a
  --AssignmentExpression
  ----NumericLiteral = 2
  ```

* 代码生成

  将 AST 转换为可执行代码的过程被称为代码生成。这个过程与语言、目标平台等息息相关。简单来说就是将 AST 转换为一组机器指令，用来创建一个叫做 a 的变量（包括分配内存等），并将值 2 存储在 a 中。

## JavaScript 的编译

JavaScript 的编译由 JavaScript 引擎来负责（包括执行）。编译通常由三个部分组成：

* 引擎：从头到尾负责整个 JavaScript 的编译以及执行；
* 编译器：负责语法分析以及代码生成；
* 作用域：负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

在我们看来`var a = 2`；这是一个普通的变量声明。而在 JavaScript 引擎看来这里有两个完全不同的声明：

1. `var a`，编译器会寻找当前作用域中是否有同样的声明。如果有，则忽略该声明，并继续编译；否则它会在当前作用域（全局/函数作用域）的集合中声明一个新的变量，并命名为 a。
2. 接下来编译器会为引擎生成运行时所需的代码，这些代码用来处理赋值（`a = 2`）操作。引擎会在当前作用域中查找变量 a。如果能找到，则为其赋值；如果找不到，则继续向上查找（作用域链）。

由于编译的第一步操作会寻找所有的`var`关键词声明，无论它在代码的什么位置，都会声明好。在代码真正运行时，所有声明都已经声明好了，哪怕它是在其他操作的下面，都可以直接进行。这就是`var`关键词的声明提升。

```js
a = 2;
console.log(a);
var a;
```

### LHS 和 RHS

编译器在编译过程的第二步生成了代码，引擎执行它时，就会查找变量 a 来判断它是否已经声明过。但引擎如何进行查找，影响最终查找的结果。

LHS 和 RHS 分别对应的是左侧查找与右侧查找。左右两侧分别代表**一个赋值操作的左侧和右侧**。也就说，当变量出现在赋值操作的左侧时进行 LHS 查询，出现在右侧时进行 RHS 查询。

例如：`a = 2`，这里进行的就是 LHS 查询。这里不关心 a 的当前值，只想找到 a 并为其赋一个值。

而：`console.log(a)`，这里进行的是 RHS 查询。因为这里需要取到 a 的值，而不是为其赋值。

“赋值操作的左侧和右侧”并不一定代表就是`=`的左右两侧，赋值操作还有其他多种形式。因此，可以在概念上理解为“查询被赋值的目标（LHS）”以及”查询目标的值（RHS）“。

小测验：

寻找 LHS 查询（3处）以及 RHS 查询（4处）。

```js
function foo(a) {
  var b = a;
  return a + b;
}
var c = foo(2);
```

LHS：

* `var c = foo(...)`：为变量 c 赋值
* `foo(2)`：传递参数时，为形参 a 赋值 2
* `var b = a`：为变量 b 赋值

RHS：

* `var c = foo(...)`：查询`foo()`
* `var b = a`：（为变量 b 赋值时）取得 a 的值
* `return a + b`：取得 a 与 b（两次）

## 异常

通过详细的了解异常可以准确的确定发生的问题所在。

在 LHS 查询时，如果到作用域顶部还没有查询到声明，则作用域会热心的帮我们（隐式）创建一个全局变量（非严格模式下）。

而在 RHS 查询时，如果在作用域顶部还没有查询到声明，就会抛出一个 ReferenceError 异常。

在严格模式下，LHS 如果没有找到声明，引擎会抛出一个和 RHS 类似的 ReferenceError 异常。

无论是 LHS 还是 RHS 都是查询一个引用，而没有查询到对应的引用时，就会得到（引用）ReferenceError 异常。

接下来，如果 RHS 查询到了一个变量，但是我们尝试对这个变量的值进行不合理的操作。例如对一个非函数进行函数调用，或者对对象中不存在的属性进行引用。那么引擎会抛出另外一个异常，叫做 TypeError。

## 闭包

闭包是基于词法作用域书写代码时所产生的自然结果。闭包的主要定义：

当函数可以记住并访问**所在的**词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

> JavaScript 使用的是词法作用域模型，另一种作用域模型是动态作用域。

仔细来看，闭包的主要定义有：

* 函数记住并可以访问所在的词法作用域
* 在当前词法作用域之外执行也能继续访问所在的词法作用域

来看一个例子：

```ts
function foo() {
  const a = 123;

  function bar() {
    console.log(a);
  }

  bar();
}
foo();
```

这段代码看起来好像符合闭包的一部分定义，虽然`bar()`函数并没有脱离当前的词法作用域执行。但是它依然记住了`foo()`的词法作用域，并能访问。

它确实满足闭包定义的一部分（很重要的一部分），从技术上讲，也许是，但并不能完全断定这就是闭包。通常我们所见到的与认为闭包的情况就是满足所有定义的时候：

```ts
function foo() {
  const a = 321;

  function bar() {
    console.log(a);
  }

  return bar;
}
// 同理
// foo()();
const baz = foo()
baz();
```

因为垃圾收集机制，当一个函数执行结束后，通常它的整个内部作用域会被销毁。当我们的`foo()`函数执行结束后，看上去它的内容不会再被使用，所以很自然的考虑会被回收。

但闭包的神奇之处就在这里，它会阻止这一切的发生。当`bar`被`return`出去之后，在其词法作用域的外部依然能够访问`foo()`的内部作用域。`bar`依然持有对该作用域的引用，这个引用就叫作闭包。

这也是经常见到说闭包会影响性能的主要原因。某些情况下，它确实会影响到性能，例如过度多的返回本不需要的函数，甚至是嵌套。这会导致本不需要的作用域没有被回收。

### 常见的闭包

上述将一个函数`return`出来的案例是最常见的闭包案例。但在我们的代码中，也有些其他非常常见的闭包。不过平时可能没有太过去注意它。

先来回顾一下定义：

无论通过何种手段将内部函数传递到词法作用域之外，它都会保留对改内部词法作用域的引用，无论在何处执行这个函数都会使其闭包。

```ts
function waitAMinute(msg: string) {
  setTimeout(() => {
    console.log(msg);
  }, 1000);
}
waitAMinute('嘤嘤嘤');
```

```ts
function btnClick(selector: string, msg: string) {
  $(selector).click(() => {
    alert(msg);
  });
}
btnClick('#btn_1', 'hah');
btnClick('#btn_2', 'got you');
```

## this 全面解析

this 和动态作用域有些许类似，他们都是在执行时决定的。this 是在调用时被绑定的，完全取决于函数的调用位置。

### 确定调用位置

当一个函数被调用是，会创建一个活动记录（执行期上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this 就是这个记录里的一个属性。

调用位置就是函数在代码中被调用的位置，而不是声明的位置。可以类似于这样来这个记录并分析出函数的真正调用位置。

```ts
function foo() {
  // 当前调用栈：foo

  console.log('foo');
  bar();
}
function bar() {
  // 当前调用栈：foo --> bar

  console.log('bar');
  baz();
}
function baz() {
  // 当前调用栈：foo --> bar --> baz

  console.log('baz');
}
foo();
```

### 绑定规则

this 是在运行时动态绑定的，所以在不同的情况下，this 可能会发生各种意料之外的情况。

#### 默认绑定

当函数在全局环境下独立调用时，this 会指向为全局对象。

```ts
var a = 123;
function foo() {
  console.log(this.a); // 123
}
```

而当函数处理严格模式下，则不能将全局对象用于默认绑定，因此 this 会绑定到`undefined`

```ts
var a = 123;
function foo() {
  "use strict"
  console.log(this.a); // TypeError: this is undefined
}
```

还有一个微妙的细节，虽然 this 的绑定完全取决于调用的位置，但是只有`foo()`函数本身处于非严格模式才能绑定到全局对象。如果只是函数执行时所在严格模式下，而本身是非严格模式，则不影响默认绑定规则。

```ts
var a = 123;

function foo() {
  console.log(this.a);
}

(() => {
  'use strict';
  foo();
})();
```

> 通常来说不推荐在代码中混用严格模式与非严格模式。

#### 隐式绑定

另外一种规则是考虑调用位置是否有上下文对象，或者说某个对象是否包含这个函数。

```ts
function foo(this: typeof obj) {
  console.log(this.name);
}
const obj = {
  name: 'xfy',
  foo: foo
};
obj.foo() // xfy
```

这种方法可以理解为将`foo()`的函数体赋值给了对象 obj 的一个属性，而执行时是从 obj 作为上下文对象来执行的。所以 this 隐式的绑定到了 obj 对象。

对象属性引用链中只有上一层或者说最后一层在调用位置中起作用。

```ts
function foo(this: typeof obj) {
  console.log(this.name);
}
const obj = {
  name: 'xfy',
  foo: foo,
};
obj.foo(); // xfy

const alotherObj = {
  name: 'dfy',
  obj: obj,
};
alotherObj.obj.foo(); // xfy
```

**隐式丢失**

既然会隐式的绑定，那也就会出现隐式的丢失问题。

```js
function foo() {
  console.log(this.name);
}

const obj = {
  name: 'xfy',
  age: 18,
  foo,
};

const bar = obj.foo; // 函数别名
bar();
```

虽然 bar 是`obj.foo`的一个引用，但是它引用的是函数体本身。可以理解为将函数体传递给了 bar 这个变量，这是调用`bar()`是一个不带任何修饰的函数调用，因此使用了默认绑定。

另一种常见且出乎意料的情况就是在传递回调函数时：

```js
  function foo() {
    console.log(this.name);
  }

  function doFoo(fn) {
    fn();
  }

  const obj = {
    name: 'xfy',
    age: 18,
    foo,
  };

  doFoo(obj.foo);
```

参数传递其实就是一种隐式赋值，因此我们传入函数是也会被隐式赋值。只要函数体被传递后，且调用时脱离了原有的对象，就会导致 this 的隐式丢失。

包括`setTimeout()`方法丢失 this 也是同理。

#### 显式绑定

因为原型的特性，JavaScript 中函数也自己的属性。大多数宿主环境都会提供`call()`与`apply()`来给我们显式的绑定 this。

```js
  function foo() {
    console.log(this.name);
  }
  const obj = {
    name: 'xfy',
    age: 18,
    foo,
  };
  foo.call(obj);
```

> call 与 apply 只是传参不同。

使用显式的绑定可以很好的解决传递参数时隐式丢失 this 的问题

```js
  function foo() {
    console.log(this.name);
  }
  const obj = {
    name: 'xfy',
    age: 18,
    foo,
  };
  function bar() {
    foo.call(obj);
  }
  setTimeout(bar, 1000);
  // 同理
  // setTimeout(() => {
  //   obj.foo();
  // }, 1000);
```

这里在`bar()`的内部直接手动显式的把`foo()`绑定到了 obj，无论之后怎么调用，在何处调用。都会手动的将 obj 绑定在`foo()`上。这种绑定称之为**硬绑定**。

不过这种绑定是特意的例子，这里手动为`foo()`绑定到了 obj。在多数情况下，我们可能需要更灵活一点。

在 [JavaScript 装饰器模式🎊 - 🍭Defectink (xfy.plus)](https://xfy.plus/defect/javascript-decorator.html) 中介绍了这种工作模式。通过一个包装器配合显式绑定就能解决大部分情况下的问题。

```js
  function foo(msg) {
    console.log(this.name);
    console.log(msg);
  }
  function wrapper(fn, obj) {
    return (...rest) => {
      fn.apply(obj, rest);
    };
  }
  const obj = {
    name: 'xfy',
    age: 18,
  };
  const bar = wrapper(foo, obj);
  bar('嘤嘤嘤');
```

但包装器不仅仅只是用来解决 this 丢失的问题，但对 this 绑定的问题 ES5 提供了内置的方法`Function.prototype.bind`。

```js
  function foo() {
    console.log(this.name);
  }
  const obj = {
    name: 'xfy',
    age: 18,
  };
  const bar = foo.bind(obj);
  bar();
```

#### new 绑定

在传统面向类的语言中，“构造函数”是类中的一些特殊的方法，使用类时会调用类中的构造函数。通常类似于这样：

```js
myObj = new MyClass()
```

在 JavaScript 中，所有函数都可以被 new 操作符所调用。这种调用称为构造函数调用，实质上并不存在所谓的“构造函函数”，只有对于函数的“构造调用”。

使用 new 来发生构造函数调用时，会执行：

1. 创建（构造）一个新对象。
2. 对新对象执行`[[Prototype]]`连接。
3. 对新对象绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么在 new 调用后自动返回这个新对象。

```js
function Foo(name) {
  this.name = name;
}
const bar = new Foo('xfy');
console.log(bar.name);
```

使用 new 操作符来调用`foo()`时，会构造一个新对象并把它绑定到`foo()`中的 this 上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。

> ES6 的 class 只是一个语法糖，但是它也解决了一些问题。

### 优先级

上述描述的四条规则中，如果某处位置可以应用多条规则时，就要考虑到其优先级的问题。

毫无疑问，默认绑定肯定是优先级最低的绑定。所以先来考虑隐式绑定与显式绑定之间的优先级，用一个简单的方法就能测试出：

```js
function foo() {
  console.log(this.age);
}

const xfy = {
  name: 'xfy',
  age: 18,
  foo,
};
const dfy = {
  name: 'dfy',
  age: 81,
  foo,
};

xfy.foo();  // 18
dfy.foo();	// 81

xfy.foo.call(dfy);	// 81
dfy.foo.call(xfy);	// 18
```

很明显，显式绑定的优先级更高，也就是说在判断时应当先考虑是否存在显式绑定。

那么 new 绑定与隐式绑定呢？

```js
function foo(msg) {
  this.a = msg;
}

const xfy = {
  name: 'xfy',
  foo,
};
xfy.foo('test');
console.log(xfy);

const obj = new xfy.foo('this is obj');
console.log(obj);
```

可以看到这里对对象 xfy 中隐式绑定的函数进行了 new 操作，而最后的 this 被绑定到了新对象 obj 上，并没有修改 xfy 本身的值。所以 new 绑定的优先级比隐式绑定更高。

那 new 绑定与显式绑定呢？由于`call/apply`无法与 new 一起使用，所以无法通过`new xfy.foo.call(obj)`来测试优先级，但是我们可以通过硬绑定`bind()`来测试。

```js
function foo(msg) {
  this.a = msg;
}

const xfy = {
  name: 'xfy',
  foo,
};

let obj = {};

const bar = xfy.foo.bind(obj);
bar('obj');
console.log(obj);

// bar was bind to obj
const baz = new bar('this is baz');
console.log(obj);
console.log(baz);
```

可以看到，在硬绑定之后，使用 new 操作对象 obj 的值并没有被改变，反而对 new 的新对象进行了修改。

但这真的说明 new 绑定比硬绑定优先级更高吗？实则不然，上述结果是因为 ES5 中内置的`Function.prototype.bind()`方法比较复杂，他会对 new 绑定做判断，如果是的话就会使用新创建的 this 替换硬绑定的 this。

这是来自 [MDN]([Function.prototype.bind() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#polyfill))的 polyfill bind 的方法，

```js
//  Yes, it does work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind)
  (function () {
    var ArrayPrototypeSlice = Array.prototype.slice;
    Function.prototype.bind = function (otherThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError(
          'Function.prototype.bind - what is trying to be bound is not callable'
        );
      }

      var baseArgs = ArrayPrototypeSlice.call(arguments, 1),
        baseArgsLength = baseArgs.length,
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          baseArgs.length = baseArgsLength; // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments);
          return fToBind.apply(
            fNOP.prototype.isPrototypeOf(this) ? this : otherThis,
            baseArgs
          );
        };

      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  })();
```

在这几段中：

```js
fNOP.prototype.isPrototypeOf(this) ? this : otherThis,
// 以及
if (this.prototype) {
  // Function.prototype doesn't have a prototype property
  fNOP.prototype = this.prototype;
}
fBound.prototype = new fNOP();
```

该 polyfill 检测了是否是使用 new 绑定，并修改 this 为 new 绑定。

#### 判断 this

根据上述优先级，可以得出一些判断 this 的结论（优先级从高到低）：

1. 函数是否在 new 中调用（new 绑定）？

   如果是的话， this 绑定的是新创建的对象。`const bar = new Foo()`

2. 函数是否通过`call/apply`或者硬绑定调用（显式绑定）？

   如果是的话，this 绑定的是指定的对象。`const bar = foo.call(baz)`

3. 函数是否在某个上下文对象中调用（隐式绑定）？

   如果是的话，this 绑定在那个上下文对象上。`const bar = obj.foo()`

4. 上述都不满足，那么就会使用默认绑定。

### 绑定例外

凡事都有例外，this 绑定也是同样。在某些情况下看上去可能是绑定某个规则，但实际上应用的可能是默认规则。

#### 被忽略的 this

把 null 或者 undefined 作为 this 的绑定对象传入`call/apply`与 bind 方法时，这些值会被忽略，从而应用默认绑定规则。

也就是说`call/apply`传入 null 或者 undefined 时与之间执行函数本身没有区别。

```js
function foo() {
  console.log(this.name);
}
foo.call(null);
```

这样使用`call/apply`的作用是利用他们的一些特性来解决一些小问题。

例如：展开数组

```js
function bar(a, b) {
  console.log(a, b);
}
bar.apply(null, [1, 2]);
```

当然，这在 ES6 中可以使用展开运算符来传递参数：

```js
bar(...[1,2])
```

又或是利用 bind 实现柯里化

```js
function bar(a, b) {
  console.log(a, b);
}

const baz = bar.bind(null, 1);
baz(2);
```

这里都是利用忽略 this 产生的一些副作用，但在某些情况下可能不安全，例如函数可能真的使用到了 this ，这在非严格模式下可能会修改全局对象。

如果真的需要使用这种方法，可以创建一个 DMZ 对象来代替 null。

```js
const ¤ = Object.create(null);
foo.call(¤, arg)
```

#### 间接引用

另外需要注意的是，在某些情况下我们可能会无意的创建一个函数的间接引用。间接引用最容易在赋值期间发生：

```js
function foo() {
  console.log(this.name);
}
const o = {
  foo,
};
const p = {};
(p.foo = o.foo)();
```

赋值表达式`p.foo = o.foo`返回的是目标函数的引用，所以在这里调用实际上是在全局环境下直接调用`foo()`。根据之前的规则，这里会应用默认绑定。

## 对象

### 将数组当作对象

数组和对象的差距貌似并不大，好像完全可以将一个数组当作对象使用，但这并不是一个好主意。数组和普通的对象都根据其对应的行为和用途进行了优化，所以最好只用对象来存储键/值对，只用数组来存储下标/值对。

如果试图给一个数组添加一个类似数字的属性，例如字符串`'3'`，那么在数组进行存储之后会将其作为下标，并且转为数字。

```js
let arr = []
arr.a = 123
arr.length  // 0
arr['3'] = 333
arr.length  // 4
arr  // (4) [空 ×3, 333, a: 123]
```

### [[Get]]

对象属性访问有些很微妙同时非常重要的细节，例如一次经典的属性访问：

```js
const obj = {
  name: 'xfy',
};
obj.name;
```

`obj.name`是一次属性访问，但这不是简单的在对象 obj 中查找这个属性。

在语言规范中，`obj.name`在 obj 上实现了`[[Get]]`操作（这有点类似于函数调用：`[[Get]]()`）。对象默认的`[[Get]]`操作会先在该对象中查找是否具有名称相同的属性，如果有就返回。

如果没有找到名称相同的属性，则会继续遍历原型链，直到找到为止。如果原型链上也没有找到同名的属性，那么`[[Get]]`操作就会返回 undefined。

```js
obj.age; // undefined
```

这和访问变量时行为略微不同，如果引用了一个当前词法作用域中不存在的变量，则会抛出 ReferenceError。

所以仅通过返回值无法判断一个属性是否存在：

```js
const myObj = {
  a: undefined,
};
myObj.a; // undefined
myObj.b; // undefined
```

### [[Put]]

有`[[Get]]`操作就有对应的`[[Put]]`操作。`[[Put]]`被触发时，实际行为取决于很多因素，包括对象中是否已经存在这个属性。

如果已经存在这个属性，`[[Put]]`算法大概会检查这些内容：

1. 属性是否是访问描述符 Setter？如果是，则直接调用 Setter。
2. 属性的数据描述符中 writable 是否是 false？如果是，非严格模式下静默失败，严格模式抛出 TypeError 异常。
3. 如果都不是，将该值设置为属性的值。

### Getter 和 Setter

对象有默认的`[[Get]]`与`[[Put]]`操作可以分别控制属性值的设置与获取。在 ES5 中可以是使用 getter 和 setter 来改写单个属性的默认操作。

> 目前只能改写对象的某个属性，未来可能能够修改整个对象的默认行为。

当给一个属性定义了一个 getter 或者 setter 时，这个属性会被定义为“访问描述符”（和“数据描述符”相对）。这会使其忽略他们的 value 和 writable 属性，取而代之的时 set 与 get（还有 configurable 和 enumerable）特性。

两种定义方式相同，都会在对象中创建一个不包含值的属性。

```js
let obj = {
  get a() {
    return 123;
  },
};
console.log(obj.a);

Object.defineProperty(obj, 'b', {
  get: function () {
    return this.a * 2;
  },
});
console.log(obj.b);
```

getter 和 setter 通常成对出现

```js
let myObj = {
  get a() {
    return this._a_;
  },
  set a(val) {
    this._a_ = val * 3.14;
  },
};
myObj.a = 15;
console.log(myObj.a);
```

### 存在性

前面介绍过一般情况下对象无法区分属性值不存在还是其值为 undefined。我们可以使用`in`操作符与`Object.hasOwnProperty()`方法来判断一个对象中是否有这个属性。

```js
let obj = {
  a: 123,
};
console.log('a' in obj);
console.log('b' in obj);

console.log(obj.hasOwnProperty('a'));
console.log(obj.hasOwnProperty('b'));
```

这两个方法不同的是：

* `in`会检查属性是否存在于对象以及原型链中；
* `Object.hasOwnProperty()`只会检查属性是否在对象中。

```js
let obj = {
  a: 123,
};

let myObj = Object.create(obj);
console.log('a' in myObj);
```

另外，enumerable 属性描述符直接影响到`for/in`的遍历，不可枚举的属性`for/in`会直接忽略。

```js
let obj = {
  a: 123,
};

Object.defineProperty(obj, 'b', {
  enumerable: false,
  value: 456,
});

for (const i in obj) {
  console.log(i);
}
```

还有另外几个方法也能区分属性是否可枚举：

```js
let obj = {
  a: 123,
};

Object.defineProperty(obj, 'b', {
  enumerable: false,
  value: 456,
});

console.log(obj.propertyIsEnumerable('a'));
console.log(obj.propertyIsEnumerable('b'));

console.log(Object.keys(obj));

console.log(Object.getOwnPropertyNames(obj));
```

他们的区别是：

* `propertyIsEnumerable()`当前对象中的属性是否可枚举，不检查原型链；
* `Object.keys()`返回当前对象所有可枚举属性的数组；
* `getOwnPropertyNames()`会返回对象的所有属性，无论是否可枚举；

### 遍历

这里记录下`[Symbol.iterator]()`方法的一些使用习惯。一个可迭代对象需要拥有`[Symbol.iterator]()`方法才是可迭代对象，而`[Symbol.iterator]()`方法是这样组成的：

```js
let obj = {
  start: 0,
  end: 10,
  [Symbol.iterator]() { // Symbol.iterator是对象中的一个方法
    return { // 它返回一个next方法
      next: () => {
        return { // next方法还需要返回一个包含 value 和 done 的对象
          value: ++this.start,
          done: this.start > this.end,
        };
      },
    };
  },
};
```

Symbol.iterator 是对象中的一个方法，它返回一个 next 方法（当然也可以不返回），而 next 方法还需要返回一个包含 value 和 done 的对象。这样才构成了一个可迭代的对象。

Symbol.iterator 方法可以直接通过 this 访问原对象，而 next 方法是 Symbol.iterator 方法返回的一个方法，它需要通过 this 来获取原本对象时就需要使用箭头函数，因为普通函数会有自己的 this 值。

```js
let obj = {
  start: 0,
  end: 10,
  [Symbol.iterator]() {
    return {
      next() {
        return {
          value: ++this.start, // undefined
          done: this.start > this.end,
        };
      },
    };
  },
};
```

另外，Symbol.iterator 也可以不返回 next 方法，它通过返回 this，然后在原对象中定义一个 next 方法。这样迭代器就照样能找到 next 方法，且能够使用 this 了。

```js
// 这样也是可以的
let obj = {
  start: 0,
  end: 10,
  [Symbol.iterator]() {
    return this;
  },
  next() {
    return {
      value: ++this.start,
      done: this.start > this.end,
    };
  },
};
```

## 类

类是一种设计模式。许多语言提供了对于面向类软件设计的原生语法。JavaScript 也有类似的语法，但是和其他语言的类完全不同。

类意味着复制。

传统的类被实例化时，它的行为会被复制到实例中。类被继承时，行为也会被复制到子类中。

多态（在继承链的不同层次名称相同但是功能不同的函数）看起来似乎是从子类中引用父类，但是本质上引用的其实是复制的结果。

JavaScript 并不会（像类那样）自动创建对象的副本。

## 原型

考虑原型链之前先来看下什么是原型。我在《JavaScript 权威指南》中读到的最容易理解的一句话就是：对象不仅仅是简单的字符串（和 Symbol）到值的映射。除了维持自己的属性之外，JavaScript 对象也可以从其他对象继承属性，这个其他对象称其为“原型”。

JavaScript 与传统的 OOP 语言不同的是，它没有通常的类的概念。对象的方法通常是继承来的属性，而这种“原型式继承”也是 JavaScript 的主要特性。

JavaScript 的对象有个特殊的`[[Prototype]]`内置属性，也就是原型，其实就是对于其他对象的引用。几乎所有对象在创建时`[[Prototype]]`属性都会被赋予一个非空的值。一个对象的原型是其他的对象的引用，而其他的对象也会拥有原型，这样就形成了所谓的“原型链”。看上去和作用域链有点类似，虽然他们是两种东西，但是某些查找值的行为确实很类似。

`[[Prototype]]`引用有什么用呢，上述介绍过`[[Get]]`操作会在当前对象内寻找指定的属性，如果找不到，它就会继续上`[[Prototype]]`上寻找。

> 这里对`[[Get]]`的讨论是不考虑 ES6 的 Proxy 的情况下的。

这样的代码在前面可能已经见过，`Object.create`应该是用来描述原型最方便的方法了。先不考虑它的实现，它在这里的作用就是将 obj 设置为 otherObj 的原型。这样在对`otherObj.name`实施`[[Get]]`操作时，otherObj 本身并 name 这个属性，但是它会随着原型查找到 obj 上，并成功的访问到了值。

```js
let obj = {
  name: 'xfy',
};
const otherObj = Object.create(obj);
console.log(otherObj.name);
```

### 原型链的尽头

前面说过，一个对象的原型是其他的对象的引用，而其他的对象也会拥有原型，这样就形成了所谓的“原型链”。那么这样的原型链到哪里才是个头呢？

所有普通的对象原型最终都会指向`Object.prototype`。这也就是为什么几乎所有对象都有`toString()`和`valueOf()`之类的方法了，因为他们是通过原型链访问到 Object 对应的方法的。

### 属性设置和屏蔽

在我刚学 JavaScript 的时候，有人曾告诉过我，如果给一个对象设置一个和其原型链上同名的方法，那么就会屏蔽它的方法，访问到的是该对象自己定义的同名方法。这种情况称之为重写。

重写方法这里就不多说了，但重写远比我们想象中的更复杂。它只是多种情况下的一种。如果为一个对象 obj 赋值一个 foo 属性，假设它的原型链已经有这个同名的属性了，那么它会出现三种情况：

1. 如果在`[[Prototype]]`链上这个同名属性没有被设置为只读（`writable:false`）属性，那么就会直接在 obj 添加一个 foo 属性，它是屏蔽属性。
2. 如果`[[Prototype]]`链上这个同名属性为只读，那么无法修改已有属性或者在 obj 上创建屏蔽属性。在严格模式下会抛出一个错误，非严格模式下会静默失败。
3. 如果`[[Prototype]]`链上这个同名属性是一个 setter，那就一定会调用这个 setter。不会创建屏蔽属性，也会重新定义这个 setter。

前面两种情况都好理解，来看下 setter 的情况：

```js
let myObj = {
  name: 'xfy',
  set foo(val) {
    this._a_ = val * 2;
  },
  get foo() {
    return this._a_;
  },
};
const obj = Object.create(myObj);
obj.foo = '110';
console.log(obj.foo); // 220
```

也就说属性屏蔽只是三种情况种的一种而已。

> 第二种令人意外的情况主要是为了模拟类属性的继承。更令人意外的是它只会发生在使用`=`赋值中，使用`Object.defineProperty()`并不会受到影响。

### 原型式继承

本咸鱼曾经在读高程三的时候研究过 JavaScript 的原型式继承： [JavaScript 面向对象的程序设计 - 🍭Defectink](https://www.defectink.com/defect/javascript-object-oriented-programming.html) 。所以这里不再赘述关于构造函数还有模拟类的历史问题等，这里记录一些那篇文章没有提到的东西。

那篇文章里记录过 Douglas Crockford 所介绍的实现继承的方法。

```js
function object(o) {
    function F() {};
    F.prototype = o;
    return new F();
}
```

也就是`Object.create()`。

但当时并没有讨论构造函数之间的继承为什么用这种方式。如果有两个构造函数 Foo 和 Bar，假设 Bar 需要继承自 Foo，那么这两种写法为何不行？

```js
// 引用机制！
Bar.prototype = Foo.prototype;
// 可能会有副作用
Bar.prototype = new Foo();
```

第一种方法有很严重的问题，因为 JavaScript 中的对象并不是按值赋值的，而是而引用赋值的。直接将`Bar.prototype = Foo.prototype`，那么二者就会关联起来，任何在子类原型上的修改都会翻译到父类原型上，因为他们本质上是一个 prototype。

第二种方法确实可能正常关联，但是如果父类 Foo 有一些副作用操作（例如修改状态、注册到其他对象，给 this 添加属性，等等），这样就会影响到子类创建的实例。

所以合适的方法就是使用`Object.create()`。但这是在 ES6 之前的情况，ES6 添加了新的辅助函数`Object.setPrototypeOf()`，可以用标准且可靠的方法来修改关联。

```js
// ES6 之前需要抛弃默认的 Bar.prototype
Bar.prototype = Object.create(Foo.prototype);
// ES6 之后可以直接修改现有的 Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype);
```

### 检查“类”关联

在传统的面向类的环境中，检查一个实例（JavaScript 的对象）的继承祖先（JavaScript 的委托关联）通常被称之为内省（反射）。

在 JavaScript 中也有类似的操作：

```js
function Foo() {}
const obj = new Foo();

obj instanceof Foo; // true
```

instanceof 操作符的左侧是一个对象，右侧是一个函数。它回答的问题是：在 obj 的整条原型链`[[Prototype]]`上是否有`Foo.prototype`指向的对象？

但这个方法只能用在对象和函数之间的关系，如果需要判断两个对象之间是否通过`[[Prototype]]`关联，只用 instanceof 无法实现。

可以使用`.isPrototypeOf()`来检查两个对象之间是否关联，当然，它也可以用来检查“实例”和“类”之间的关联。

因为 JavaScript 中的类本质上就是使用原型链模仿出的结果，所以判断 obj 与其构造函数 Foo 之间的关系也可以这样：

```js
Foo.prototype.isPrototypeOf(obj);
```

由于类是虚假的，实际上我们并不需要 Foo，只需要它的原型对象 prototype。`.isPrototypeOf()`回答的问题是：在 obj 的整个原型链中是否出现过`Foo.prototype`？

在 ES5 中我们可以直接获取一个对象的原型：

```js
class Foo {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}

const obj = new Foo('xfy');

Object.getPrototypeOf(obj)
// {constructor: ƒ, sayName: ƒ}
// constructor: class Foo
// sayName: ƒ sayName()
// __proto__: Object
```

如果经常和 Chrome 之类的浏览器打交道的话，可能还在对象中见到过`.__proto__`属性。这个属性神奇的引用了`[[Prototype]]`对象，并且在 ES6 成为了标准。