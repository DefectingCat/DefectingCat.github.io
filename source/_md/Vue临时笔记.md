# P181

## 注入

配置对象中的部分内容会被提取到 Vue 实例中：

* `data`
* `methods`

该过程称之为注入。注入有两个目的：

1. 完成数据响应式
2. 绑定`this`

### 数据响应

Vue2.0 是通过`Object.defineProperty`方法完成了数据响应式，Vue3.0 是通过`Class Proxy`完成的数据响应式。

`Object.defineProperty`无法感知到新增属性。

### 绑定`this`

Vue 通过`bind`方法来将`methods`对象上的方法绑定到 Vue 实例上：`methods.saySomething.bind(vm)`

```js
methods: {
    saySomething() {
        let msg = prompt('say something?', '嘤嘤嘤');
        this.msg = msg
    }
}
```

## 虚拟 DOM 树

**为了提高渲染效率**，Vue 会把模板编译成为虚拟 DOM 树，然后再生成真实的 DOM 树。

![image-20201231161102847](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20201231161102847.png)

`vm._vnode`查看虚拟节点。

当数据更改时，将重新编译成虚拟 DOM 树，然后对前后两颗树进行比较，仅将差异部分反映到真实 DOM。这样可以最小程度的改变真实 DOM，提升页面渲染效率。（使用 diff 算法）

![image-20210101182057486](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210101182057486.png)

虚拟节点不相等，但是只修改内容，真实 DOM 在修改前后是相等的。

```js
let v1 = vm._vnode
vm.msg = 123
let v2 = vm._vnode
v1 === v2  // false
v1.elm === v2.elm  // true
```

因此，相对于 Vue 而言，效率提升着重于两个方面：

1. 减少新的虚拟 DOM 生成
2. 保证对比之后，只有必要的节点变化

Vue 提供了多种方式生成虚拟 DOM 树：

1. 在挂载的元素内部直接书写，此时将使用元素的`outerHtml`作为模板
2. 在`template`配置中书写
3. 在`render`方法中直接创建虚拟节点树，此时，完全脱离模板，将省略编译步骤

上述步骤从上到下，优先级逐渐提升。

> 注意：虚拟节点树必须是单根的。
>
> 模板只能有一个根节点， 模板是为了生成虚拟节点，而虚拟节点因为 diff 算法只能是单根的

## 挂载

将生成的真实 DOM 树，放到一个元素位置上（替换），称之为**挂载**

挂载的方式：

1. 通过`el: css选择器`进行选择
2. 通过`vue 实例.$mount('css选择器')`进行配置

## 完整流程

![image-20210101205600400](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210101205600400.png)



## 模板语法

### 内容

Vue 中的元素内容使用 mustache 模板引擎进行解析。`{{ title }} = {{ vm.title }}`

### 指令

指令会影响元素的渲染行为，指令始终以`v-`开头

一些基础指令：

* `v-for`：循环渲染元素
* `v-html`：设置元素的`innerHtml`，该指令会导致元素的模板内容失败
* `v-on`：注册事件
  * 该指令由于十分常用，因此提供了简写`@`
  * 事件支持一些指令修饰符，如`prevent`
  * 事件参数会自动传递
* `v-bind`：绑定动态属性
  * 该指令由于十分常用，因此提供了简写`:`
* `v-show`：控制元素可见度
* `v-if`、`v-else-if`、`v-else`：控制元素生成
* `v-model`：双向数据绑定，常用于表单元素
  * 该指令是`v-on`和`v-bind`的复合版

 `v-for`循环

data 里存储循环数组，变量`item` in `products`。`v-for`还支持第二个参数，即当前项的索引。

```html
<li v-for="item in products">
    
    let vm = new Vue({
        el: '#app',
        data: {
            msg: '测试',
            products: [
            { name: 'iphone', stock: 10},
            { name: 'xiaomi', stock: 10},
            { name: 'huawei', stock: 10},
            { name: 'vivo', stock: 10}
        ]}
    })
```

同时`v-for`也支持对象，同样也支持一个下标为`key`。

```html
    <body>
        <div id="app">
            <ul>
                <li v-for="(item, name) in obj">{{name}}：{{item}}</li>
            </ul>
        </div>
    </body>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                obj: {
                    test: "test",
                    name: "xiaofeiyang",
                    age: 18,
                    balabala: "!@@##$$%^^&",
                },
            },
        });
    </script>
```

`v-for`循环对象时总共支持三个参数：

```html
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
```

 `v-html`

```js
<div id="app" v-html="html"></div>

let vm = new Vue({
    el: '#app',
    data: {
        html: '<span style="color: red">this is a test</span>'
    }
})
```

`v-on`绑定事件修饰符

```js
<body>
    <div id="app">
        <a href="https://www.defectink.com" @click.prevent="test">点击我</a>
    </div>
</body>
<script>
    let vm = new Vue({
        el: '#app',
        methods: {
            test() {
                console.log('test');
            }
        }
    })
```

`v-show`与`v-if`本质区别就是：`v-show`使用 css 控制 DOM 元素还是在文档上，`v-if`控制 DOM 是生成在文档上。

### `v-model`的手动实现

首先先实现单向绑定

```html
<body>
    <div id="app">
        <h1>{{txt}}</h1>
        <input type="text" :value="txt">
    </div>
    
</body>
<script>
    let vm = new Vue({
        el: '#app',
        data: {
            txt: 'this is a test'
        }
    })
</script>
```

然后通过 Event 事件对象实现双向绑定：

```html
<body>
    <div id="app">
        <h1>{{txt}}</h1>
        <input type="text" :value="txt" @input="txt=$event.target.value">
    </div>
    
</body>
<script>
    let vm = new Vue({
        el: '#app',
        data: {
            txt: 'this is a test'
        }
    })
</script>
```

### 特殊属性（维护状态）

`key`属性用来干预 diff 算法，在同一层级，`key`值相同的节点会进行比对，`key`不同的节点则不会。

例如：在下面两个`div`中分别有两个相同的`input`。当切换时，diff 算法会检测两个`input`是否一样，来决定`input`是否需要重新编译。

这样就会导致一个问题，当在`input`中输入了一些数据时，默认 diff 算法不会重新编译`input`，导致切换时数据依然在。

```html
<body>
    <div id="app">
        <div v-if="ifMoble">
            <label>手机号：</label>
            <input type="text">
        </div>
        <div v-else>
            <label>邮箱：</label>
            <input type="text">
        </div>
        <button @click="sw">切换登录方式</button>
    </div>
</body>
<script>
    let vm = new Vue({
        el: '#app',
        data: {
            ifMoble: true
        },
        methods: {
            sw() {
                this.ifMoble = this.ifMoble ? false : true;
            }
        }
    })
</script>
```

为两个`input`都添加了不同的`key`值后，就可以影响到 diff 算法，重新编译`input`。

```html
        <div v-if="ifMoble">
            <label>手机号：</label>
            <input type="text" key="1">
        </div>
        <div v-else>
            <label>邮箱：</label>
            <input type="text" key="2">
        </div>
```

Vue 强烈建议为每个循环生成的节点提供一个**唯一**且**稳定**的 key 值。

## 计算属性

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。使用`computed`来定义一个方法返回计算属性：

```vue
<body>
    <div id="app">
        <p>姓：{{firstName}}</p>
        <p>名：{{lastName}}</p>
        <p>全名：{{fullName}}</p>
    </div>
</body>
<script>
    let vm = new Vue({
        el: '#app',
        data: {
            firstName: '小',
            lastName: '肥羊'
        },
        computed: {
            fullName() {
                return this.firstName + this.lastName;
            }
        }
    })
</script>
```

### 与`methods`区别

使用计算属性来计算实例的属性时是拥有缓存的，而`methods`会重复调用。

* 计算属性可以赋值，而方法不行
* 计算属性会进行缓存，如果依赖不变，则直接使用缓存结果，不会重新计算
* 凡是根据已有数据计算得到的新数据的无参函数，都应该尽量写成计算属性，而不是方法

### 赋值

`computed`可以使用`get`和`set`方法来对计算的属性进行赋值。

```vue
      computed: {
        fullName: {
          get() {
            return this.firstName + this.lastName;
          },
          set(val) {
            return this.lastName = val
          }
        },
```

## 组件概念

一个完整的网页是复杂的，如果将其作为一个整体来进行开发，将会遇到种种困难

* 代码凌乱臃肿
* 不易协作
* 难以复用

Vue 推荐使用一种更加精细的控制方案——组件化开发

组件化开发就是将一个页面中的区域功能细分，每一个区域成为一个组件，每个组件包含：

* 功能（JavaScript）
* 结构（模板）
* 样式（CSS）

> 由于没有构建工具的支撑，css 代码暂时无法放到组件中。

## 组件开发

组件化开发：将整个页面划分为多个组件组合，每个组件都用于实现一个特定功能。基本组件还可以加以重复利用。

### 创建组件

组件是根据一个普通的配置对象创建的，该配置对象和 Vue 实例几乎一模一样

```vue
        let MyComp = {
            data() {
                return {
                    msg: "小小小肥羊",
                };
            },
            computed: {
                // ...
            },
            methods: {
                // ...
            },
            template: `<h1>{{msg}}</h1>`
        };
```

当然它们之间还是有所差异的：

* 组件没有`el`
* `data`必须是一个函数，该函数返回的对象作为数据
* 由于没有`el`配置，组件的虚拟 DOM 树必须定义在`template`或`render`中

### 注册组件

组件的注册分为两种方式：全局注册和局部注册。

#### 全局注册

一旦注册了一个全局组件，整个应用任何地方都可以使用这个组件。

![image-20210106100920795](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210106100920795.png)

全局注册使用一个方法进行注册：

```vue
Vue.component("MyComp", [MyComp]);
```

它接受两个参数：：

* 参数1：组件名称，将来在模板中使用时，会使用该名称；
* 参数2：组件配置对象

> 在一些工程化的大型项目中，很多组件都不需要进行全局注册。因此，除非组件特别通用，否则不建议全局注册。

#### 局部注册

局部注册就是在哪里使用，就在哪里注册

![image-20210106101456188](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210106101456188.png)

局部注册的方式是通过在要使用组件的组件或实例中添加一个`components`的配置：

```vue
        let Title = {
            data() {
                return {
                    msg: "小肥羊",
                    age: 18,
                };
            },
            computed: {
                full() {
                    return this.msg + this.age;
                },
            },
            template: `<div><h1>{{msg}}</h1>
                    <h2>{{age}}</h2>
                    <p>{{full}}</p></div>`,
        };
        let vm = new Vue({
            el: "#app",
            components: {
                Title,
            },
            template: ` <Title></Title>`,
        }); 
```

### 应用组件

在模板中使用组件非常简单，把组件名作为 HTML 标签使用即可。

但依然有值得注意的地方：

1. 组件必须结束

组件可以自结束，也可以使用标记结束，但必须要有结束：

```html
<MyComp></MyComp>
<MyComp />
```

2. 组件的命名

无论使用哪种方式来注册组件，组件的命名都需要遵循规范。组件可以使用 Kebab-case 短横线命名法，也可以使用 PascalCase 大驼峰命名法。

```js
let otherComp = {
    components: {
        "my-comp": myComp,
    	MyComp: myComp
    }
}
```

> 实际上使用小驼峰命名法也是可以识别的，只不过不符合官方要求的规范。

### 模板抽离写法

使用单独的`<script>`标签作为组件的`template`

```js
  <script type="text/x-template" id="com1">
  <div>
    <h1>我是高贵的 HeadLine 1</h1>
    <p>无敌螺旋小肥羊</p>
  </div>
  </script>
  <script>
    let vm = new Vue({
      el: '#app',
      components: {
        com1: {
          template: '#com1',
        }
      }
    });
  </script>
```

还可以使用单独的`<template>`标签作为模板：

```js
  <template id="com2">
    <div>
      <h1>我是高贵的 HeadLine 1</h1>
      <p>无敌螺旋小肥羊</p>
    </div>
  </template>
  <script>
    let vm = new Vue({
      el: '#app',
      components: {
        com1: {
          template: '#com2',
        }
      }
    });
  </script>
```



## 组件树

## 插值

### Attribute

对于布尔 attribute (它们只要存在就意味着值为 `true`)，`v-bind` 工作起来略有不同，

```html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

如果 `isButtonDisabled` 的值是 `null`、`undefined` 或 `false`，则 `disabled` attribute 甚至不会被包含在渲染出来的 `<button>` 元素中。

### 使用 JavaScript 表达式

有个限制就是，每个绑定都只能包含**单个表达式**，所以下面的例子都**不会**生效。

```html
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

> 模板表达式都被放在沙盒中，只能访问[全局变量的一个白名单](https://github.com/vuejs/vue/blob/v2.6.10/src/core/instance/proxy.js#L9)，如 `Math` 和 `Date` 。你不应该在模板表达式中试图访问用户定义的全局变量。

## 数组更新检测

### 变更方法

Vue 将被侦听的数组的变更方法进行了包裹，使用这些方法时，将会触发虚拟 DOM 树的更新：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### 替换数组

使用一些返回新数组的方法时：`filter()`、`concat()` 和 `slice()`，Vue 不会放弃整个 DOM 树而重新渲染。

## 事件

* 如果方法没有额外参数，可以不添加`()`
  * 如果方法本身接受一个参数，那么默认会将原生事件`event`传递
* 如果需要传递参数的同时传递`event`事件，可以使用`$event`代替

### 事件传递

在不传递的参数的情况下，绑定的 DOM 事件默认会传送一个事件对象的参数：

```html
    <body>
        <div id="app">
            <button @click="doSomething">Click Me!</button>
        </div>
    </body>
    <script>
        let vm = new Vue({
            el: '#app',
            data: {
                msg: 'test'
            },
            methods: {
                doSomething(e) {
                   console.log(e);
                }
            },
        })
    </script>
```

### 为什么在 HTML 中监听事件？

1. 扫一眼 HTML 模板便能轻松定位在 JavaScript 代码里对应的方法。
2. 因为你无须在 JavaScript 里手动绑定事件，你的 ViewModel 代码可以是非常纯粹的逻辑，和 DOM 完全解耦，更易于测试。
3. 当一个 ViewModel 被销毁时，所有的事件处理器都会自动被删除。你无须担心如何清理它们。

### 事件修饰符

* `.stop`：阻止冒泡；
* `.prevent`：阻止默认事件；

## 组件基础

组件本身的`data`为一个函数，返回的是一个对象

![image-20210113105705013](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210113105705013.png)

### 向子组件传递数据

在注册子组件的时候可定义一个`props`属性，用于接受来自父组件所传递的数据。如果是全局注册的组件也能够接受来自 Vue 实例所传递的数据。

`props`的值有两种方式：

1. 字符串数组，数组中的字符串就是传递时的名称；
2. 对象，对象可以设置传递时的类型，也可以设置默认值。

```js
      props: {
        clists: Array,
        cmsg: {
          type: String,
          default: 'test',
          required: true
        }
      },
```

**驼峰标识**，由于 HTML 标签对大小写是不敏感的，所以在子组件中定义驼峰标识时，在 HTML 中需要使用横杆写法。

**每个组件必须是单根元素。**

### 监听子组件事件

子组件可以通过一个内建的 `$emit`方法来传入事件名，并触发一个事件：

```html
<test-xfy @welcome="sayHi" :msg="msg"></test-xfy>
<button @click="$emit('welcome')">{{msg}}</button>
```

`$emit`方法内传递的事件名称必须使用引号。

还支持额外参数用来传递事件参数

```html
<test-xfy @welcome="sayHi" :msg="msg"></test-xfy>
<button @click="$emit('welcome', name)">{{msg}}</button>

            methods: {
                sayHi(name) {
                    alert(`Hi, ${name}`)
                }
            },
```

当在父级组件监听这个事件的时候，我们可以通过 `$event` 访问到这个被传递的参数：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

## Prop

### 单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态。

并且，每次父组件发生变更时，子组件中所传递的所有 props 都会刷新为最新的值。这就意味着不应该在子组件内部修改 props。

当然，也有变更 props 的情形：

1. 使用 prop 来向子组件传递一个初始的值，**这个子组件接下来希望将其作为一个本地的 prop 数据来使用。**在这种情况下，最好定义一个本地的 data property 并将这个 prop 用作其初始值：

```js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```

2. **这个 prop 以一种原始的值传入且需要进行转换。**在这种情况下，最好使用这个 prop 的值来定义一个计算属性：

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

> JavaScript 中直接修改引用值会影响到其本身，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身**将会**影响到父组件的状态。

## 自定义事件

## 动态绑定

### 对象语法

在使用`v-bind`绑定 class 时，可能需要动态的计算 class 的值。在绑定时可以使用对象语法来计算当值为`true`时，启用相应的 class：

```html
class = default
:class="{active: currentId == i.id}"
```

### 数组语法

在使用对象语法的时候，绑定的 class 需要与其默认的 Attribute class 分开来写。而使用数组语法的作用就是像数组一样可以写多个属性



## 双向绑定修饰符

### `.lazy`

在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步，可以添加一个`lazy`修饰符，从而转为在 `change` 事件_之后_进行同步（按下 enter 键，以及失去焦点）。

### `.number`

自动将输入的值转换为数值类型。默认使用`input type="number"`在进行双向绑定之后，接受的值都会被转换为字符串

### `.trim`

自动去除输入值的前后空格

## 组件互相访问

除了父子组件之间相互传递数据之外，父子组件之间还可以相互直接访问。

### 父组件访问子组件

父组件有两个方法可以访问子组件：

* `$chidren`：返回数组形式的所有子组件；
* `$refs`：返回对象形式的子组件，默认为空，只有在子组件添加了`ref='someName'`的 Attribute 才可以访问到子组件。

```js
<button @click="test">Click Me!</button>

          console.log(this.$refs.com1);
          this.$refs.com1.showMsg();
```

### 子组件访问父组件

子组件有一个方法访问父组件：

* `$parent`：返回父组件实例。

子组件还可以通过一个方法直接访问根组件 Vue 实例：

* `$root`：返回根组件。

## 插槽

Vue 在组件中提供了一个插槽

### 插槽的基本使用

在组件中使用一对`<slot></slot>`标签：

```html
  <template id="com1">
    <div>
      <h2>我是有共性的内容</h2>
      <slot><button>默认按钮</button></slot>
    </div>
  </template>
```

在实例中使用组件的时候，可以在组件标签内传递内容给插槽：

```html
      <com1>
        <p>我是代替默认按钮的 <code>p</code>标签</p>
      </com1>
```

### 后备内容

插槽可以设置默认值，在不传递任何内容时，显示插槽内的默认值。

```html
<slot><button>默认按钮</button></slot>
```

### 传递多个值

在组件内定义一对`<slot></slot>`标签时，如果在实例中传递多个值，插槽会同时显示多个值：

```html
      <com1>
        <p>我是代替默认按钮的 <code>p</code>标签</p>
        <span>同时还有其他标签传递</span><br>
        <i>リトルシープ</i>
      </com1>
```

### 具名插槽

当一个组件内有多个插槽且都不具名时，直接传递内容会导致所有插槽都被替换。

可以对每个插槽进行命名，从而针对组件内指定的插槽进行替换：

```html
  <template id="com1">
    <div>
      <slot name="left">左</slot>
      <slot name="center">中</slot>
      <slot name="right">右</slot>
    </div>
  </template>
```

在使用组件时，需要使用`<template>`标签与`v-slot`进行命名：

```html
      <com1>
        <template v-slot:center>
          <p>我是中间</p>
        </template>
      </com1>
```

而且`v-slot`不是标签的 Attribute，它使用的是分号。

> **`v-slot` 只能添加在 `<template>` 上**，只有一种列外情况。

没有具名的插槽会带有一个隐含的名字`default`。

### 编译作用域

父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

在实例里使用`isShow`访问的是实例的值，在组件里使用`isShow`访问的是组件内的值。

```js
    let vm = new Vue({
      el: '#app',
      data: {
        isShow: true,
      },
      components: {
        com1: {
          template: '#com1',
          data() {
            return {
              isShow: false,
            }
          },
        },
      },
    });
```

### 作用域插槽

因为编译作用域的存在，在在父级的插槽内容中向插槽传递内容时，无法用到组件内的属性。就类似于从组件内向父作用域传递一个`props`，在父作用域中就可以使用这个`props`。

在定义插槽时，在`<slot>`标签上可以写一个 bind，绑定的值（key）就是传递到父作用域的`props`，其内容（value）就是子组件的数据（data）里的内容。

```html
  <template id="com1">
    <div>
      <slot :languages="programLanguages">
        <ul>
          <li v-for="item in programLanguages">
            {{item}}
          </li>
        </ul>
      </slot>
    </div>
  </template>

      components: {
        com1: {
          template: '#com1',
          data() {
            return {
              programLanguages: ['Java','JavaScript','C','C艹','Swift']
            }
          },
        },
```

在父作用域中使用的时候，使用`v-slot`接受传递过来的`props`，名称完全为自定义，传递过来的是一个对象，其 key 就是定义的名称，value 就是传递过来的内容

```js
{  "languages": ["Java", "JavaScript", "C", "C艹", "Swift"  ] } 
```

使用时，就直接使用对象访问的方式进行访问。

```html
      <com1>
        <template v-slot:default="slotProp">
          <p>
            {{slotProp}}
          </p>
          <span v-for="item in slotProp.languages">
            {{item}}
          </span>
        </template>
      </com1>
```

## 模块

ES6 定义了语言级的模块系统

### 导出

可以导出变量、函数、类等。导出也有很多方法

1. 在声明前导出

可以通过在声明之前放置 `export` 来标记任意声明为导出，无论声明的是变量，函数还是类都可以。

```js
export let xxfy = '无敌小肥羊';
export function mul(n1, n2) {
  return n1 * n2;
}
export class Person {
  constructor(name) {
    this.name = name;
  }
  run() {
    console.log('running!');
  }
}
```

> **导出 class/function 后没有分号**。在类或者函数前的 `export` 不会让它们变成 [函数表达式](https://zh.javascript.info/function-expressions)。尽管被导出了，但它仍然是一个函数声明。

2. 导出与声明分开

另外，我们还可以将 `export` 分开放置。

```js
let xfy = '小肥羊';
let arr = [1, 2, 3, 5, 5, 67, 3, 3];
let obj = {
  key: 'value'
}
class Person {
  constructor(name) {
    this.name = name
  }
  run() {
    console.log('running!');
  }
}
class Student extends Person {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

export { xfy, arr, obj, Person, Student }
```

### Export default

## runtime compiler渲染过程

template -> abstract syntax tree -> render -> virtual dom -> UI

## runtime only

render -> virtual dom -> UI

## 渲染函数

render为一个函数，他接受一个`createElement`方法作为参数。

普通用法，`createElement`接受三个参数：

```js
createElement('创建的标签', '{标签的属性}', ['内容'])
```

```js
new Vue({
  // render: h => h(App),
  render: (createElement) => {
    return createElement('h2',
    {class: 'test'},
    ['这是一个测试标题']
    )
  }
}).$mount('#app')
```

`createElement`还支持直接传入一个组件，跳过编译`template`阶段。runtime only 就是使用 render 直接进行渲染的：

```js
new Vue({
   render: h => h(App),
}).$mount('#app')
```

### 编译组件

在 runtime only 下，`.vue`的组件内的`template`由 vue-template-compiler 进行编译为 render 函数。

## 路由

### 后端路由

整个 HTML 页面由服务器渲染好，由后端进行处理 URL 和页面之间的映射关系

### 前后端分离

由前端的 JavaScript 发送 Ajax 请求向后端服务器请求数据。浏览器中显示的网页中的大部分内容都是由 JavaScript 渲染出来的网页。

### SPA 页面

Single-page application，单页面应用。在前后端分离的基础上增加了一层前端路由，整个网站只有一个 html 主页。浏览器一次请求所有的静态资源，由前端路由进行管理和处理 URL 的响应。

## 不刷新修改 URL

* `location.hash`

* `history.pushState()`：该方法类似于一个栈结构，先进后出。使用`history.back()`方法返回。

![image-20210116115856541](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210116115856541.png)

* `history.replaceState()`：该方法与`pushState`不同，它无法返回，不会记录浏览器历史记录。

* `history.go()`：该方法接受一个参数，去往指定浏览器历史记录的参数。`history.go(-1)`同等与`history.back()`。`history.go(1)`同等与`history.forward()`

## 使用 Vue-router

```js
// 配置路由相关的信息
import VueRouter from 'vue-router';
import Vue from 'vue';
import Home from '../components/Home';
import About from '../components/About'

// 1.通过 Vue.use(插件)，来安装插件
Vue.use(VueRouter);

// 2. 创建路由对象
const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    component: About
  },

]
const router = new VueRouter({
  routes
})

// 3. 挂载到实例
export default router;
```

* 第一步：创建路由组件；
* 第二步：配置路由映射，组件和路径映射关系；
* 第三步：使用路由，通过`<route-link>`和`<router-view>`。

`<route-link>`是 vue-router 中已经内置的组件，它会被渲染成一个`<a>`标签。

`<router-view>`会根据当前的路径，动态的渲染出不同的组件。在路由切换时，切换的是`<router-view>`挂载的组件，其他的内容不会发生改变。

### 默认路由路径

通过修改根路径的重定向来设置默认路由：

```js
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
]
```

### history 模式

在创建路由对象时，使用`mode`参数为`histroy`：

```js
const router = new VueRouter({
  routes,
  mode: 'history'
})
```

### router-link 属性

* `to`：用于指定跳转的路径；
* `tag`：渲染成指定的标签；
* `replace`：不会留下历史记录；
* `active-class`：修改激活后的标签样式名；

在路由的配置里可以使用`linkActiveClass: 'active'`来同一修改`router-link`

的激活样式。

### 使用自定义标签

除了使用`router-link`还可以使用自定义的标签通过方法来实现路由跳转（`push`和`replace`）：

```js
    <button @click="toHome">首页</button>
    <button @click="toAbout">关于</button>  
methods: {
    toHome() {
      this.$router.push("/home");
    },
    toAbout() {
      this.$router.push("/about");
    },
  },
```

### 动态路由

根据变量动态前往指定路径，首先在路由里添加路径，并绑定指定变量：

```js
  {
    path: '/user/:userId',
    component: User,
  },
```

在主页面添加按钮，路径绑定为变量，就成功绑定动态路由了：

```js
    <router-link :to="'/user/'+userId" tag="button">用户</router-link>

  data() {
    return {
      userId: "xfy",
    };
  },
```

在组件内可以使用`$route`来访问当前处于活跃的路由的参数：

```js
  computed: {
    userId() {
      return this.$route.params.userId;
    }
  },
```

### 路由懒加载

使用 ES6 的动态导入，可以实现路由懒加载

```js
const Home = () => import('../components/Home');
const About = () => import('../components/About');
const User = () => import('../components/User');

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/user/:userId',
    component: User,
  },
];
```

### 路由嵌套

当需要在指定路径下访问子路径时，在父路由中再次注册一个子路由。同时也可以使用默认路径：

```js
const Home = () => import('../components/Home');
const HomeNews = () => import('../components/childComponents/HomeNews');
const HomeMessage = () => import('../components/childComponents/HomeMessage');

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/',
        redirect: '/home/news'
      },
      {
        path: 'news',
        component: HomeNews,
      },
      {
        path: 'message',
        component: HomeMessage
      }
    ]
  },
```

并且在父组件中可以使用`router-link`：

```js
    <router-link to="/home/news" tag="button">新闻</router-link>
    <router-link to="/home/message" tag="button">消息</router-link>
    <router-view></router-view>
```

### 传递参数

传递参数有两种方式：

* params 类型：
  * 配置路由格式: /router/:id
  * 传递的方式: 在path后面跟上对应的值
  * `$route.params.some`
* query 类型：
  * 配置路由格式: /router, 也就是普通配置
  * 传递的方式: 对象中使用query的key作为传递方式
  * `$route.query.some`

query 类型的传递，在路由配置上无需改动

```js
  {
    path: '/profile',
    component: Profile,
  }
```

在`router-link`里，需要动态绑定`to`参数，并传递 query 的参数

```js
<router-link :to="{ path: '/profile', query: {name: 'xfy', age: 18, xx: 'xx'}}" tag="button">档案</router-link>
```

在子组件中通过`$route.query`来接受参数

```js
    <ul>
      <li v-for="(item, i) in $route.query" :key="item">
        {{i}}
        {{item}}
      </li>
    </ul>
```

### router 与 route

router 与 route 是两个不同的对象：

* `$router`是导出的 vue-router 对象
* `$route`是当前处于活跃的路由

```js
this.$router
this.$route
```

所有的组件都继承自 Vue 类的原型。

### 全局导航守卫

使用 `router.beforeEach` 注册一个全局前置守卫：

```js
router.beforeEach((to, from, next) => {
  console.log(`从${from.path}到${to.path}`);
  document.title = to.matched[0].meta.title;
  next();
})
```

使用`router.afterEach`注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  // ...
})
```

#### 路由独享守卫

可以在路由配置上直接定义 `beforeEnter` 守卫，参数与全局前置守卫的方法参数是一样的：

```js
    beforeEnter: (to, from, next) => {
      console.log('about beforeEnter');
      next()
    }
```

## keep-alive

缓存

### include 和 exclude

可以指定包含或排除的组件，使用组件名称。

```html
<!-- 包含多这个值时，不能随便加空格 -->
<keep-alive exclude="Profile,User">
      <router-view></router-view>
</keep-alive>
```

## Promise

Promise 在内部使用异步操作，当操作完成后，根据异步的结果来调用`resolve()`或`reject()`方法。

```js
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done')
    }, 1000);
```

1. executor 被自动且立即调用（通过 `new Promise`）。
2. executor 接受两个参数：`resolve` 和 `reject`。这些函数由 JavaScipt 引擎预先定义，因此我们不需要创建它们。我们只需要在准备好（译注：指的是 executor 准备好）时调用其中之一即可。

Promise 被 resolve 或 reject 时称为：settled。

### then

`.then()`用于后续的处理，它接受两个参数：

* `.then` 的第一个参数是一个函数，该函数将在 promise resolved 后运行并接收结果。

* `.then` 的第二个参数也是一个函数，该函数将在 promise rejected 后运行并接收 error。

### catch

如果我们只对 error 感兴趣，那么我们可以使用 `null` 作为第一个参数：`.then(null, errorHandlingFunction)`。或者我们也可以使用 `.catch(errorHandlingFunction)`，其实是一样的。

### finally

### Promise 版 setTimeOut

重写带有回调函数的异步操作时，将回调函数用 resolve 调用即可。

```js
  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
  }
  delay(1000).then(() => alert('done'))
```

与回调函数相比：

| Promises                                                     | Callbacks                                                    |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Promises 允许我们按照自然顺序进行编码。首先，我们运行 `loadScript` 和 `.then` 来处理结果。 | 在调用 `loadScript(script, callback)` 时，在我们处理的地方（disposal）必须有一个 `callback` 函数。换句话说，在调用 `loadScript` **之前**，我们必须知道如何处理结果。 |
| 我们可以根据需要，在 promise 上多次调用 `.then`。每次调用，我们都会在“订阅列表”中添加一个新的“分析”，一个新的订阅函数。在下一章将对此内容进行详细介绍：[Promise 链](https://zh.javascript.info/promise-chaining)。 | 只能有一个回调。                                             |

### Promise 的三种状态

![image-20210122144138759](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/image-20210122144138759.png)

* pending：等待状态，比如正在进行网络请求，或者定时器没有到时间。

* fulfill：满足状态，当我们主动回调了 resolve 时，就处于该状态，并且会回调`.then()`

* reject：拒绝状态，当我们主动回调了 reject 时，就处于该状态，并且会回调`.catch()`

### Promise 的错误

Promise 链在错误（error）处理中十分强大。当一个 promise 被 reject 时，控制权将移交至最近的 rejection 处理程序（handler）。

Promise 的执行者（executor）和 promise 的处理程序（handler）周围有一个“隐式的 `try..catch`”。如果发生异常，它就会被捕获，并被视为 rejection 进行处理。

```js
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
}).catch(alert); // Error: Whoops!
// 同等于
new Promise((resolve, reject) => {
  reject(new Error("Whoops!"));
}).catch(alert); // Error: Whoops!
```

但是 Promise 只能捕获和处理在同步运行时产生的错误，由异步操作所产生的错误并不是在 executor 运行时生成的，而是在稍后生成的。因此，promise 无法处理它。

```js
  new Promise((resolve, reject) => {
    setTimeout(() => {
      throw new Error('i cant be caught')
    }, 1000);
  }).catch((err) => {
    console.log(err);
  })
```

### Promise.all 

对于需要对多个异步处理的所有结果同一处理时

```js
  Promise.all([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('result 1')
      }, 2000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('result 2')
      }, 1000);
    })
  ]).then((data) => {
    console.log(data); // 返回数组，并且数组顺序按照请求顺利排列。
  })
```

## Vuex

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。

### 单页面状态管理

![img](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/flow.png)

单页面也就是父子组件的情况下，状态管理直接使用父子组件之间的通信最为方便。

```js
  props: {
    counter: Number,
  },
  methods: {
    increase() {
      this.$emit('increase')
    },
    decrease() {
      this.$emit('decrease')
    }
  }
```

### Vuex 状态管理

![vuex](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/vuex.png)

保存在 State 中的状态可以由组件直接使用，当组件需要修改其状态时，推荐方法是通过提交 Mutations 来进行修改。Mutations 的修改将直接影响到 State，并在组件中做出响应式，这样就形成了一个循环的响应式。

Actions 用于处理异步操作，只有同步操作时，可以直接提交 Mutations，跳过 Actions。如果直接使用异步操作，则 Devtools 无法跟踪到其状态。

##  Vuex 核心概念

* State
* Getters
* Mutation
* Action
* Module

### State 单一状态树

State 用来保存状态。

单一状态树：Single Source of Truth，单一数据源。

当我们有多个数据需要进行管理时，Vue 推荐依然使用单一的数据源（store）来进行管理。

#### 辅助函数

当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

使用对象展开运算符可以将其与局部计算属性混合使用

```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。

```js
  computed: {
    ...mapState([
      'students',
    ])
```

它类似于一种简写的方式，相应的 Mutation 和 Action 都有对应的辅助函数。

```js
import { mapState, mapMutations, mapActions } from "vuex";
  methods: {
    ...mapActions(['aChangeName']),
    ...mapMutations(["addCount"]),
    
    addCount1() {
      // this.$store.commit("addCount", {
      //   n: Number(this.count),
      // });
      this.addCount({
        n: Number(this.count),
      });
    },
    changeName() {
      // this.$store.commit('changeName')
      this.aChangeName()
    },
  }
```

### Getters 基本

Getters 类似于组件内的计算属性，它用于对 State 中的属性进行处理。

它和在 Mutations 中定义方法一样，默认接受一个参数 state。

```js
  getters: {
    doubleCounter(state) {
      return state.counter * 2;
    }
  },
```

Getters 还接受第二个参数，为它本身，可以直接获取本身已有的属性：

```js
	olderStuLen(state, getters) {
      return getters.olderStu.length;
    }
```

Getters 只能使用闭包来接受一个参数

```js
    search(state) {
      return function(age) {
        return state.students.filter(s => s.age >= age)
      }
    }
```

当然也可以使用箭头函数让它看起来更帅：

```js
    search: (state) => (age) => {
      return state.students.filter(s => s.age >= age)
    }
```

**Getters 在通过方法访问时，每次都会去进行调用，而不会缓存结果。**

### Mutations 状态更新

Mutations 主要包含两部分

* 字符串的**事件类型（type）**
* 一个**回调函数（handler）**，该回调函数的第一个参数就是 state

定义方式：

```js
mutations: {
    increase(state) {
        state.counter++
    }
}
```

通过 Mustation 更新

```js
increase: () => {
    this.$store.commit('increase')
}
```

#### 提交负荷

Mutation 还可以在 commit 时提交负荷（payload），也就是传递一个参数。

```js
    addCount() {
      this.$store.commit('addCount', Number(this.count))
    }
```

当需要传递多个参数时，可以使用对象，也更加易读：

```js
    addCount(state, payload) {
      state.counter += payload.n
    }

    addCount() {
      this.$store.commit('addCount', {
        n: Number(this.count)
      })
    }
```

#### 提交风格

```js
    addCount() {
      this.$store.commit('addCount', {
        n: Number(this.count)
      })
    }
```

提交 mutation 的另一种方式是直接使用包含 `type` 属性的对象：

```js
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

#### 响应式

Vue 是响应式系统，所有定义好的数据都会被添加到它的响应式系统中。由于`Object.defineProperty`的限制，它无法追踪新添加的属性，Mutation 也是同理。

所以在 Mutation 中添加或删除属性都需要使用`Vue.set()`与`Vue.delete()`方法。

#### 使用常量替代 Mutation 事件类型

使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

#### Mutations 必须是同步函数

当使用异步函数时，虽然可以更改，但 Vue（develop tool）无法追踪其变化。

```js
    changeName(state) {
      // state.students[1].name = 'dfy'
      setTimeout(() => {
        state.students[1].name = 'dfy'
      }, 1000);
    }
```

因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

在提交时依然需要异步操作时，可以使用 Action 来替代 Mutation 进行异步操作。

### Actions

Actions 主要作用就是代替 Mutations 进行异步提交（commit）。使用方法相当于在组件与 Mutations 之间多加了一步操作，由组件直接 commit 变成了 dispath ：

```js
// components
    changeName() {
      // this.$store.commit('changeName')
      this.$store.dispatch('aChangeName')
    }
```

```js
// store
mutations: {
    changeName(state) {
      state.students[1].name = 'dfy'
    }
}

actions: {
    asyncChangName(context) {
      setTimeout(() => {
        context.commit('changeName')
      }, 1000);
    }
}
```

实践中，我们会经常用到 ES2015 的 [参数解构](https://github.com/lukehoban/es6features#destructuring) 来简化代码（特别是我们需要调用 `commit` 很多次的时候）：

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

#### 组合 Action

Action 通常是异步的，`store.dispatch` 可以处理被触发的 action 的处理函数返回的 Promise，并且 `store.dispatch` 仍旧返回 Promise：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

现在你可以：

```js
store.dispatch('actionA').then(() => {
  // ...
})
```

在另外一个 action 中也可以：

```js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

### Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成**模块（module）**。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### 命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在**全局命名空间**的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

```js
const moduleA = {
  namespaced: true,
  state: {
    name: 0
  },
  mutations: {
    changeName(state) {
      state.name ++;
    }
  }
}
//调用
    bala() {
      this.$store.commit('moduleA/changeName')
    }
```

## Axios

默认为 Get 请求

```js
axios({
  url: 'http://httpbin.org/get'
}).then(res => {
  console.log(res);
})
```

### all

和 Promise 类似，Axios 也有一个 all 方法，可以并发多个请求：

```js
axios
  .all([
    axios({
      url: "http://httpbin.org/post",
      method: "post",
    }),
    axios({
      url: "http://httpbin.org/post",
      method: "post",
    }),
  ])
  .then(
    axios.spread((res1, res2) => {
      console.log(res1);
      console.log(res2);
    })
  );
```

### 全局配置

一些常用的默认配置可以配置为全局的默认配置。

```js
axios.defaults.baseURL = 'http://httpbin.org'
```

### 创建实例

全局配置会为所有的 Axios 请求做默认配置，可以创建单独的 Axios 实例。

```js
const axios_inst1 = axios.create({
  baseURL: 'http://httpbin.org',
  timeout: 5000,
})

axios_inst1({
  url: '/get'
}).then(res => {
  console.log(res);
})
```

### 封装

为了后续的代码可移植，或可更换框架，所以对第三方的库进行封装。封装 Axios 非常简单，它本身就返回一个 Promise，所以直接返回创建的实例即可：

```js
import axios from 'axios';

export function request(config) {
  let instance = axios.create({
    baseURL: 'http://httpbin.org',
    timeout: 5000,
  });
  return instance(config)
}
```

如果钟爱回调的话（：

```js
export function request(config, sucess, failuer) {
  let instance = asiox.create({
    baseURL: 'http://httpbin.org',
    timeout: 5000,
  });

  instance(config).then(res => {
    sucess(res)
  }).catch(err => {
    failuer(err)
  })
}
```

### 拦截器

Axios 可以对请求和响应做出一些拦截。

请求拦截接受两个参数，配置文件与 Error

```js
  instance.interceptors.request.use(config => {
    console.log(config)
    return config
  }, err => {
    console.log(err);
  })
```

在某些情况下可能需要拦截请求：

1. config 不符合服务器的要求
2. 希望展示一个请求中的图标
3. 某些请求可能会携带一些特殊信息（token）

```js
  instance.interceptors.response.use(res => {
    console.log(res);
    return res.data
  }, err => {
    console.log(err);
  })
```

## 新项目

1. 划分目录结构
2. 初始化css

## 封装 Better-Scroll

由于 Better-Scroll 只能用于单一子元素上，所以在封装它时，需要将 slot 外再封装两个外层元素。

![原理图](images/Vue%E4%B8%B4%E6%97%B6%E7%AC%94%E8%AE%B0/schematic.png)

slot 就放置在 content 内：

```html
.<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
```

获取 DOM 节点这里推荐的是使用 ref 属性来获取，虽然 **Better-Scroll** 也支持使用`querySelector`，但是对于 Vue 的组件复用来说，获取 class 可能会由 class 名的重复导致获取到错误的 DOM 节点。

```js
this.bs = new BScroll(this.$refs.wrapper, {});
```

完整的封装：

```js
import BScroll from 'better-scroll';

export default {
  data() {
    return {
      bs: null
    };
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.wrapper, {
         click: true,
        // 监听 DOM 变化
        observeDOM: true
      });
    }
  },
  mounted() {
    this.$nextTick().then(this.init());
  }
};
```

### 固定高度

由于外层元素需要固定高度才能进行滑动，而当不能直接确定其固定的高度时，可以使用定位来自适应高度。

```css
.home-wrapper {
  height: 100vh;
}
.scroll-wrap {
  position: absolute;
  top: 44px;
  bottom: 10px;
  left: 0;
  right: 0;
  overflow: hidden;
}
```



