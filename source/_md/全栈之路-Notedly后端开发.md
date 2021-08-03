主要依赖：

```json
  "dependencies": {
    "apollo-server-koa": "^3.0.1",
    "graphql": "^15.5.1",
    "koa": "^2.13.1"
  }
```

## GraphQL

GraphQL API 主要有两个组成部分，即模式和解析器。

### 模式

GraphQL 模式的基本构件是对象模型，GraphQL 原生支持五种数据类型：

* String
* Boolean
* Int
* Float
* ID

简单的模式通常像这样以对象的形式创建：

```js
  const typeDefs = gql`
    type Note {
      id: ID!
      content: String!
      author: String!
    }
    type Query {
      hello: String
      notes: [Note!]!
      note(id: ID!): Note!
    }
    type Mutation {
      newNote(content: String!): Note!
    }
  `;
```

### 解析器

GraphQL 的第二个部分就是解析器，它的作用就是负责解析 API 用户请求的数据。这里用到了两种解析器：查询（Query）和变更（Mutation）。

```ts
  const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      notes: () => notes,
      note: (parent: unknown, args: { id: string }) => {
        return notes.find((item) => item.id === args.id);
      },
    },
    Mutation: {
      newNote: (parent: unknown, args: { content: string }) => {
        const newValue = {
          id: String(notes.length),
          content: args.content,
          author: 'xfy',
        };
        notes.push(newValue);
        return newValue;
      },
    },
  };
```

解析器还接收对应的参数：

* parent：父查询的结果；
* args：用户在查询时传入的参数；
* context：服务器应用传给解析器函数的信息，可能包含当前用户或数据库信息；
* info：关于自身查询的信息；

## ApolloServer

Apollo Server 是一个开源的 GraphQL 服务器，支持很多的 Node.js 服务器框架。这里使用的是 Koa 配上 apollo-server-koa 来搭建后端 API 服务器。

### 定义模式

这里直接在 src 目录下创建了`schema.ts`，并将 GraphQL 的模式定义在这里：

```js
import { gql } from 'apollo-server-koa';

export default gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
  }
  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
  }
`;
```

并在主应用`app.ts`中以这样进行引入`import typeDefs from './schema';`。

在定义的模式中，Query 是对应查询的模式，Mutation 是对应 CRUD 的模式。而 Note 是自定义的笔记存放格式，后续将继续对应数据库模型。

在模式中定义的参数，如`deleteNote(id: ID!)`会对应传递到其解析器的第二个形参。

### 定义解析器

解析器对应查询模式，目前分别需要两个解析器，分别是 Query 和 Mutation。这里的目录解构划分为：`src/resolvers`。

Query 比较简单，直接操作数据库模型进行查询即可：

```ts
// Query.ts
import models from '../models';

export default {
  notes: async (): Promise<void> => await models.Note.find(),
  note: async (parent: unknown, args: { id: string }): Promise<void> =>
    await models.Note.findById(args.id),
};
```

而 Mutation 则相对复杂一点，它分别对应了 CUD 的操作。

```ts
// Mutation.ts
import models from '../models';

export default {
  newNote: async (
    parent: unknown,
    args: { content: string }
  ): Promise<void> => {
    return await models.Note.create({
      content: args.content,
      author: 'xfy',
    });
  },
  updateNote: async (
    parent: unknown,
    args: { id: string; content: string }
  ): Promise<void> => {
    return await models.Note.findOneAndUpdate(
      {
        _id: args.id,
      },
      {
        $set: {
          content: args.content,
        },
      },
      {
        new: true,
      }
    );
  },
  deleteNote: async (
    parent: unknown,
    args: { id: string }
  ): Promise<boolean> => {
    try {
      await models.Note.findOneAndDelete({
        _id: args.id,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
```

> 这里的 models 就是接下来将要定义的数据库模型。

为了统一在主应用`app.ts`中使用，这里还需要将多个分离的解析器统一导出：

```ts
// src/resolves/index.ts
import Query from './query';
import Mutation from './mutation';

export default {
  Query,
  Mutation,
};
```

### 创建 Apollo Server

将模式与解析器定义完成之后，就应该交由 Apollo 来创建 Server 了。在主应用中分别将模式与解析器导入，并运行服务器。

```ts
// app.ts
import typeDefs from './schema';
import resolvers from './resolvers';

  // ...
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
      return { models };
    },
  });
  await server.start();
  // ...
```

## 数据库

数据库采用的是 MongoDB，ODM（Object Document Mapper）使用的是 Mongoose。

### 连接数据库

Mongoose 也是连接 MongoDB 的客户端，简单封装一下就可直接连接数据库，后续 CRUD 根据模型来操作。

```ts
import mongoose from 'mongoose';

export default {
  /**
   * 这个方法用于设置和连接数据库
   * @param DB_HOST 数据库地址
   */
  connect: (DB_HOST: string): void => {
    // 使用 Mongo 驱动新的 URL 字符串解析器
    mongoose.set('useNewUrlParser', true);
    // 使用 findOneAndUpdate() 代替 useFindAndModify()
    mongoose.set('useFindAndModify', false);
    // 使用 createIndex() 代替 ensureIndex()
    mongoose.set('useCreateIndex', true);
    // 使用新的服务器发现和监控引擎
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(DB_HOST);
    mongoose.connection.on('error', (err) => {
      console.log(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );
      process.exit();
    });
  },
  close: (): void => {
    mongoose.connection.close();
  },
};
```

### 数据库模型

新建一个存放数据库模型的文件夹`src/models`。目前只用到了两个集合，分别是 ntoe 和 user。

文档的交叉引用需要将 type 设置为`mongoose.Schema.Types.ObjectId`，并配置 ref 引用到对应的模型。

```ts
import mongoose from 'mongoose';

// 定义笔记的数据库模式
const NoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // 添加 Date 类型的 createAt 和 updateAt 字段
    timestamps: true,
  }
);

// 通过模式定义 Note 模型
const Note = mongoose.model('Note', NoteSchema);

export default Note;
```

### CRUD 解析器

编写对应的 CRUD 模式与之前相同，写好对应数据类型以及格式即可。真正对应的操作在对应的解析器上，对应的解析器分别对应着数据的 CRUD。

Mongoose 的操作分别使用对应的模型来操作对应的集合，互相引用的 ID 需要引入`mongoose.Types.ObjectId()`来创建：

```ts
  newNote: async (
    parent: unknown,
    args: { content: string },
    ctx: { user: { id: string } }
  ): Promise<void> => {
    if (!ctx.user)
      throw new AuthenticationError('You must be signed in to create a note');

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(ctx.user.id),
    });
  },
```

### 日期与时间

再编写数据库模型时，添加了 timestamps 来创建对应的创建时间和更新时间，均为 UTC 格式的 Date 类型。

```ts
    // 添加 Date 类型的 createAt 和 updateAt 字段
    timestamps: true,
```

但原生的 GrapQL 是不支持 Date 类型的，可以变通一下使用 String 代替，但是这样就无法借助 GrapQL 提供的类型验证功能，以确保时间的正确性。

可以利用 GrapQL 来定义一个新的类型，并添加第三方包来创建 Date 类型。

创建新的类型需要在模式中声明一个类型：

```ts
// src/schema.ts
export default gql`
  scalar DateTime
`
```

之后在导出 resolvers 的时候，添加引入的第三方包类型为我们声明的新类型：

```ts
// src/resolvers/index.ts
export default {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime,
};
```

之后在模式中就可以使用该类型：

```ts
// src/schema.ts
  type Note {
    id: ID!
    content: String!
    author: User
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]
  }
```

甚至在自动生成的文档中还能引入第三方包所创建的说明：

![image-20210721230252762](../images/%E5%85%A8%E6%A0%88%E4%B9%8B%E8%B7%AF-%E9%A6%96%E4%B8%AAGraphQL%20API/image-20210721230252762.png)
