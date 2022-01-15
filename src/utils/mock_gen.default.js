/**
 * @description 配置
 * excludeGroup/excludeApi的优先级要高
 */
const path = require('path')

module.exports = {
  // mock 文件配置
  mockConfig: {
    includeStatus: ['已发布', '维护', '完成', '开发', '设计中'], // 需要解析的 api 状态
    includeGroup: [], // groupName
    excludeGroup: [], // groupName
    includeApi: [], // 以 apiName/apiURI 字段为准
    excludeApi: [], // 以 apiName/apiURI 字段为准
    dirPath: path.resolve(process.cwd(), './mock'), // 生成的mock文件路径
    templatePath: path.resolve(__dirname, './templates/mock_file.ejs'), // 模板路径
  },
  // ts 文件配置
  tsConfig: {
    includeStatus: ['已发布', '维护', '完成', '开发', '设计中'], // 需要解析的 api 状态
    includeGroup: [], // groupName
    excludeGroup: [], // groupName
    includeApi: [], // 以 apiName/apiURI 字段为准
    excludeApi: [], // 以 apiName/apiURI 字段为准
    dirPath: path.resolve(process.cwd(), './src/ts'), // 生成的ts文件路径
    templatePath: path.resolve(__dirname, './templates/ts_file.ejs'), // 模板路径
  },
  // 获取 eolinker 配置
  fetchConfig: {
    filePath: path.resolve(__dirname, './eolinker.json'), // api 文件地址
    spaceKey: '', // url 参数 自行修改
    projectHashKey: '', // url 参数 自行修改

    EOLINKER_URL: 'http://devapi.sangfor.com/index.php/v2/api_studio/management/api/export', // 数据请求地址 不用修改
    EO_SECRET_KEY: '4flxlRm554de754e234eca1041a716ed40b190fbf532fec', // Eolinker密钥 不用修改
  },
  // 自定义匹配规则(包括 joi mock ts)
  customMatchRule: {
    '\\w+': [
      {
        type: 'array', // 任意数组的 rule 为 0-15
        mock_rule: '6-15',
      },
      {
        // 不指定 type 则视为全部类型
        mock_args: [0, 6], // mock 规则的 参数
      },
      {
        type: 'boolean',
        mock_args: [0, 3],
      },
    ],
    code: {
      mock_type: 0,
      mock_rule: '',
      // important: true, // 强制覆盖
      // type: [], // 字段类型要求 string | string[]
      // mock_rule: "1-2" // mock 匹配规则 {"prop|rule": content(args)}
      // mock_type: "@integer()" // mock 匹配规则 {"prop|rule": content(args)}
      // mock_args: [1,2,3] // mock 匹配规则 {"prop|rule": content(args)}
      // joi_type: "joi.string()" // joi 匹配规则 { "prop": joi.string().required() }
      // ts_type: "number" // ts 匹配规则 { "prop": "string"}
      // includeGroup: [], // 某个组中起作用
      // excludeGroup: [], // 某个组中不起作用
      // includeApi: [], // 某个 api 中起作用
      // excludeApi: [], // 某个 api 中不起作用
    },
    id: '@id()', // 字段出现 id
    title: '@ctitle(10, 100)', // 字段出现title
    message: {
      mock_rule: '',
      mock_type: '@cparagraph()',
    },
    name: '@cname()',
    person: '@cname()',
    creator: '@cname()',
    url$: '@url()',
    desc: '@cparagraph()',
    '^ops': {
      mock_type: [0, 1],
      mock_rule: '1',
    },
    time$: '@datetime("yyyy年MM月")',
    total: {
      mock_rule: '',
      mock_type: '@integer(8, 15)',
    },
    photo: "@image('400x400')",
    image: '@image()',
    email: '@email()', // 匹配任意类型
  },
}
