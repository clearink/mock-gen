// 配置文件
interface ConfigSchemaItem {
  includeStatus?: string[]
  includeGroup?: string[]
  excludeGroup?: string[]
  includeApi?: string[]
  excludeApi?: string[]
  dirPath: string
  templatePath: string
}
interface ConfigSchema {
  mockConfig: ConfigSchemaItem
  tsConfig: ConfigSchemaItem
  fetchConfig: {
    filePath: string
    spaceKey: string
    projectHashKey: string
    EOLINKER_URL: string
    EO_SECRET_KEY: string
  }
  customMatchRule?: Record<string, CustomMockRule>
}
interface CustomMockRule extends Partial<ConfigSchemaItem> {
  // 需要匹配的数据类型
  type?: string[] | string

  // mock
  mock_rule?: any
  mock_type?: any
  mock_args?: any
  // joi
  joi_type?: any
  // ts
  ts_type?: any
  // 强制匹配
  important?: boolean
}
