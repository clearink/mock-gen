/**
 * @description 配置
 * excludeGroup/excludeApi的优先级要高
 */
const path = require("path");

module.exports = {
  // mock 文件配置
  mockConfig: {
    // 需要解析的 api 状态
    includeStatus: ["已发布", "维护", "完成", "开发", "设计中"],
    includeGroup: [
      // '项目分包'
    ],
    excludeGroup: [],
    includeApi: [
      "/pms/v1/milestone/milestone-setting-list",
      // '/pms/v1/customer/customer-detail'
    ], // 以 apiName/apiURI 字段为准
    excludeApi: [], // 以 apiName/apiURI 字段为准
    dirPath: path.resolve(__dirname, "../mock"), // 生成的mock文件路径
    templatePath: path.resolve(__dirname, "./templates/mock_file.ejs"), // 模板路径
  },
  // ts 文件配置
  tsConfig: {
    // 需要解析的 api 状态
    includeStatus: ["已发布", "维护", "完成", "开发", "设计中"],
    includeGroup: [
      // '项目分包'
    ],
    excludeGroup: [],
    includeApi: ["/pms/v1/milestone/milestone-setting-list"], // 以 apiName/apiURI 字段为准
    excludeApi: [], // 以 apiName/apiURI 字段为准
    dirPath: path.resolve(__dirname, "../src/ts"), // 生成的ts文件路径
    templatePath: path.resolve(__dirname, "./templates/ts_file.ejs"), // 模板路径
  },
  // 获取 eolinker 配置
  fetchConfig: {
    // api 配置输出地址
    filePath: path.resolve(__dirname, "../eolinker.json"),
    spaceKey: "SDuKq4V0eaee71499cf82e25c58394c30d759436da5a162",
    projectHashKey: "Fw14mLP9e071a3a594a8964cbefe784f8a6afaa94c0de17",

    EOLINKER_URL:
      "http://devapi.sangfor.com/index.php/v2/api_studio/management/api/export",
    EO_SECRET_KEY: "4flxlRm554de754e234eca1041a716ed40b190fbf532fec", // Eolinker密钥不用修改
  },
  // 自定义匹配规则(包括 joi mock ts)
  customMatchRule: {
    "\\w+": [
      {
        type: "array", // 任意数组的 rule 为 0-15
        rule: "6-15",
        // joi: 'joi.string()',
        // ts: 'any[]'
      },
      {
        args: [0, 6], // mock 规则的 参数
      },
      {
        type: "boolean",
        args: [0, 3],
      },
    ],
    code: {
      content: 0,
      rule: "",
      // important: true, // 强制覆盖
      // type: [], // 字段类型要求
      // rule: undefined, // mock
      // content: "",
      // strict: true, // 精准匹配字段名 默认为 false
      // includeGroup: [], // 某个组中起作用
      // excludeGroup: [], // 某个组中不起作用
      // includeApi: [], // 某个 api 中起作用
      // excludeApi: [], // 某个 api 中不起作用
    },
    id: "@id()", // 字段出现 id
    title: "@ctitle(10, 100)", // 字段出现title
    message: {
      rule: "",
      content: "@cparagraph()",
    },
    name: "@cname()",
    person: "@cname()",
    creator: "@cname()",
    url$: "@url()",
    desc: "@cparagraph()",
    "^ops": {
      content: [0, 1],
    },
    time$: '@datetime("yyyy年MM月")',
    total: {
      rule: "",
      content: "@integer(8, 15)",
    },
    photo: "@image('400x400')",
    image: "@image()",
    email: "@email()", // 匹配任意类型
    // // 类型为int 且精准匹配为 code 时替换为 0
    // code: { type: "int", content: 0, strict: true },
    // code: { type: ["int"], content: 0, strict: true },
    customer_type: {
      rule: "+1",
    },
  },
};
