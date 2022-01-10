import { MOCK_GEN_CONSTANT } from '../constant/env'
/**
 * @description 配置
 * excludeGroup/excludeApi的优先级要高
 */
export default {
  // mock 文件配置
  mockConfig: {
    // 需要解析的 api 状态
    includeStatus: [],
    includeGroup: [],
    excludeGroup: [],
    includeApi: [], // 以 apiName/apiURI 字段为准
    excludeApi: [], // 以 apiName/apiURI 字段为准
    dirPath: MOCK_GEN_CONSTANT.MOCK_DIR_NAME, // 生成的 mock 文件路径
    templatePath: MOCK_GEN_CONSTANT.MOCK_TEMPLATE_PATH, // mock 模板文件路径
  },

  // ts 文件配置
  tsConfig: {
    // 需要解析的 api 状态
    includeStatus: [],
    includeGroup: [],
    excludeGroup: [],
    includeApi: [], // 以 apiName/apiURI 字段为准
    excludeApi: [], // 以 apiName/apiURI 字段为准
    dirPath: MOCK_GEN_CONSTANT.TYPE_DIR_NAME, // 生成的 ts 文件路径
    templatePath: MOCK_GEN_CONSTANT.TYPE_TEMPLATE_PATH, // ts 模板文件路径
  },

  // 获取 eolinker 配置
  fetchConfig: {
    // api 配置输出地址
    filePath: MOCK_GEN_CONSTANT.EOLINKER_FILE_PATH,
    spaceKey: undefined,
    projectHashKey: undefined,

    EOLINKER_URL: 'http://devapi.sangfor.com/index.php/v2/api_studio/management/api/export',
    EO_SECRET_KEY: '4flxlRm554de754e234eca1041a716ed40b190fbf532fec', // Eolinker密钥不用修改
  },

  customMatchRule: {}, // 自定义匹配规则(包括 joi mock ts)
}
