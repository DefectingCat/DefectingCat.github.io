---
title: TypeScript临碎笔记
date: 2021-06-02 12:13:06
tags: TypeScript
categories: 笔记
url: typescript-pieces
index_img: /images/TypeScript%E4%B8%B4%E7%A2%8E%E7%AC%94%E8%AE%B0/logo.svg
---

## 类型

```ts
// 基础类型 null, undefined, symbol, boolean, void
const count: number = 123;
const teacherName: string = 'Dell';

// 对象类型

class Person {}

const teacher: {
  name: string;
  age: number;
} = {
  name: 'Dell',
  age: 18
};

const numbers: number[] = [1, 2, 3];

const dell: Person = new Person();

const getTotal: () => number = () => {
  return 123;
};

```

### 基本类型

当复制和变量定义不在同一行时，ts 就无法推断类型。

```js
string, number
```

```js
null, undefined, symbol, boolean, void
```

### 引用值

数组，对象，类，函数

## 函数返回类型

函数也可以指定返回值的静态类型

```ts
function test(data: { x: number }): object {
  console.log(data.x);
  return data;
}

test({ x: 123 });

```

如果没有返回值，则使用`void`指定

```ts
function test(data: { x: number }): void {
  console.log(data.x);
}

test({ x: 123 });

```

### never

指定`never`返回值表示该函数永远不会执行完

```ts
function test(): never {
  while (true) {}
}

```

### 解构参数类型注解

```ts
function add({
  firstNumber,
  secondNumber,
}: {
  firstNumber: number;
  secondNumber: number;
}): number {
  return firstNumber + secondNumber;
}
add({ firstNumber: 1, secondNumber: 2 });

```

### 匿名函数的类型注解

```ts
const fn = (data: { x: number }): number => {
  return data.x;
};
const fnc: (str: string) => string = (str) => {
  return str;
};

```

## 数组和元组

### 数组的类型注解

```ts
const arr: (number | string)[] = [1, '2', 3];
const arr: (number | string)[] = [1, '2', 3];
const objArr: object[] = [{}, {}];
const obj1Arr: { name: string }[] = [{ name: 'xfy' }];
const obj2Arr: ({ name: string } | number)[] = [{ name: 'xfy' }, 123];

```

### 类型别名

类型别名和`interface`类似

```ts
type User = {
  name: string;
  age: number;
};
const arr1: User[] = [{ name: 'xfy', age: 18 }];

interface User1 {
  name: string;
  age: number;
}
const arr2: User1[] = [{ name: 'xfy', age: 18 }];

```

### 元组

tuple，数据解构和数组类似，但可以指定每一项的数据类型。

```ts
const tuple: [string, number] = ['xfy', 18];
const csv1: [string, number][] = [];
```

## interface

interface 用于定义一个新的类型集合

```ts
interface Person3 {
  name: string;
}
const sayName = (person: Person3): void => {
  console.log(person.name);
};
sayName({ name: 'xfy' });

```

### 类型别名和`interface`区别

类型别名可以直接指定单个类型，而接口必须为一个对象

```ts
interface Person1 {
  name: string;
}
type Person2 = string;

```

能用接口的尽量使用接口来定义。

### 可选类型

一种类似于可选链的语法，通过 interface 注解可选的数据类型

```ts
interface Person4 {
  name: string;
  age?: number;
}
const fn1 = (person: Person4): void => {
  console.log(person.name);
};
fn1({ name: 'xfy', age: 18 });
```

### 只读

```ts
interface Person5 {
  readonly name: string;
  age?: number;
}
const fn2 = (person: Person5): void => {
  console.log(person.name);
  person.name = 'test';  // Cannot assign to 'name' because it is a read-only property.
};
fn2({ name: 'xfy', age: 18 });

```

### 强类型检查

当 interface 注解类型时，通过直接传递对象字面量就会进行强类型检查。ts 会检查对象字面量内的每个属性，多余的属性将无法通过检查。

而通过使用一个对象表达式将一个变量进行传递时，检查不会那么严格。

```ts
interface Person6 {
  readonly name: string;
  age?: number;
}
const fn3 = (person: Person6): void => {
  console.log(person.name);
  // person.name = 'test';
};
fn3({ name: 'xfy', sex: 'female' });  //  'sex' does not exist in type 'Person6'.
const person1 = {
  name: 'xfy',
  sex: 'female',
};
fn3(person1);
```

### 其他属性注解

通过 interface 直接注解的类型无法传递对象字面量传递未注解的属性，可以使用定义其他变量的类型注解

```ts
interface Person6 {
  readonly name: string;
  age?: number;
  [propName: string]: any;
}
const fn3 = (person: Person6): void => {
  console.log(person.name);
  // person.name = 'test';
};
fn3({ name: 'xfy', sex: 'female' });
```

### 注解方法

除了注解指定的属性类型，还可以注解方法，并注解函数的返回值类型

```ts
interface Person6 {
  readonly name: string;
  age?: number;
  [propName: string]: any;
  say(): string;
}
const fn3 = (person: Person6): void => {
  console.log(person.name);
  // person.name = 'test';
};
fn3({
  name: 'xfy',
  sex: 'female',
  say() {
    return 'yyy';
  },
});
```

### 类

使用 implements 语法

```ts
interface Person6 {
  readonly name: string;
  age?: number;
  [propName: string]: any;
  say(): string;
}
class User2 implements Person6 {
  name: 'test';
  say() {
    return 'yyy';
  }
}

```

### 接口继承

接口继承的语法与类继承类似

```ts
interface Person7 {
  readonly name: string;
  age?: number;
  [propName: string]: any;
  say(): string;
}
interface Teach extends Person7 {
  teach(): void;
}
const test3 = (person: Teach): void => {};
test3({
  name: 'xfy',
  say() {
    return 'yyy';
  },
  teach() {},
});

```

## 类

TypeScript 中为类定义了多个声明关键字。帮助类声明公共与私有属性。

### public

默认情况下直接声明的属性是通过 public 声明的，即在外部也能正常访问该属性。

```ts
class Person {
  name = 'xfy';
  sayName() {
    return this.name;
  }
}

let xfy = new Person();
console.log(xfy.sayName());
console.log(xfy.name);
```

### private

private 与 public 相对立。通过 private 声明的属性只能在当前类的内部被访问到，即使是继承的子类也无法直接访问。

```ts
class Person {
  private name = 'xfy';
  sayName() {
    return this.name;
  }
}

let xfy = new Person();
console.log(xfy.sayName());
console.log(xfy.name); // Property 'name' is private and only accessible within class 'Person'.

class Teacher extends Person {
  say() {
    return this.name;  // Property 'name' is private and only accessible within class 'Person'.
  }
}

```

### protected

与 private 类型，protected 的属性也无法在外部被访问。但是可以在继承的子类中被访问到。

```ts
class Person {
  private name = 'xfy';
  sayName() {
    return this.name;
  }
}

let xfy = new Person();
console.log(xfy.sayName());
console.log(xfy.name); // Property 'name' is private and only accessible within class 'Person'.

class Teacher extends Person {
  say() {
    return this.name;  // ok
  }
}

```

### constructor

与 JavaScript 的 constructor 不同的是，在 TypeScript 中 constrcutor 需要先在类中定义对应的 public 属性。

```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
let xfy = new Person('xfy');
console.log(xfy.name);
```

为了方便起见，TypeScript 也有简写 constructor 参数的方法。并且不需要再在内部添加`this.name`了。编译器会帮我们自动生成。

```ts
class Person {
  // name: string;
  constructor(public name: string) {
    // this.name = name;
  }
}
let xfy = new Person('xfy');
console.log(xfy.name);

```

constructor 继承时的用法与传统 JavaScript 类似。

```ts
class Person {
  // name: string;
  constructor(public name: string) {
    // this.name = name;
  }
}
let xfy = new Person('xfy');
console.log(xfy.name);

class Teacher extends Person {
  constructor(name: string, public age: number) {
    super(name);
  }
}
let t = new Teacher('xfy', 18);

```

> 即使父类没有 constructor，子类继承时也需要调用`super()`

### 抽象类

在定义多个有相似方法的类时，可以定义一个抽象类来为同样的方法注解类型。抽象类中也可以包含实际的内容。

```ts
abstract class Geo {
  width: number;
  abstract getAare(): number;
}

class Circle extends Geo {
  // width = '123';
  width = 123;
  getAare() {
    return 123;
  }
}
class Square extends Geo {
  getAare() {
    return 123;
  }
}
class Triangle extends Geo {
  getAare() {
    return 123;
  }
}

```

## 单例模式

单例模式（Singleton Pattern）是多数编程软件中常用的设计模式。通过 TypeScript 就可以为 JavaScript 创建一个单例模式的类。

这里通过 private 将 constructor 隐藏在类的内部。在类体上暴露一个方法`getInstance()`，通过这个方法来获取唯一的实例。同时在类体上还定义一个 private 属性 instance，它的类型注解就是该类。每次调用`getInstance()`方法时，通过检查 instance 是否有值，没有就创建一个新的实例，并缓存在 instance 内。后续直接返回 instance。这样就能够保证后续创建的实例都是同一个实例。

```ts
class Demo {
  private static instance: Demo;
  private constructor(public name: string) {}
  static getInstance(name: string) {
    if (!Demo.instance) {
      Demo.instance = new Demo(name);
    }
    return Demo.instance;
  }
}
let t1 = Demo.getInstance('xfy');
let t2 = Demo.getInstance('dfy');
console.log(t1.name);
console.log(t2.name);
console.log(t1 === t2);

```

## .d.ts

传统的 js 在被引入到 ts 中无法正确的被推断出类型。需要使用`.d.ts`已经注解好类型的文件来转译。

通常在 @types 里`https://www.npmjs.com/package/@types`

### 定义全局

```ts
$(function () {
    $('body').html('<h1>Hi, there</h1>')
})
```

```ts
// 全局变量
declare var $: (param: () => void)  => void;
```

```ts
interface JqueryInstance {
    html: (content: string) => {}
}
// 函数重载
declare function $(param: () => void): void;
declare function $(patam: string): JqueryInstance;
```

## 函数重载

使用 interface 的语法，实现函数重载

```ts
interface JQuery {
    (param: () => void): void;
    (patam: string): JqueryInstance;
}
declare var $: JQuery;
```

## tsconfig

使用`tsc --init`初始化一个项目时，会自动生成一个带有注释的`tsconfig.json`配置文件。这个文件就是对 TypeScript 编译的一些配置文件。

一个默认的配置文件可能是这样的：

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                         /* Enable incremental compilation */
    "target": "ESNEXT",                                /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                                   /* Specify library files to be included in the compilation. */
    // "allowJs": true,                             /* Allow javascript files to be compiled. */
    // "checkJs": true,                             /* Report errors in .js files. */
    // "jsx": "preserve",                           /* Specify JSX code generation: 'preserve', 'react-native', 'react', 'react-jsx' or 'react-jsxdev'. */
    // "declaration": true,                         /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                      /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                           /* Generates corresponding '.map' file. */
    // "outFile": "./",                             /* Concatenate and emit output to single file. */
    // "outDir": "./",                              /* Redirect output structure to the directory. */
    // "rootDir": "./",                             /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                           /* Enable project compilation */
    // "tsBuildInfoFile": "./",                     /* Specify file to store incremental compilation information */
    // "removeComments": true,                      /* Do not emit comments to output. */
    // "noEmit": true,                              /* Do not emit outputs. */
    // "importHelpers": true,                       /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,                  /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,                     /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                                 /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                       /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                    /* Enable strict null checks. */
    // "strictFunctionTypes": true,                 /* Enable strict checking of function types. */
    // "strictBindCallApply": true,                 /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,        /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                      /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                        /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                      /* Report errors on unused locals. */
    // "noUnusedParameters": true,                  /* Report errors on unused parameters. */
    // "noImplicitReturns": true,                   /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,          /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,            /* Include 'undefined' in index signature results */
    // "noPropertyAccessFromIndexSignature": true,  /* Require undeclared properties from index signatures to use element accesses. */

    /* Module Resolution Options */
    // "moduleResolution": "node",                  /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                             /* Base directory to resolve non-absolute module names. */
    // "paths": {},                                 /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                              /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                             /* List of folders to include type definitions from. */
    // "types": [],                                 /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,        /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,                    /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,                /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                            /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                               /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                     /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                       /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,              /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,               /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  }
}

```

仔细看的话，配置文件内主要包含一个大的字段`"compilerOptions"`，这是针对编译时的配置。对文件的配置还有`include`和`exclude`：

```json
{
  "exclude": ["./src/config.ts"],
  "compilerOptions": {
	// ...
  }
}

```

## 联合类型与类型保护

当定义了多个 interface 需要同时使用时，可以使用`|`运算符来同时使用。但是这样也会遇到一个小问题，同时使用两个 interface 时，语法提示只会提示二者共有的类型注解。

因为不能保证传入的参数一定会拥有独有的属性

```ts
interface Bird {
  fly: boolean;
  sing: () => {};
}
interface Dog {
  fly: boolean;
  bark: () => {};
}

function trainAnimal(animal: Bird | Dog) {
  console.log(animal);
}
```

![image-20210329172943170](../images/TypeScript%E4%B8%B4%E7%A2%8E%E7%AC%94%E8%AE%B0/image-20210329172943170.png)

### 类型保护

类型保护有多个方法，作用就是在特定情况下访问独有的属性。

#### 类型断言

断言的目的就是在当前情况下，我非常清楚指定传进来的参数有指定的参数。

假设在当前例子里，参数中的`fly`属性只要为`true`时，就一定能确定是`Bird`接口的类型。那么就可以断言为：

```ts
interface Bird {
  fly: boolean;
  sing: () => {};
}
interface Dog {
  fly: boolean;
  bark: () => {};
}

function trainAnimal(animal: Bird | Dog) {
  if (animal.fly) {
    (animal as Bird).sing();
  }
}
```

#### `in`语法

可以直接判断属性是否存在于当前实例中，TypeScript 会直接推断出对应的接口。

```ts
function trainAnimalSecond(animal: Bird | Dog) {
  if ("sing" in animal) {
    animal.sing();
  }
}
```

#### `typeof`语法

和使用`in`语法类型，`typeof`语法也能让 TypeScript 做出正确的类型推断。

```ts
function addSomething(firstNum: string | number, secondNum: string | number) {
  if (typeof firstNum === "string" || typeof secondNum === "string") {
    return `${firstNum}${secondNum}`;
  }
  return firstNum + secondNum;
}
```

## 枚举类型

```ts
enum Status {
  ONLINE,
  OFFLINE,
  DELETED,
}

function getDetail(status: Status) {
  switch (status) {
    case Status.ONLINE:
      console.log("online!");
      break;
    case Status.OFFLINE:
      console.log("offline!");
      break;
    case Status.DELETED:
      console.log("deleted!");
      break;
  }
}

getDetail(0);
```

## 函数泛型

泛指的类型（generic）。通俗的说，就是不专门注解函数的参数为指定的某一个类型，函数可以接受多个类型，但参数的类型必须统一。

```ts
function join<T>(first: T, second: T): string {
  return `${first}${second}`;
}

join<string>("1", "2");
```

也可以为指定数组内的属性指定泛型

```ts
// function map<T>(params: Array<T>) {
//   return params;
// }
function map<T>(params: T[]) {
  return params;
}
map<number>([1, 2, 3]);
```

泛型还支持多个类型

```ts
function join<T, Y>(first: T, second: Y): string {
  return `${first}${second}`;
}

join<string, number>("1", 2);
```

函数的返回类型也可以使用泛型。

### 类中的泛型

类也是同样的可以定义泛型

```ts
class DataManager<T> {
  constructor(private data: T[]) {}
  getItem(index: number) {
    return this.data[index];
  }
}
const myData = new DataManager<number>([1, 2, 3]);
console.log(myData.getItem(2));
```

### 泛型的继承

泛型可以继承自接口

```ts
interface Item {
  name: string;
}

class DataManager<T extends Item> {
  constructor(private data: T[]) {}
  getItem(index: number): string {
    return this.data[index].name;
  }
}
const myData = new DataManager([
  {
    name: "xfy",
  },
]);
console.log(myData.getItem(0));
```

### 作为类型注解

泛型也可以作为一个具体的类型注解

```ts
const xfy = <T>(params: T): T => {
  return params;
};
```

## namespace

命名空间，可以直接为指定的代码生成作用域。并导出需要的代码。

```ts
namespace Home {
  class Header {
    constructor() {
      const header = document.createElement("header");
      header.textContent = `Here is head.`;
      document.body.append(header);
    }
  }
  class Content {
    constructor() {
      const div = document.createElement("div");
      div.textContent = `Here is content.`;
      document.body.append(div);
    }
  }
  class Footer {
    constructor() {
      const footer = document.createElement("footer");
      footer.textContent = `© 2021 xfy`;
      document.body.append(footer);
    }
  }
  export class Page {
    constructor() {
      new Header();
      new Content();
      new Footer();
    }
  }
}
```

命名空间也可以在多个文件之间相互导入导出，就和模块系统类似。但使用了命名空间之间的互相导入之后，需要在`tsconfig.json`中修改模块系统为`amd`或`system`。

使用依赖注释：

```ts
///<reference path='./test.ts' />
```

