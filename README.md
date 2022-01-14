# 根据 eolinker.json 自动生成 mock 与 ts 文件

## 用法

```cmd
1. yarn add -D @clearink/mock-gen

2. add scripts
// package.json
"scripts": {
  "mock-gen": "mock-gen gen",
  ...
},

3. yarn mock-gen
```

## 参数

| 参数 | 全称       | 作用             |
| ---- | ---------- | ---------------- |
| -nf  | --no-fetch | 不进行数据请求   |
| -nt  | --no-ts    | 不生成 ts 文件   |
| -nm  | --no-mock  | 不生成 mock 文件 |

## TODO
0. 默认生成 mock-gen.config.js 和 templates we
1. 优化 joi 和 ts 的 生成逻辑
2. 优化templates的渲染方式
3. 优化customMatchRule函数的使用方式
4. 支持解析swagger.json