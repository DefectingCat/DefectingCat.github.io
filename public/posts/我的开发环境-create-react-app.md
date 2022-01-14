---
title: 我的开发环境-create-react-app
date: 2021-12-30 03:12:29
tags: React
categories: 笔记
url: my-development-environment-create-react-app
index_img: /images/我的开发环境-create-react-app/logo.svg
---

## 创建项目

Create React App 自带 TypeScript 的 template，所以直接创建即可。

```bash
npx create-react-app my-app --template typescript
```

或者

```bash
yarn create react-app my-app --template typescript
```

## Absolute imports

绝对路径引入有点类似于 webpack 的别名，不过这种方式是使用 TypeScript 的编译器来实现的。只需要在 `tsconfig.json`（如果是纯 JavaScript 的话，也可以使用 `jsconfig.json`）中添加 `baseUrl` 字段。

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

就可以实现将这样的导入：

```tsx
import useApi from './../../hooks/use-api';
import Date from './../../components/date';
import Image from './../../components/image';
import transfromUserData from './../../helpers/transform-user-data';
```

变成这样：

```tsx
import useApi from 'hooks/use-api';
import Date from 'components/date';
import Image from 'components/image';
import transfromUserData from 'helpers/transform-user-data';
```

这不仅仅是看上去更加整洁了，由于是绝对路径，将对应的导入复制到其他组件中也可以正常使用。不用再老数点点了。

## Test coverage

默认的测试脚本是交互式的，虽然非常只能，但有些时候我也需要在 CI 中测试，并收集覆盖率报告。

```json
"test:coverage": "CI=true yarn test --env=jsdom --coverage",
```

## VScode Debug

添加对应的 VScode 配置文件到 `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

## ESLint + Prettier

create-react-app 其实是为我们安装过了 ESLint，所以我们不需要再手动的安装了。

```bash
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-typescript eslint-plugin-jest
```

对于 Airbnb config 可以使用这个包。

```bash
npx install-peerdeps --dev eslint-config-airbnb
```

Prettier 则需要我们手动去的去安装了。

```bash
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

接下来就是配置文件

```js
// .eslintrc.js
module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'jest', 'import'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
```

我的 Prettier 的配置文件比较简单，只需要单引号与分号就好了。

```json
// .prettierrc.sjon
{
  "semi": true,
  "singleQuote": true
}
```

如果需要的话，还可以再加两个脚本。

```json
"scripts": {
  "format": "prettier --write src/**/*.ts{,x}",
  "lint": "tsc --noEmit && eslint src/**/*.ts{,x}"
}
```
