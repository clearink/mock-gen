import { API_REQUEST_PARAM_TYPE as TYPE, API_PARAM_REQUIRED } from '../../constant'
import getStructMap from '../../utils/get_struct_map'

import {
  CycleCache,
  judgeGenerateEnum,
  matchCustomRule,
  normalizeParam,
  normalizeParamType,
  renderJoiEnum,
} from '../utils'
import normalizeJoiData from './normalize_joi_data'

/**
 * @description 解析配置得到 joi 数据 **暂时不处理 headers 参数**
 * @param apiConfig api配置
 * @returns
 */
function convertToJoi(apiConfig: ApiListItem) {
  // get 请求应当是没有 body 参数的
  const { requestInfo, urlParam, restfulParam } = apiConfig
  CycleCache.clear() // 清空 cache
  const bodyParams = generateJoi(requestInfo, apiConfig) // body 参数
  CycleCache.clear() // 清空 cache
  const queryParams = generateJoi(urlParam, apiConfig) // query 参数
  CycleCache.clear() // 清空 cache
  const restfulParams = generateJoi(restfulParam, apiConfig) // restful参数
  return {
    bodyParams: normalizeJoiData(bodyParams),
    queryParams: normalizeJoiData(queryParams),
    restfulParams: normalizeJoiData(restfulParams),
  }
}
export interface ConvertJoiResult {
  bodyParams: string
  queryParams: string
  restfulParams: string
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
  parents: string[] = [] // 父级路径
): Record<string, string[]> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { paramNotNull, originalType: paramType, paramKey } = schema

    // 自定义数据结构
    const struct = structMap.get(schema.structureID!)?.struct
    if (struct) return { ...result, ...generateJoi(struct, apiConfig, parents) }

    const paths = parents.concat(paramKey) // 新的父级路径

    if (CycleCache.shouldCheck(paramType)) {
      CycleCache.set(paths, { paramType, cycle_path: parents.slice(0, -1) })
      if (CycleCache.isCycle(paths, paramType)) {
        const joiData = [`joi.link("/${parents.join('.')}")`]
        return { ...result, [paramKey]: joiData }
      }
    }

    const { content, cycle_path } = schemaToJoi(schema, apiConfig, paths)

    CycleCache.delete(paths) // 当前数据

    if (content.length <= 0) return result // 为空直接返回
    // hack 如果为 string 类型 默认允许空串
    if (TYPE.when(schema.paramType, 'string')) content.push(".allow('')")
    // 是否为必填项
    const required = API_PARAM_REQUIRED.when(+paramNotNull, 'required')

    if (required && (!cycle_path || !cycle_path.length)) content.push('.required()')

    return { ...result, [paramKey]: ['joi.'].concat(content) }
  }, {})
}

/**
 * @description 解析字段获得相应的 joi 数据
 * @param schema 字段配置
 * @param apiConfig api配置
 * @returns
 */
function schemaToJoi(
  schema: ParamItemSchema,
  apiConfig: ApiListItem,
  parents: string[] = []
): SchemaToJoiReturn {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)

  // 自定义渲染规则
  const bindMatchRule = matchCustomRule('joi', schema, apiConfig)
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, bindMatchRule)

  if (shouldGenerate) return renderJoiEnum(shouldGenerate.joi_type, type)

  let content: any[] = ['any()']
  // 判断类型
  switch (type) {
    case 'string':
    case 'char':
    case 'date':
    case 'datetime':
      content = ['string()']
      break
    case 'file':
      break
    case 'int':
    case 'float':
    case 'double':
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      content = ['number()']
    case 'boolean':
      content = ['boolean()']
    case 'null':
      // 不验证该种类型, 因为 null 类型大多数不会被传递给后端
      break
    case 'array':
    case 'json':
    case 'object':
      const { childList = [] } = schema
      const joiType = type === 'array' ? 'array' : 'object'
      const items = generateJoi(childList as ParamItemSchema[], apiConfig, parents)
      if (Object.keys(items).length === 0) content = [`${joiType}()`]
      else if (type !== 'array') content = ['object(', items, ')']
      else content = ['array().', 'items(joi.object(', items, '))']
  }
  const { cycle_path } = bindMatchRule({})
  return { content, cycle_path }
}
export default convertToJoi
