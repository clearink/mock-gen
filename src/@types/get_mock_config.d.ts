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
  // mock
  rule?: any
  content?: any
  args?: any

  // joi
  joi?: any

  // ts
  tsType?: any
  tsContent?: any

  important?: boolean
  type?: string[] | string
}
