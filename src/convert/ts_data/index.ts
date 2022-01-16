import { API_PARAM_REQUIRED } from '../../constant'
import getStructMap from '../../utils/get_struct_map'
import {
  renderTsEnum,
  matchCustomRule,
  judgeGenerateEnum,
  normalizeParam,
  normalizeParamType,
} from '../utils'
import { normalizeTsData } from './normalize_ts_data'

/**
 * @description 生成 typescript 文件
 * @param apiConfig api 配置
 * @returns
 */
function convertToTs(apiConfig: ApiListItem) {
  const { requestInfo, urlParam, resultInfo } = apiConfig
  const body = generateTs(requestInfo, apiConfig) // body 参数
  const query = generateTs(urlParam, apiConfig) // query 参数
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
function generateTs(schemaList: ParamItemSchema[], apiConfig: ApiListItem): Record<string, any> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { structureID, paramNotNull } = schema
    if (schema.hasOwnProperty('structureID')) {
      const struct = structMap.get(structureID!)?.struct
      if (!struct) return result
      return { ...result, ...generateTs(struct, apiConfig) }
    }
    const { type, content } = schemaToTs(schema, apiConfig) ?? {
      type: 'any',
      content: 'any',
    }
    // 是否为必填项
    const suffix = API_PARAM_REQUIRED.when(paramNotNull, 'required') ? '' : '?'
    const paramKey = `"${schema.paramKey}"${suffix}`.replace(/\s/g, '')
    return { ...result, [paramKey]: { type, content: content } }
  }, {})
}

/**
 *
 * @param schema 字段配置
 * @param apiConfig api 配置
 * @returns
 */
function schemaToTs(schema: ParamItemSchema, apiConfig: ApiListItem) {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 自定义渲染规则
  const bindMatchRule = matchCustomRule('ts', schema, apiConfig)
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, bindMatchRule)
  if (shouldGenerate) return renderTsEnum(shouldGenerate.ts_type, type)

  let ts: any = 'any'
  switch (type) {
    case 'string':
    case 'char':
    case 'date':
    case 'datetime':
      ts = 'string'
      break
    case 'file':
      // 暂时不知道是啥玩意儿
      ts = 'any'
      break
    case 'int':
    case 'float':
    case 'double':
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      ts = 'number'
      break
    case 'boolean':
      ts = 'boolean'
      break
    case 'null':
      ts = 'null'
      break
    case 'array':
    case 'json':
    case 'object':
      const { childList = [] } = schema
      const defaultTs = type === 'array' ? 'any[]' : 'Record<string, any>'
      const items = generateTs(childList as ParamItemSchema[], apiConfig)
      const isEmpty = Object.keys(items).length === 0
      ts = isEmpty ? defaultTs : items
  }
  return { content: bindMatchRule({ ts_type: ts }).ts_type, type }
}

export default convertToTs
