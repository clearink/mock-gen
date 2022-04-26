import getStructMap from '../../utils/get_struct_map'
import {
  renderTsEnum,
  matchCustomRule,
  judgeGenerateEnum,
  normalizeParam,
  normalizeParamType,
  CycleCache,
} from '../utils'
import { normalizeTsData } from './normalize_ts_data'

/**
 * @description 生成 typescript 文件
 * @param apiConfig api 配置
 * @returns
 */
function convertToTs(apiConfig: ApiListItem) {
  const { requestInfo, urlParam, resultInfo } = apiConfig
  CycleCache.clear() // 清空 cache
  const body = generateTs(requestInfo, apiConfig) // body 参数
  CycleCache.clear() // 清空 cache
  const query = generateTs(urlParam, apiConfig) // query 参数
  CycleCache.clear() // 清空 cache
  const response = generateTs(resultInfo, apiConfig) // 响应数据
  return {
    body: normalizeTsData('BodyParam', body),
    query: normalizeTsData('QueryParam', query),
    response: normalizeTsData('Response', response),
  }
}

/**
 * @description 递归得到 ts 数据
 * @param schemaList 字段列表
 * @param apiConfig api 配置
 * @returns
 */
function generateTs(
  schemaList: ParamItemSchema[],
  apiConfig: ApiListItem,
  parents: string[] = []
): Record<string, any> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { paramNotNull, paramKey, originalType: paramType } = schema
    if (schema.hasOwnProperty('structureID')) {
      const id = schema.structureID!
      const struct = structMap.get(id)?.struct
      if (!struct) return result
      return { ...result, ...generateTs(struct, apiConfig, parents) }
    }

    const fullPaths = parents.concat(paramKey)

    if (CycleCache.shouldCheck(paramType)) {
      // 为了拿到对应的 mock_rule 不得已多循环了一次
      // 所以要去除用于获取模板的数据
      const cycle_path = parents.slice(0, -1)
      const cache = { parents: cycle_path, paramType, paramKey, cycle_path }
      CycleCache.set(fullPaths, cache)
      if (CycleCache.isCycle(parents, paramType)) return result
    }

    const { type, content, cycle_path } = schemaToTs(schema, apiConfig, fullPaths)

    if (cycle_path) {
    } else CycleCache.delete(fullPaths) // 当前数据
    // 是否为必填项

    return { ...result, [paramKey]: { type, content, paramNotNull } }
  }, {})
}

/**
 *
 * @param schema 字段配置
 * @param apiConfig api 配置
 * @returns
 */
function schemaToTs(
  schema: ParamItemSchema,
  apiConfig: ApiListItem,
  parents: string[]
): { content: string[]; cycle_path?: string[] } {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 自定义渲染规则
  const bindMatchRule = matchCustomRule('ts', schema, apiConfig)
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, bindMatchRule)
  if (shouldGenerate) return renderTsEnum(shouldGenerate.ts_type, type)

  let content: any = 'any'
  switch (type) {
    case 'string':
    case 'char':
    case 'date':
    case 'datetime':
      content = 'string'
      break
    case 'file':
      // 暂时不知道是啥玩意儿
      break
    case 'int':
    case 'float':
    case 'double':
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      content = 'number'
      break
    case 'boolean':
      content = 'boolean'
      break
    case 'null':
      content = 'null'
      break
    case 'array':
    case 'json':
    case 'object':
      const { childList = [] } = schema
      const fallback = type === 'array' ? 'any[]' : 'Record<string, any>'
      const items = generateTs(childList as ParamItemSchema[], apiConfig, parents)
      const isEmpty = Object.keys(items).length === 0
      content = isEmpty ? fallback : items
  }
  const { cycle_path } = bindMatchRule({ ts_type: content })

  return { content, type, cycle_path }
}

export default convertToTs
