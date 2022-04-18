import { REPLACE_FLAG } from '../../constant'
import getStructMap from '../../utils/get_struct_map'
import {
  CycleCache,
  renderMockEnum,
  matchCustomRule,
  normalizeParam, // 修正错误的属性名称
  judgeGenerateEnum,
  normalizeParamType,
} from '../utils'
import normalizeMockArgs from './normalize_mock_args'
/**
 *
 * @param apiConfig api 配置
 * @returns
 */
function convertToMock(apiConfig: ApiListItem) {
  const { resultInfo } = apiConfig
  CycleCache.clear() // 清空 cache
  const mockRaw = generateMock(resultInfo, apiConfig, [])
  console.log(CycleCache)
  return mockRaw
}

/**
 * @param schemaList 需要分析的 API 数据
 * @param apiConfig API 配置
 * @returns
 */
function generateMock(
  schemaList: ParamItemSchema[],
  apiConfig: ApiListItem,
  parentKeys: string[]
): Record<string, any> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    if (schema.hasOwnProperty('structureID')) {
      const id = schema.structureID!
      const struct = structMap.get(id)?.struct
      if (!struct) return result
      return { ...result, ...generateMock(struct, apiConfig, parentKeys) }
    }

    const parents = parentKeys.concat(schema.paramKey)
    const originalType = schema.originalType
    if (CycleCache.shouldCheck(originalType)) {
      CycleCache.set(parents, { type: originalType })
      if (CycleCache.isCycle(parents, originalType)) {
        return result
      }
    }
    const { mock_rule, mock_type } = schemaToMock(schema, apiConfig, parents)
    // if (CycleCache.isCycle(parents, originalType)) {
    //   console.log('cycle', parents, CycleCache, mock_type)
    //   // CycleCache.set
    // } else
    CycleCache.delete(parents) // 当前数据
    const suffix = mock_rule ? `|${mock_rule}` : ''
    const paramKey = `${schema.paramKey}${suffix}`.replace(/\s/g, '')
    return { ...result, [paramKey]: mock_type }
  }, {})
}

/**
 * @description 根据 schema 生成 mock 数据
 * @param schema 字段配置
 * @param apiConfig api配置
 * @returns
 */
function schemaToMock(schema: ParamItemSchema, apiConfig: ApiListItem, parentKeys: string[]) {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 自定义渲染规则
  const bindMatchRule = matchCustomRule('mock', schema, apiConfig)
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, bindMatchRule)

  if (shouldGenerate) return renderMockEnum(shouldGenerate, type)

  let content: any = `@word(${REPLACE_FLAG})`

  // 判断类型
  switch (type) {
    case 'string':
      content = `@word()`
      break
    case 'file':
      content = `暂不支持[file]类型`
      break
    case 'int':
      content = `@integer(${REPLACE_FLAG})`
      break
    case 'float':
    case 'double':
      content = `@float(${REPLACE_FLAG})`
      break
    case 'date':
    case 'datetime':
      content = `@date('yyyy-MM-dd hh:mm:ss')`
      break
    case 'boolean':
      content = `@boolean(${REPLACE_FLAG})`
      break
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      content = `@integer(${REPLACE_FLAG})`
      break
    case 'null':
      content = null
      break
    case 'char':
      content = `@character('lower')`
      break
    case 'array':
    case 'json':
    case 'object':
      const childList = (schema.childList ?? []) as ParamItemSchema[]
      const childContent = generateMock(childList, apiConfig, parentKeys)
      const isEmpty = Object.keys(childContent).length === 0
      const isArray = type === 'array'
      content = isEmpty && isArray ? content : childContent
  }
  const { mock_rule, mock_type, mock_args } = bindMatchRule({ mock_type: content })
  const mockType = normalizeMockArgs(schema, mock_args, mock_type)
  if (type === 'array') return { mock_rule, mock_type: [mockType] }
  return { mock_rule, mock_type: mockType }
}

export default convertToMock
