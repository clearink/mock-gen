import { API_REQUEST_PARAM_TYPE as TYPE, API_PARAM_REQUIRED } from '../../constant'
import getStructMap from '../../utils/get_struct_map'

import {
  judgeGenerateEnum,
  matchCustomRule,
  normalizeParam,
  normalizeParamType,
  renderJoiEnum,
} from '../utils'
import convertJoiConfig from './convert_joi_config'

/**
 * @description 解析配置得到 joi 数据 **暂时不处理 headers 参数**
 * @param apiConfig api配置
 * @returns
 */
function convertToJoi(apiConfig: ApiListItem) {
  const { requestInfo, urlParam, restfulParam } = apiConfig
  // get 请求应当是没有 body 参数的
  const bodyParams = generateJoi(requestInfo, apiConfig, true) // body 参数
  const queryParams = generateJoi(urlParam, apiConfig) // query 参数
  const restfulParams = generateJoi(restfulParam, apiConfig) // restful参数
  return {
    bodyParams: convertJoiConfig(bodyParams),
    queryParams: convertJoiConfig(queryParams),
    restfulParams: convertJoiConfig(restfulParams),
  }
}
export interface ConvertJoiResult {
  bodyParams: Record<string, any>
  queryParams: Record<string, any>
  restfulParams: Record<string, any>
}

/**
 * @description
 * @param schemaList 字段配置列表
 * @param apiConfig api配置
 * @param strict 是否精确匹配类型
 * @returns
 */
function generateJoi(
  schemaList: ParamItemSchema[],
  apiConfig: ApiListItem,
  strict = false
): Record<string, string[]> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { structureID, paramNotNull, paramType } = schema
    if (schema.hasOwnProperty('structureID')) {
      const struct = structMap.get(structureID!)?.struct
      if (!struct) return result
      return { ...result, ...generateJoi(struct, apiConfig, strict) }
    }

    const content = schemaToJoi(schema, apiConfig, strict) as string[]
    if (content.length <= 0) return result // 为空直接返回
    // hack 如果为 string 类型 默认允许空串
    if (TYPE.when(paramType, 'string')) content.push(".allow('')")
    // 是否为必填项
    if (API_PARAM_REQUIRED.when(paramNotNull, 'required')) content.push('.required()')
    const paramKey = schema.paramKey.replace(/\s/g, '')
    return { ...result, [paramKey]: ['joi.'].concat(content as string[]) }
  }, {})
}

/**
 * @description 解析字段获得相应的 joi 数据
 * @param schema 字段配置
 * @param apiConfig api配置
 * @param strict 是否精确匹配
 * @returns
 */
function schemaToJoi(schema: ParamItemSchema, apiConfig: ApiListItem, strict = false) {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 自定义渲染规则
  const bindMatchRule = matchCustomRule('joi', schema, apiConfig)
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, bindMatchRule)

  if (shouldGenerate) return renderJoiEnum(shouldGenerate.joi_type, type)

  // 判断类型
  switch (type) {
    case 'string':
    case 'char':
    case 'date':
    case 'datetime':
      return ['string()']
    case 'file':
      // 暂时不知道是啥玩意儿
      return []
    case 'int':
    case 'float':
    case 'double':
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      return [strict ? 'number()' : 'string()']
    case 'boolean':
      return [strict ? 'boolean()' : 'string()']
    case 'null':
      // 不验证该种类型, 因为 null 类型大多数不会被传递给后端
      return []
    case 'array':
    case 'json':
    case 'object':
      const { childList = [] } = schema
      const joiType = type === 'array' ? 'array' : 'object'
      const items = generateJoi(childList as ParamItemSchema[], apiConfig, strict)
      if (Object.keys(items).length === 0) return [`${joiType}()`]
      if (type !== 'array') return ['object(', items, ')']
      return ['array().', 'items(joi.object(', items, '))']
  }

  return []
}
export default convertToJoi
