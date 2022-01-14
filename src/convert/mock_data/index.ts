import getStructMap from '../../utils/get_struct_map'
import {
  renderMockEnum,
  matchCustomRule,
  normalizeParam, // 修正错误的属性名称
  judgeGenerateEnum,
  normalizeParamType,
} from '../utils'

/**
 *
 * @param apiConfig api 配置
 * @returns
 */
function convertToMock(apiConfig: ApiListItem) {
  const { resultInfo } = apiConfig
  return generateMock(resultInfo, apiConfig)
}

/**
 *
 * @param schemaList 需要分析的 API 数据
 * @param apiConfig API 配置
 * @returns
 */
function generateMock(schemaList: ParamItemSchema[], apiConfig: ApiListItem): Record<string, any> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce(async (result, schema) => {
    if (schema.hasOwnProperty('structureID')) {
      const struct = structMap.get(schema.structureID!)?.struct
      if (!struct) return result
      return { ...result, ...generateMock(struct, apiConfig) }
    }
    const { rule, content } = await schemaToMock(schema, apiConfig)
    const suffix = rule ? `|${rule}` : ''
    const paramKey = `${schema.paramKey}${suffix}`.replace(/\s/g, '')
    return { ...result, [paramKey]: content }
  }, {})
}

/**
 * @description 根据 schema 生成 mock 数据
 * @param schema 字段配置
 * @param apiConfig api配置
 * @returns 
 */
async function schemaToMock(schema: ParamItemSchema, apiConfig: ApiListItem) {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 获取枚举值
  const shouldGenerate = await judgeGenerateEnum('mock', schema, apiConfig)

  if (shouldGenerate !== false) {
    return renderMockEnum(shouldGenerate, type)
  }

  let content: string | null = '@word({args})'
  // 判断类型
  switch (type) {
    case 'string':
      content = `@word({args})`
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'file':
      content = '暂不支持[file]类型'
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'int':
      content = `@integer({args})`
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'float':
    case 'double':
      content = `@float({args})`
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'date':
    case 'datetime':
      content = "@date('yyyy-MM-dd hh:mm:ss')"
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'boolean':
      content = `@boolean({args})`
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      content = `@integer({args})`
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'null':
      content = null
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'char':
      content = "@character('lower')"
      return matchCustomRule('mock', schema, apiConfig, { content })
    case 'array':
    case 'json':
    case 'object':
      const { childList = [] } = schema
      const complexContent = generateMock(childList as ParamItemSchema[], apiConfig)
      const isEmpty = Object.keys(complexContent).length === 0
      const matched = await matchCustomRule('mock', schema, apiConfig, {
        content: isEmpty ? content : complexContent,
      })
      const { rule: mRule, content: mContent } = matched
      return { rule: mRule, content: type === 'array' ? [mContent] : mContent }
  }
  return matchCustomRule('mock', schema, apiConfig, { content })
}

export default convertToMock
