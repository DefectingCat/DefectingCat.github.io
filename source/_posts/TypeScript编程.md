---
title: TypeScript编程
date: 2021-05-20 21:03:19
tags: TypeScript
categories: 笔记
url: programming-typescript
index_img: /images/TypeScript%E7%BC%96%E7%A8%8B/logo.webp
---

> 《Programming TypeScript》笔记。

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
  (from: Date, destination: string): string;
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

而如果把 T 写在类型别名上，TypeScript 则要求在使用 Filter 时显式绑定类型：

```ts
type Filter<T> = {
  (arr: T[], fn: (item: T) => boolean): T[];
};
const filter:Filter<number> = (arr, fn) // ...
```

一般来说，TypeScript 在使用泛型时为泛型绑定具体类：对函数来说，在调用函数时；对类来说，在实例化类时；对类型别名和接口来说，在使用别名和接口时。

#### 函数泛型的多种写法

```ts
type Filter = {
  <T>(arr: T[], fn: (item: T) => boolean): T[];
};
const filter: Filter = (arr, fn); // ...

type Filter<T> = {
  (arr: T[], fn: (item: T) => boolean): T[];
};
const filter:Filter<number> = (arr, fn) // ...

type Filter = <T>(arr: T[], fn: (item: T) => boolean) => T[];
const filter: Filter = (arr, fn); // ...

type Filter<T> = (arr: T[], fn: (item: T) => boolean) => T[];
const filter:Filter<number> = (arr, fn) // ...
```

#### 约束受限多态

施加一个类型约束很简单，语法有点类似于子类继承：

```ts
function test<T extends Filter> { //... }
```

当然，也可以有多个约束，这时候就要使用到交集了：

```ts
function test<T extends Filter & Map> { //... }
```

除此之外还能借助受限的多态来模拟变长参数函数（可接受任意个参数的函数），例如之前一直困扰我的防抖函数：

```ts
type Debounce = {
  <T extends unknown[]>(fn: (...arg: T) => void | unknown, ms: number): (
    this: unknown,
    ...arg: T
  ) => void | unknown;
};

const debounce: Debounce = (fn, ms) => {
  let timer = 0;
  return function (...arg) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, ms);
  };
};
```

`<T extends unknown[]>`表示 T 是`unknown[]`的子类型，即 T 是任意类型的数组或元组。

## 类

类是组织和规划代码的方式，是封装的基本单位。众所周知，JavaScript 的类是语法上的，在 ES6 时支持了 class 关键字。TypeScript 的类大量的借用了 C# 的理论，支持属性初始化语句、多态、装饰器和接口等。

### 基本语法

public 或 private 关键字在 constructor 中将为我们创建对应的属性：

```ts
class Person {
  constructor(public name: string, public age: number) {}
}

const xfy = new Person('xfy', 18);
console.log(xfy);

class alotherPerson extends Person {
  protected static country: number;
  constructor(
    name: string,
    age: number,
    public sex: string,
    private nickname: string
  ) {
    super(name, age);
  }
}
const dfy = new alotherPerson('dfy', 18, 'female', 'xfy');
console.log(dfy);
```

### 以 this 作为返回类型

this 可以用作值，也可以用作类型。对类来说，this 类型还可以用于注解方法的返回类型。

例如我们需要实现一个简单的 Set 数据结构，他有一个 add 方法，每次返回的就是一个 Set 实例。我们可以直接注解为 Set 类。

```ts
class MySet {
  has(value: number):boolean {}
  add(value: number): MySet {}
}
```

但这样的缺点就是，当子类需要继承自父类时，子类的同名方法需要重新注解为返回对应的子类：

```ts
class MyOtherSet extends MySet {
  add(value: number): MyOtherSet {}
}
```

这样在拓展其他类时，要把返回的 this 的每个方法的签名覆盖掉，就显得十分麻烦。如果只是为了让类型检查器满意，这样做就失去了继承基类的意义。

正确的方法是将 this 作为注解的返回类型，把相关工作交给 TypeScript：

```ts
class MySet {
  has(value: number): boolean {}
  add(value: number): this {}
}

class MyOtherSet extends MySet {
  add(value: number): this {}
}
```

### 接口

类经常被当作接口使用。

接口是一种命名类型的方式，它和类型别名类似，不过二者还有一些细微的差别：

第一，类型别名更为通用，右边可以是任何类型，包括类型表达式；而接口声明中，右边必须为结构。

```ts
type A = number;
type B = A | string;
```

第二个区别是，扩展接口时，TypeScript 将检查扩展的接口是否可赋值给被扩展的接口。

```ts
interface Animal {
  good(x: string): string;
}
interface Dog extends Animal {
  good(x: number): void;
}
```

而使用类型别名使用交集运算符`&`来扩展时，TypeScript 将尽自己所能，把扩展和被扩展的类型组合在一起，最终是重载冲突的签名。

```ts
type C = {
  (x: string): string;
};
type D = C & {
  (x: number): string;
};

const ef: D = (x) => {
  return 'xfy';
};
ef('123');
```

第三个区别是，同一作用域中多个同名接口将自动合并；而同一作用域中的多个类型别名将导致编译时错误。这个特性称之为声明合并。

### 实现

可以为类添加类型层面约束。

```ts
interface Animal {
  eat(food: string): void;
  sleep(hours: number): void;
}

class Cat implements Animal {
  constructor(public name: string) {}
  eat(food: string) {
    console.log(`eating ${food}`);
  }
  sleep(hours: number) {
    console.log(`slept for ${hours} hours`);
  }
}
const myCat = new Cat('xfy');
myCat.sleep(10);
```

### 接口还是抽象类

TypeScript 可以使用`abstract`关键字来实现抽象类，实现接口其实于抽象类差不多。区别是，接口更通用，更轻量，而抽象类的作用更具体，功能更丰富。

接口是对结构建模的方式。在值层面可表示对象、数组、函数、类或类的实例。接口不生成 JavaScript 代码，只存在于编译时。

抽象类只能对类建模，而且生成运行时代码，即 JavaScript 类。抽象类可以有构造方法，可以提供默认实现，还能为属性和方法设置访问修饰符。这些在接口都中做不到。

具体使用哪一个，取决于实际用途。如果多个类共用一个实现，使用抽象类。如果需要一种轻量的方式表示“这个类是 T 型”，使用接口。

### 类是结构化类型

TypeScript 根据类的结构来比较类，与类的名称无关。类与其他类是否兼容，要看结构。

```ts
class Cat {
  sleep(hours: number) {}
}
class Dog {
  sleep(hours: number) {}
}
const checkCat = (animal: Cat) => {
  animal.sleep(10);
};

/* 这里传入狗狗也是可以的 */
checkCat(new Dog());
```

### 类既声明值也声明类型

类和枚举比较特殊，它们即在类型命名中生成类型，也在值命名空间中生成值。

```ts
class G {}
// 声明值的同时也声明了类型
let g: G = new G();

enum H {
  J,
  K,
}
let h: H = H.J;
```

### 模拟 final 类

在某些面向对象的语言中，可以使用 final 关键字来吧类标记为不可拓展，或者把方法标记为不可覆盖。

在 TypeScript 中可以使用私有的 constructor 来轻松的模拟 final 类：

```ts
class Message {
  private constructor(private msg: string) {}
}
// Cannot extend a class 'Message'. Class constructor is marked as private.
class NewMessage extends Message {}
```

但将 constructor 标记为 private 后，同时也不能使用 new 来实例化类了。我们仅仅需要不能拓展即可，可以简单修改一下使其能够实例化：

```ts
class Message {
  private constructor(private msg: string) {}
  static create(msg: string) {
    return new Message(msg);
  }
}

// Constructor of class 'Message' is private and only accessible within the class declaration.
new Message('test');
// Ok
Message.create('test');
```

如果将 private 换成 protect 之后，就实现了完全相反的效果。由于 protect 可以被子类所使用，所有可以拓展。而外部无法使用，所以就无法实例化该类。

```ts
class Message {
  protected constructor(protected msg: string) {}
}

class NewMessage extends Message {}
```

### 工厂模式

工厂模式是创建某种类型的对象的一种方式，这种方式把创建哪种具体对象给创建该对象的工厂决定。

这里实现了一个创建 Shoe 的工厂，Shoe 对象有一个`crarete()`方法，它根据传入的值来决定创建哪个鞋子。同时参数 type 使用了并集而不是 string 来进一步保证类型的安全。

```ts
type Shoe = {
  purpose: string;
};
class Boot implements Shoe {
  purpose = 'woodcutting';
}
class BalletFlat implements Shoe {
  purpose = 'dancing';
}
class Sneaker implements Shoe {
  purpose = 'walking';
}

const Shoe = {
  crarete(type: 'boot' | 'balletflat' | 'sneaker'): Shoe {
    switch (type) {
      case 'boot':
        return new Boot();
      case 'balletflat':
        return new BalletFlat();
      case 'sneaker':
        return new Sneaker();
    }
  },
};

const myShoe = Shoe.crarete('sneaker');
console.log(myShoe.purpose);
```

当然也可以牺牲一点抽象性，使用函数重载来明确返回类型：

```ts
type Shoe = {
  purpose: string;
};
class Boot implements Shoe {
  purpose = 'woodcutting';
}
class BalletFlat implements Shoe {
  purpose = 'dancing';
}
class Sneaker implements Shoe {
  purpose = 'walking';
}

type CreateShoe = {
  crarete(type: 'boot'): Boot;
  crarete(type: 'balletflat'): BalletFlat;
  crarete(type: 'sneaker'): Sneaker;
};

const Shoe: CreateShoe = {
  crarete(type: 'boot' | 'balletflat' | 'sneaker'): Shoe {
    switch (type) {
      case 'boot':
        return new Boot();
      case 'balletflat':
        return new BalletFlat();
      case 'sneaker':
        return new Sneaker();
    }
  },
};

const myShoe = Shoe.crarete('sneaker');
console.log(myShoe.purpose);
```

## 类型进阶

TypeScript 拥有一流的类型系统支持强大的类型层面编程特性。不仅具有极强的表现力，易于使用，而且可以通过简介明了的方式声明类型约束和关系，并且多数时候能为我们自动推导类型。

### 超类型和子类型

如同类一样，类型也有超类型与其子类型。并且在需要超类型的地方都可以安全的使用其子类型。类型的关系很常见，例如：

* Cat 类拓展自 Animal 类，那么 Cat 是 Animal 的子类型；
* Array 是 Object 的子类型；
* Tuple 是 Array 的子类型；
* 所有类型都是 any 的子类型；
* never 是所有类型的子类型；

反过来也是同样的，Animal 就是 Cat 的超类型。

### 函数型变

如果 A 函数的参数数量小于或等于 B 函数的参数数量，且满足如下条件，那么函数 A 是函数 B 的子类型：

1. 函数 A 的 this 类型未指定，或者 this 是函数 B this 的**超类型**；
2. 函数 A 的各个参数的类型为函数 B 相应参数的**超类型**；
3. 函数 A 的返回类型为函数 B 返回类型的**子类型**；

仔细研究就会发现，虽然函数 A 是函数 B 的子类型，但是它的 this 和参数缺都是函数 B 的超类型。

来看一个简单的示例，这里通过几个类之间的继承，很好的描述了函数之间的型变：

```ts
class Animal {}
class Cat extends Animal {
  miao() {}
}
class Lion extends Cat {
  wawu() {}
}

function miaomiao(cat: Cat) {
  cat.miao();
  return cat;
}

// 需要超类型的地方也可以使用子类型
miaomiao(new Animal());
miaomiao(new Cat());
miaomiao(new Lion());

// 回调函数 fn 为超类型
function clone(fn: (cat: Cat) => Cat): void {
  const parent = new Cat();
  const baby = fn(parent);
  baby.miao();
}

// catToLion 即是回调函数 fn 的子类型
// 满足返回值是其子类型
function catToLion(c: Cat): Lion {	
  return new Lion();
}
clone(catToLion);

// catToAnimal 返回值是其超类型，所以无法调用
function catToAnimal(c: Cat): Animal {
  return new Animal();
}
clone(catToAnimal);

// animalToCat 即是回调函数 fn 的子类型
// 满足参数是其超类型
function animalToCat(a: Animal): Cat {
  return new Cat();
}
clone(animalToCat);

// animalToLion 参数是其子类型，所以无法调用
function animalToLion(l: Lion): Cat {
  return new Cat();
}
clone(animalToLion);
```

值得高兴的是，我们并不需要记诵这套规则。只需要了解一下就好了，剩下的 TypeScript 都帮我们做了（我们的老朋友，红色波浪线会告诉我们传递是否正确的）。

### 可赋值性

可赋值性之的就是判断需要 B 类型的地方是否可用 A 类型时 TypeScript 采用的规则。

在非枚举类型来说，A 类型是否可赋值给 B 类型有两个规则：

1. A 是 B 的子类型；
2. A 是 any；

也就是说能用到超类型的地方，都能可以用其子类型。

对于枚举类型来说，也是有两个规则：

1. A 是枚举 B 的成员；
2. B 至少有一个成员是 number 类型，且 A 是数字；

### 类型拓宽

TypeScript 在一般情况下推导类型时会放宽要求，故意推导出一个更宽泛的类型，而不是限定为一个具体的类型。不过在使用`const`关键字声明标识符的时候会严格限定类型。

```ts
// a: string
let a = 'xfy';
// b: 'xfy'
const b = 'xfy';
```

可以显式注解，防止类型拓宽。

#### const 类型

TypeScript 中有一个特殊的类型`const`类型，可以禁止类型拓宽并且还递归的将成员设置为`readonly`，不管嵌套有多深。这个类型作用与类型断言。

```ts
let c = { x: 123 } as const;
// d: { readonly x: 1; readonly y: { readonly z: 3; }; }
let d = { x: 1, y: { z: 3 } } as const;
```

#### 多余属性检查

TypeScript 在检查一个对象是否可赋值给另一个对象时，也涉及到类型拓宽。

传递一个对象字面量时，TypeScript 会对所有属性进行检查，也就是多余属性检查。

```ts
type Option = {
  baseUrl: string;
  cacheSize?: number;
};

class API {
  constructor(option: Option) {}
}

new API({
  baseUrl: 'https://xfy.plus',
  cacheSizee: 123, // 错误
});
```

但多余属性检查在将对象赋值给一个变量时则不会详细检查：

```ts
let option = {
  baseUrl: 'https://xfy.plus',
  cacheSizee: 123,
};
new API(option);  // 没有错误
```

### 对象类型进阶

对象是 JavaScript 语言的核心，为了以安全的方式描述和处理对象，TypeScript 提供了一系列方式。

#### 对象类型运算符

**键入运算符**

键入运算符提供了类似与对象字面量的方式来对类型的访问，在对顶层类型做访问时，能提供更简便的方法：

```ts
type APIResponse = {
  user: {
    userId: number;
    frientList: {
      count: number;
      friends: {
        firstName: string;
        lastName: string;
      }[];
    };
  };
};
type FriendList = APIResponse['user']['frientList'];
```

**`keyof`运算符**

与`Object.keys`类似，不过`keyof`取的是作为类型的键。

```ts
const Obj = {
  a: 1,
  name: 'xfy',
};

type PickOne = {
  // T 是一个对象，K 是 T 中的一个键
  <T extends object, K extends keyof T>(obj: T, key: K): T[K];
};

const pickOne: PickOne = (obj, key) => {
  return obj[key];
};

const t1 = pickOne(Obj, 'a');
```

#### 映射类型

TypeScript 还提供了一种更强大的方式，即映射类型（mapped type）。一个对象最多有一个映射类型

```ts
const nextDay: { [key in Day]: string } = {
  Mon: 'Thu',
};
```

内置的映射类型

* `Record<Keys, Values>`：键的的类型为 Keys、值的类型为 Values 的对象。
* `Partial<Object>`：把 Object 中的每个字段都标记为可选的。
* `Required<Object>`：把 Object 中的每个字段都标记为必须的。
* `Readonly<Object>`：把 Object 中的每个字段都标记为只读的。
* `Pick<Object, Keys>`：返回 Object 的子类型，只包含指定的 Keys。

### 函数类型进阶

函数类型常用的几种高级技术。

#### 改善数组的类型推导

TypeScript 在推导元组类型的时候会放宽要求，推导出的结果尽量宽泛，不在乎元组的长度和各位置的类型。

```ts
const tuple1 = [1, 'xfy'] as const;
// tuple1: (string | number)[]
```

有些时候我们可能希望更加严格一点，而不是当作数组来使用。当然可以使用类型断言来更加严格：

```ts
const tuple2 = [1, 'xfy'] as const;
// tuple2: readonly [1, "xfy"]
```

但有时候我们可能不想使用断言，或者不想标记为只读。这时候可以利用 TypeScript 推导剩余参数的类型的方式：

```ts
const tuple = <T extends unknown[]>(...ts: T): T => {
  return ts;
};
const myTuple = tuple(1, 'xfy');
// myTuple: [number, string]
```

这个函数返回传入的参数，神奇之处全在类型中。当代码中使用到了大量的元组时，而又不想全部断言时，可以尝试这种技术。

#### 用户定义的类型防护措施

TypeScript 支持类型的细化。但它不不是任何条件都有用的：

```ts
function isString(str: unknown): boolean {
  return typeof str === 'string';
}
console.log(isString('123')); // true
console.log(isString(123)); // false

function parseInput(input: string | number) {
  if (isString(input)) {
    input.toUpperCase(); // Property 'toUpperCase' does not exist on type 'number'.
  }
}
```

在这种情况下，类型细化就不再为我们工作了。类型细化的能力有限，只能细化当前作用域中变量的类型，一旦离开作用域，类型细化能力不会随之转移到新作用域中。在新的函数内，TypeScript 只知道`isString`返回一个布尔值。

`isString`返回的确实是一个布尔值，但我们要让类型检查器知道，当返回是真值时，表明其参数是一个字符串。为此，这里需要使用用户定义的类型防护措施：

```ts
function isString(str: unknown): str is string {
  return typeof str === 'string';
}
console.log(isString('123')); // true
console.log(isString(123)); // false

function parseInput(input: string | number) {
  if (isString(input)) {
    input.toUpperCase(); // worked!
  }
}
```

类型防护措施是 TypeScript 内置的特性，is 运算符就起这个作用。如果函数细化了参数的类型，而且返回一个布尔值，我们可以使用用户定义的类型防护措施确保类型的细化能在作用域之间转移。用户定义的类型防护措施只限于一个参数，但是不限定于简单的类型。

### 条件类型

TypeScript 提供了和条件运算类似的方式来运算类型。

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

#### infer 关键字

条件类型的另一个更强大的特新故事可以在条件中声明泛型。这个声明方式不是使用尖括号`<>`，而是使用 infer 关键字。

这里的意思是：当泛型 T 继承自另一个泛型 U 组成的数组时，返回 U 类型。

```ts
type SomeArr<T> = T extends (infer U)[] ? U : T;
type C = SomeArr<string[]>; // string
type D = SomeArr<number[]>; // number
```

这还不是最强大的地方，对于数组来说我们可以使用键入运算符`[]`。更强大的地方在于它还可以获取到函数参数类型：

这里的意思是：当泛型 F 继承自一个接收两个参数的函数，并且两个参数中的第二个参数为泛型 U 类型时，返回对应的 U 类型。

```ts
type SecondArg<F> = F extends (argA: any, argB: infer U) => any ? U : never;

type F = typeof Array['prototype']['slice']; // F = (start?: number, end?: number) => any[]
type Arg = SecondArg<F>; // Arg = number
```

可见`[].slice`的第二个参数是 number 类型，而且在编译时便可知晓这一点。Java 能做到吗？

> ↑《Programming TypeScript》中文版 6.5.2 章原话。

## 异步

### 事件发射器

