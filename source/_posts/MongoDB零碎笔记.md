---
title: MongoDB零碎笔记
date: 2021-06-07 18:08:31
tags: JavaScript
categories: 笔记
url: mongodb-notes
index_img: 
---

## 数据结构

数据库

集合

文档

## 插入数据

集合为自动创建

选中数据库，如果不存在则自动创建：

```bash
use test
# 'switched to db test'
```

如果不添加数据则数据库不显示

```bash
show dbs
admin     41 kB
config  61.4 kB
local     41 kB
```

集合不需要手动进行创建，直接插入数据会自动创建集合

```bash
db.names.insertOne({name:'xfy'})
{ acknowledged: true,
  insertedId: ObjectId("60371efde948e229844958fb") }
```

## 数据重复时

当数据重复时，mongodb使用`_id`来区分数据。如果没有手动插入`_id`，则会自动生成一个 id。也可以手动插入。二者不相同。

id 不可修改。

## 关系型数据库

### ACID 设计模式

A（**A**tomicity）：原子性。事务里所做的操作要么全部做完，要么都不做。

C（**C**onsistency）：一致性。数据库要一直处于一致的状态，事务的运行不会改变数据库原本的一致性约束。

I（**I**solation）：独立性。并发的事务之间不会互相影响。

D（**D**urability）：持久性。事务一旦提交后，所作的修改将会永久的保存在数据库上。

事物：一次性执行多条 SQL 语句的操作。

这四个特性是关系型数据库要同时满足的。

## 非关系型数据库

### CAP 定理

在[理论计算机科学](https://zh.wikipedia.org/wiki/理論計算機科學)中，**CAP定理**（CAP theorem），又被称作**布鲁尔定理**（Brewer's theorem），它指出对于一个[分布式计算系统](https://zh.wikipedia.org/wiki/分布式计算)来说，不可能同时满足以下三点：

- 一致性（**C**onsistency） （等同于所有节点访问同一份最新的数据副本）
- [可用性](https://zh.wikipedia.org/wiki/可用性)（**A**vailability）（每次请求都能获取到非错的响应——但是不保证获取的数据为最新数据）
- [分区容错性](https://zh.wikipedia.org/w/index.php?title=网络分区&action=edit&redlink=1)（**P**artition tolerance）（以实际效果而言，分区相当于对通信的时限要求。系统如果不能在时限内达成数据一致性，就意味着发生了分区的情况，必须就当前操作在C和A之间做出选择。）

![1_Br1FrvKnK3hU6Xl_LbDkwg](images/MongoDB%E9%9B%B6%E7%A2%8E%E7%AC%94%E8%AE%B0/1_Br1FrvKnK3hU6Xl_LbDkwg.webp)

### NoSQL 技术优势

根据 CAP 的核心定义，可以将 CAP 分成三个部分：CA、CP、AP。

NoSQL 很好的融合了 CA、CP、AP 定理：

* CA：单点集群，满足一致性，可用性的系统，通常在可扩展性上不够强大。
* CP：满足一致性，分区容错性的系统，通常在性能上不是特别高。
* AP：满足可用性，分区容错性的选题，通常可能对一致性要求低一些。

### 优点与缺点

* 优点：
  * 高可扩展性*
  * 分布式计算
  * 低成本
  * 架构的灵活性，半结构化数据
  * 没有复杂的关系
* 缺点：
  * 没有标准化
  * 有限的查询功能（目前）

## MongoDB

### 基本概念

文档：是一组键值对（key-value）即（BSON）。

需要注意：

* 文档中的键值对是有序的；
* 文档中的值可以是多种类型；
* MongoDB 区分类型和大小写；
* 同一个文档中不能有重复的键；
* 文档中的键是字符串。

> 键值对需要注意的部分和 JavaScript 的对象很类似。

集合：MongoDB 集合组，类似于 RDBMS（关系数据库管理系统：Relational Database Management System）中的表格。

集合命名需要注意：

* 集合名不能是空字符串；
* 集合名不能含有`\0`字符串（空字符串），这个字符表示集合名的结尾；
* 集合名不能以`system.`开头，这是为系统保留的前缀；
* 用户创建的集合名不能含有保留字符。

### 术语

| SQL术语/概念 | MongoDB术语/概念 | 解释/说明                           |
| :----------- | :--------------- | :---------------------------------- |
| database     | database         | 数据库                              |
| table        | collection       | 数据库表/集合                       |
| row          | document         | 数据记录行/文档                     |
| column       | field            | 数据字段/域                         |
| index        | index            | 索引                                |
| table joins  |                  | 表连接,MongoDB不支持                |
| primary key  | primary key      | 主键,MongoDB自动将_id字段设置为主键 |

### 系统保留数据库

1. admin：“root” 数据库
2. local：这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合。
3. config：当 mongdo 用于分片时，config 数据库在内部使用，用于保存分片的相关的信息。

### 创建集合

使用`createCollection()`方法来创建集合。

```js
db.createCollection(name, options);
```

options 参数：

| 字段        | 类型 | 描述                                                                                                                                                     |
| :---------- | :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capped      | 布尔 | （可选）如果为 true，则创建固定集合。固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。 **当该值为 true 时，必须指定 size 参数。** |
| autoIndexId | 布尔 | 3.2 之后不再支持该参数。（可选）如为 true，自动在 _id 字段创建索引。默认为 false。                                                                       |
| size        | 数值 | （可选）为固定集合指定一个最大值，即字节数。 **如果 capped 为 true，也需要指定该字段。**                                                                 |
| max         | 数值 | （可选）指定固定集合中包含文档的最大数量。                                                                                                               |

### 集合其他操作

查看当前库中的所有集合

```js
show collections
```

删除集合

```js
db.games.drop()
```

### 数据类型

MongoDB支持以下数据类型:

- **String（字符串）**: mongodb中的字符串是UTF-8有效的。
- **Integer（整数）**: 存储数值。整数可以是32位或64位，具体取决于您的服务器。
- **Boolean（布尔）**: 存储布尔(true/false)值。
- **Double（双精度）**: 存储浮点值。
- **Min/ Max keys（最小/最大键）**: 将值与最低和最高BSON元素进行比较。
- **Arrays（数组）**: 将数组或列表或多个值存储到一个键中。
- **Timestamp（时间戳）**: 存储时间戳。
- **Object（对象）**: 嵌入式文档。
- **Null （空值）**: 存储Null值。
- **Symbol（符号）**: 与字符串相同，用于具有特定符号类型的语言。
- **Date（日期）**: 以UNIX时间格式存储当前日期或时间。
- **Object ID（对象ID）** : 存储文档ID。
- **Binary data（二进制数据）**: 存储二进制数据。
- **Code（代码）**: 将JavaScript代码存储到文档中。
- **Regular expression（正则表达式）**: 存储正则表达式

### 更新数据

语法：

```js
db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>,
     collation: <document>,
     arrayFilters: [ <filterdocument1>, ... ],
     hint:  <document|string>        // Available starting in MongoDB 4.2
   }
)
```

`updateMany`就相当于`update`使用了`multi: true`这个可选属性

```js
use test
db.user.find();

db.user.insertMany(
    [
        {name: 'xfy',age:18,sex:'man'},
        {name: 'xfy1',age:12,sex:'man'},
        {name: 'xfy2',age:16,sex:'man'},
        {name: 'xfy3',age:19,sex:'man'},
        {name: 'xfy4',age:28,sex:'man'},
    ]
)

db.user.updateOne(
    {age: 18},
    {$set:{name:'dfy'}}
)

db.user.findOne({name:'dfy'})

db.user.updateMany(
    {sex:'man'},
    {$set:{sex:'woman'}}
)
```

#### 多个条件

`update`时，如果有多个条件，则默认是需要所有条件都满足。类似于 sql 中的 `and`连接。

```js
db.user.updateOne(
    {name:'xfy',age:18},
    {$set:{name:'dfy'}}
)
```

如果需要满足其中一个条件，需要使用`$or`操作符

```js
db.user.updateOne(
    {$or:[name:'xfy',age:18]},
    {$set:{name:'dfy'}}
)
```

### 删除文档

删除使用`remove()`方法。接受一个参数`justOne`，为`true`时，只删除一个文档。否则删除匹配到的所有文档。默认为`false`

```js
db.collection.remove(
   <query>,
   <justOne>
)
```

还有其他选项

```js
db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>,
     collation: <document>
   }
)
```

删除集合中的所有数据

```js
db.collectionName.remove({})
```

### 查询文档

查询集合中的文档使用`find()`方法。

```js
db.collection.find()
```

在没有添加查询条件的情况下，`find()`方法默认会返回所有的数据。但返回的数据是未格式化的。使用`pretty()`以格式化显示。

```js
db.collection.find().pretty()
```

`findOne()`默认就只返回一条数据（查询到的第一条），并且就是格式化显示的，所以不能使用`pretty()`方法。

```js
db.user.findOne().pretty()
// TypeError: (intermediate value).pretty is not a function
```

#### 条件查询

多个条件同时满足的查询。和更新数据类似，传入多个条件时，默认为同时都需要满足。

```js
db.user.find({name:'xfy',age:18})
```

同理，满足单个条件时，使用`$or`操作符

```js
db.user.find({$or:[{name:'xfy'},{age:18}]})
```

### 条件操作符

条件操作符用于比较两个表达式，并从 mongodb 集合中获取数据。

| $      | Symbol | Words                    |
| :----- | :----- | :----------------------- |
| `$gt`  | >      | greater than             |
| `$lt`  | <      | less than                |
| `$gte` | ≥      | greater than or equal to |
| `$lte` | ≤      | less than or equal to    |
| `$ne`  | !=     | not equal                |

```js
db.user.find()

db.user.updateMany({name:'dfy',age:18}, {$set:{name:'xfy'}})

db.user.find({$or:[{name:'xfy'},{age:18}]})

db.user.find(
    {age:{$lt:18}}
)

db.user.find(
    {age:{$gte:12,$lte:18}}
)

db.user.find(
    {$or:[{
        age:{$lt: 12}
        },
        {
        age:{$gt: 18}
        }
    ]}
)

db.user.find(
    {age:{$gt: 20},$or:[{name:'xfy4'}]}
)
```

### 按类型查询

`$type`：用来根据类型来匹配对应的结果。

`limit()`方法：用来指定读取集合中数据的记录数量。

```js
db.user.find({age:18}).limit(2)
```

`skip()`方法：用来跳过指定数量的记录。默认为 0

### 排序查询

`sort()`方法可以通过参数指定排序的字段。使用参数`1`升序排列，使用`-1`降序排列。

```js
db.user.find({age:{$type: 'number'}}).sort({age: -1})
```

### 聚合操作

管道

- `$project`：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
- `$match`：用于过滤数据，只输出符合条件的文档。$match使用MongoDB的标准查询操作。
- `$limit`：用来限制MongoDB聚合管道返回的文档数。
- `$skip`：在聚合管道中跳过指定数量的文档，并返回余下的文档。
- `$unwind`：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
- `$group`：将集合中的文档分组，可用于统计结果。
- `$sort`：将输入文档排序后输出。
- `$geoNear`：输出接近某一地理位置的有序文档。

表达式

| 表达式    | 描述                                           | 实例                                                                                  |
| :-------- | :--------------------------------------------- | :------------------------------------------------------------------------------------ |
| $sum      | 计算总和。                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}]) |
| $avg      | 计算平均值                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}]) |
| $min      | 获取集合中所有文档对应值得最小值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}]) |
| $max      | 获取集合中所有文档对应值得最大值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}]) |
| $push     | 在结果文档中插入值到一个数组中。               | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}])            |
| $addToSet | 在结果文档中插入值到一个数组中，但不创建副本。 | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}])       |
| $first    | 根据资源文档的排序获取第一个文档数据。         | db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}])    |
| $last     | 根据资源文档的排序获取最后一个文档数据         | db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}])      |

```js
db.sc.aggregate([
    {
        管道:{聚合操作表达式}
    }
])
```

例：以`sex`属性为分组，求和`grade`属性：

`_id`用来指定分组的字段

```js
db.sc.aggregate([
    {
        $group:{_id:'$sex', sumgrade:{$sum:'$grade'}}
    }
])
```

`$sum:1`用于计算整个文档数量

```js
db.sc.aggregate([{
    $group:{_id:'$sex', people:{$sum:1}}
    }])
```

管道处于平级状态，可以向下传递使用

```js
db.sc.aggregate([
    {
        $group:{_id: '$sex', renshu:{$sum: 1}}
        },
    {
        $sort: {renshu:1}
    }
])
```

### 查询指定字段

```
{
	_id: 123,
	data: {
		page: 1,
		list: [1,2,3,4,5]
	}
}
```

如上述只需要查询出指定`page`的`list `属性，可以直接使用`find()`方法的过滤（projection）操作。

projection 参数的使用方法

```js
db.collection.find(query, projection)
```

若不指定 projection，则默认返回所有键，指定 projection 格式如下，有两种模式

```js
db.collection.find(query, {title: 1, by: 1}) // inclusion模式 指定返回的键，不返回其他键
db.collection.find(query, {title: 0, by: 0}) // exclusion模式 指定不返回的键,返回其他键
```

因此：

```js
db.pop.find(
    {'data.page' : 1},
    {'data.list':1}
)
```

