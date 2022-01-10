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

| 参数 | 全称 | 作用 |
| ---- | ----|---- |
| -nf  | --no-fetch | 不进行数据请求 |
| -nt  | --no-ts | 不生成 ts 文件 |
| -nm  | --no-mock | 不生成 mock 文件 |