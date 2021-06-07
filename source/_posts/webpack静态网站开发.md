---
title: webpack静态网站开发
date: 2021-05-29 21:03:20
tags: [JavaScript, Webpack]
categories: 实践
url: webpack-web-develop
index_img: /images/webpack%E9%9D%99%E6%80%81%E7%BD%91%E7%AB%99%E5%BC%80%E5%8F%91/logo.webp
---

## webpack

模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行。第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，依此类推。最后，webpack 期望链中的最后的 loader 返回 JavaScript。

### 初始化环境

```bash
yarn init
yarn add webpack webpack-cli -D
```

### 配置文件

配置文件中需要一个入口文件，即为被打包的 js 文件。同时需要一个输出的目录，与打包后的文件名。

这是最基本的配置，其他的文件需要使用对应的 loader。

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

而在`index.html`中就只需要写打包后的路径

```html
<script src="main.js"></script>
```

### typescript

```
yarn add typescript ts-loader -D
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

### html-webpack-plugin

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test',
    }),
  ],
```

使用模板时，需要使用 ejs 语法来获取配置文件中的 title。

```html
    <title><%= htmlWebpackPlugin.options.title %></title>
```

#### ejs 语法与 html-loader 冲突

`html-loader`和`html-webpack-plugin`是冲突的。使用了`html-loader`之后，`html-webpack-plugin`的`<%= %>`功能就全部失效了。

### CSS loader

```js
yarn add sass-loader sass style-loader css-loader -D
```

```js
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
```

#### 使用 sass 等

webpack 的 loader 是从下到上，以及从右到左来进行加载的。当使用了 sass、postcss 等，需要保证其顺序的正确性。

```js
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
```

### 管理图片

webpack 有资源模块 (asset module)，它是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

在处理图片时使用资源模块。

在 webpack 5 之前，通常使用：

- [`raw-loader`](https://webpack.docschina.org/loaders/raw-loader/) 将文件导入为字符串
- [`url-loader`](https://webpack.docschina.org/loaders/url-loader/) 将文件作为 data URI 内联到 bundle 中
- [`file-loader`](https://webpack.docschina.org/loaders/file-loader/) 将文件发送到输出目录

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现。
- `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

```js
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
```

如果需要在 css 或 html 中处理图片，需要安装对应的 css loader 和 html-loader。

在使用 [css-loader](https://webpack.docschina.org/loaders/css-loader) 时，如前所示，会使用类似过程处理你的 CSS 中的 `url('./my-image.png')`。loader 会识别这是一个本地文件，并将 `'./my-image.png'` 路径，替换为 `output` 目录中图像的最终路径。而 [html-loader](https://webpack.docschina.org/loaders/html-loader) 以相同的方式处理 `<img src="./my-image.png" />`。

### 管理字体

字体与图片同理，也是使用资源模块来管理

```js
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
```

## 开发环境

### 使用 source map

当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。

为了更容易地追踪 error 和 warning，JavaScript 提供了 [source maps](http://blog.teamtreehouse.com/introduction-source-maps) 功能，可以将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。

source map 使用 devtool 来进行配置。如下，会在打包时生成单独的`.map`文件：

```js
devtool: 'source-map',
```

> source map 有许多 [可用选项](https://webpack.docschina.org/configuration/devtool)，请务必仔细阅读它们

### 开发工具

webpack 提供几种可选方式，帮助我们在代码发生变化后自动编译代码：

1. webpack's [Watch Mode](https://webpack.docschina.org/configuration/watch/#watch)
2. [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
3. [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)

### watch mode(观察模式)

观察模式就是在保存文件时，webpack 监听文件的变化，从而立即进行打包。

```js
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
     "build": "webpack"
   },
```

### webpack-dev-server

webpack-dev-server 为我们直接提供了一个简易的 web server，并且具有 live reloading(实时重新加载) 功能。

```js
yarn add webpack-dev-server -D
```

```js
  // webpack.config.js
  devServer: {
    contentBase: './dist',
  },
```

webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 [`publicPath`](https://webpack.docschina.org/configuration/dev-server/#devserverpublicpath-) 选项进行修改。

> `webpack-dev-server` 会从 `output.path` 中定义的目录为服务提供 bundle 文件，即，文件将可以通过 `http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]` 进行访问

### webpack-dev-middleware

webpack-dev-middleware 是使用第三方的 web server （如：express、koa）等作为中间件来提供服务。它可以把 webpack 处理过的文件发送到一个 server。 `webpack-dev-server` 在内部使用了它，然而它也可以作为一个单独的 package 来使用，以便根据需求进行更多自定义设置。

```
yarn add express webpack-dev-middleware -D
```

```js
// webpack.config.js
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
    publicPath: '/',
   },
```

```js
// server.js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

## 缓存

### 输出文件名

我们可以通过替换 `output.filename` 中的 [substitutions](https://webpack.docschina.org/configuration/output/#outputfilename) 设置，来定义输出文件的名称。webpack 提供了一种使用称为 **substitution(可替换模板字符串)** 的方式，通过带括号字符串来模板化文件名。其中，`[contenthash]` substitution 将根据资源内容创建出唯一 hash。当资源内容发生变化时，`[contenthash]` 也会发生变化。

```js
    output: {
     filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
```

### 提取引导模板

webpack 还提供了一个优化功能，可使用 [`optimization.runtimeChunk`](https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk) 选项将 runtime 代码拆分为一个单独的 chunk。将其设置为 `single` 来为所有 chunk 创建一个 runtime bundle.

将第三方库(library)（例如 `lodash` 或 `react`）提取到单独的 `vendor` chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。

```js
    optimization: {
      runtimeChunk: 'single',
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
    },
```

## 完整配置文件

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      // {
      //   test: /\.s[ac]ss$/i,
      //   use: [
      //     // 将 JS 字符串生成为 style 节点
      //     'style-loader',
      //     // 将 CSS 转化成 CommonJS 模块
      //     'css-loader',
      //     // 将 Sass 编译成 CSS
      //     'sass-loader',
      //   ],
      // },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: '这是一个测试页面',
      template: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```