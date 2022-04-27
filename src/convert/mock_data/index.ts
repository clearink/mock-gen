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
import renderCycleTemplate from '../utils/render_cycle_template'
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
): Record<string, SchemaToMockReturn> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { paramKey, originalType: paramType } = schema

    // 自定义数据结构
    const struct = structMap.get(schema.structureID!)?.struct
    if (struct) return { ...result, ...generateMock(struct, apiConfig, parents) }

    const paths = parents.concat(paramKey) // 新的父级路径

    if (CycleCache.shouldCheck(paramType)) {
      // 为了拿到循环数据结构的 mock_rule 不得已多循环了一次 所以 cycle_path 要去除一层
      CycleCache.set(paths, { paramType, cycle_path: parents.slice(0, -1) })
      if (CycleCache.isCycle(parents, paramType)) return result
    }
    const { cycle_path, cycle_depth, ...rest } = schemaToMock(schema, apiConfig, paths)

    if (cycle_path) CycleCache.set(paths, { paramType, cycle_path })
    else CycleCache.delete(paths) // 当前数据

    return { ...result, [paramKey]: { cycle_depth, ...rest } }
  }, {})
}

/**
 * @description 根据 schema 生成 mock 数据
 * @param schema 字段配置
 * @param apiConfig api配置
 * @returns
 */
function schemaToMock(
  schema: ParamItemSchema,
  apiConfig: ApiListItem,
  parents: string[]
): SchemaToMockReturn {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 自定义渲染规则
  const bindMatchRule = matchCustomRule('mock', schema, apiConfig)
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, bindMatchRule)

  if (shouldGenerate) return renderMockEnum(shouldGenerate)

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
      const childContent = generateMock(childList, apiConfig, parents)
      const isEmpty = Object.keys(childContent).length === 0
      const isArray = type === 'array'
      content = isEmpty && isArray ? content : childContent
  }
  const {
    mock_rule: rule,
    mock_type,
    mock_args,
    cycle_path,
    cycle_depth,
  } = bindMatchRule({ mock_type: content })
  content = normalizeMockArgs(schema, mock_args, mock_type)
  return { content: type === 'array' ? [content] : content, rule, cycle_path, cycle_depth }
}

export default convertToMock
