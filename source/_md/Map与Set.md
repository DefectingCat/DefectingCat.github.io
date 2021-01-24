传统对象的键（key）只能是字符串

Map 的键（key）可以是任何类型的，不像对象一样只能是字符串。

```js
let map = new Map([
    [1, 'test'],
    ['1', 'str']
])
```

`map[key]`不是使用 Map 的正确方式，虽然`map[key]`也有效，例如我们可以设置`map[key] = 2`，这样会将 Map 视为 JavaScript 的 plain object，因此它暗含了所有相应的限制（没有对象键等）。所以我们应该使用 Map 方法：`set`和`get`等。

`map.set`方法每次都会返回 Map 本身，所以可以使用“链式”调用：

```js
let map = new Map();

map.set(obj, 'this is a object')
    .set('test', 12312313123)
    .set('obj', obj)
```

## Map 迭代

Map 有三种迭代方法

* `map.keys()` —— 遍历并返回所有的键（returns an iterable for keys），
* `map.values()` —— 遍历并返回所有的值（returns an iterable for values），
* `map.entries()` —— 遍历并返回所有的实体（returns an iterable for entries）`[key, value]`，`for..of`在默认情况下使用的就是这个。

这三个方法都是能够将 Map 键值迭代出来，同时它们自身也是可迭代的：

```js
for (let i of map.entries()) {
    console.log(i);
}
```

> 迭代的顺序与插入值的顺序相同。与普通的 Object 不同，Map 保留了此顺序。

### 从对象创建 Map

对象方法`Object.entries()`的返回格式正好与创建 Map 构造函数相同，因此可以使用该方法使用对象创建 Map。

```js
let obj = {
    name: 'xfy',
    age: 18
}

console.log(Object.entries(obj));
let map = new Map(Object.entries(obj));
console.log(map.get('age'));
```

### 从 Map 创建对象

`Object.fromEntries()`方法的作用是相反的，它可以从 Map 迭代返回的键值对中创建对象。并且具有各种类型的键会被转换为字符串。

```js
let test = 'xfy';

let map = new Map([
    [1, 3],
    [test, 4]
])

let obj = Object.fromEntries(map.entries());
console.log(obj);
```

Set

Set 是一个特殊的类型集合 —— “值的集合”（没有键），它的每一个值只能出现一次。

### Set 迭代

