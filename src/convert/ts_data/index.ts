import { API_PARAM_REQUIRED } from '../../constant'
import getStructMap from '../../utils/get_struct_map'
import {
  renderTsEnum,
  matchCustomRule,
  judgeGenerateEnum,
  normalizeParam,
  normalizeParamType,
} from '../utils'

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
  return { request: { body, query }, response }
}

/**
 * @description 递归得到 ts 数据
 * @param schemaList 字段列表
 * @param apiConfig api 配置
 * @returns
 */
function generateTs(schemaList: ParamItemSchema[], apiConfig: ApiListItem): Record<string, any> {
  const structMap = getStructMap(true)
  return normalizeParam(schemaList).reduce(async (result, schema) => {
    const { structureID, paramNotNull } = schema
    if (schema.hasOwnProperty('structureID')) {
      const struct = structMap.get(structureID!)?.struct
      if (!struct) return result
      return { ...result, ...generateTs(struct, apiConfig) }
    }
    const content = (await schemaToTs(schema, apiConfig)) ?? {
      tsType: 'any',
      tsContent: 'any',
    }
    // 是否为必填项
    const suffix = API_PARAM_REQUIRED.when(paramNotNull, 'required') ? '' : '?'
    const paramKey = `${schema.paramKey}${suffix}`.replace(/\s/g, '')
    return { ...result, [paramKey]: content }
  }, {})
}

/**
 *
 * @param schema 字段配置
 * @param apiConfig api 配置
 * @returns
 */
async function schemaToTs(
  schema: ParamItemSchema,
  apiConfig: ApiListItem
): Promise<Record<string, any>> {
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema)
  // 获取枚举值
  const shouldGenerate = await judgeGenerateEnum('ts', schema, apiConfig)

  if (shouldGenerate !== false) {
    return renderTsEnum(shouldGenerate.tsContent, type)
  }

  switch (type) {
    case 'string':
    case 'char':
    case 'date':
    case 'datetime':
      return matchCustomRule('ts', schema, apiConfig, { tsContent: 'string' })
    case 'file':
      // 暂时不知道是啥玩意儿
      return matchCustomRule('ts', schema, apiConfig, { tsContent: 'any' })
    case 'int':
    case 'float':
    case 'double':
    case 'number':
    case 'byte':
    case 'short':
    case 'long':
      return matchCustomRule('ts', schema, apiConfig, { tsContent: 'number' })
    case 'boolean':
      return matchCustomRule('ts', schema, apiConfig, { tsContent: 'boolean' })
    case 'null':
      return matchCustomRule('ts', schema, apiConfig, { tsContent: 'null' })
    case 'array':
    case 'json':
    case 'object':
      const { childList = [] } = schema
      const tsType = type === 'array' ? 'any[]' : 'Record<string, any>'
      const items = generateTs(childList as ParamItemSchema[], apiConfig)
      const isEmpty = Object.keys(items).length === 0
      return matchCustomRule('ts', schema, apiConfig, {
        tsContent: isEmpty ? tsType : items,
        tsType: type,
      })
  }
  return { tsType: 'any', tsContent: 'any' }
}

export default convertToTs
