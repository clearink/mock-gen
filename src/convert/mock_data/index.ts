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
import normalizeMockData from './normalize_mock_data'
import renderCycleTemplate from './render_cycle_template'
/**
 *
 * @param apiConfig api 配置
 * @returns
 */
function convertToMock(apiConfig: ApiListItem) {
  const { resultInfo } = apiConfig
  CycleCache.clear() // 清空 cache
  const template = generateMock(resultInfo, apiConfig)
  return normalizeMockData(renderCycleTemplate(template))
}

/**
 * @param schemaList 需要分析的 API 数据
 * @param apiConfig API 配置
 * @returns
 */
function generateMock(
  schemaList: ParamItemSchema[],
  apiConfig: ApiListItem,
  parents: string[] = []
): Record<string, any> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    if (schema.hasOwnProperty('structureID')) {
      const id = schema.structureID!
      const struct = structMap.get(id)?.struct
      if (!struct) return result
      return { ...result, ...generateMock(struct, apiConfig, parents) }
    }

    const paths = parents.concat(schema.paramKey)
    const type = schema.originalType
    if (CycleCache.shouldCheck(type)) {
      CycleCache.set(paths, { paths, type })
      if (CycleCache.isCycle(paths, type)) return result
    }
    const { mock_rule, mock_type } = schemaToMock(schema, apiConfig, paths)
    CycleCache.delete(paths) // 当前数据
    const paramKey = `${schema.paramKey}`.replace(/\s/g, '')
    return { ...result, [paramKey]: { mock_type, mock_rule } }
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
