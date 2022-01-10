import generateEnum from './generate_enum'
import matchCustomRule from './match_custom_rule'
import { API_REQUEST_PARAM_TYPE as TYPE } from '../../constant'

const typeList = ['enum', 'json', 'object', 'array'] // 这几种才能生成枚举值
/**
 * @description 判断是否能够生成枚举
 * @param {*} matchType 匹配类型 mock joi ts
 * @param {*} schema 基本配置
 * @param {*} structMap 数据结构 map
 * @param {*} apiConfig api 配置
 * @returns
 */
export default function judgeGenerateEnum(schema, structMap, apiConfig, { matchType }) {
  const { paramType, paramValueList, childList = [] } = schema

  const list = TYPE.when(paramType, 'enum') ? childList : paramValueList
  const shouldGenerate = list.length > 0 || TYPE.when(paramType, typeList)

  const enumList = generateEnum(structMap, list, shouldGenerate)

  if (enumList.length <= 0) return false

  return matchCustomRule(matchType, schema, apiConfig, {
    content: enumList,
    joi: enumList,
    tsContent: enumList,
    rule: '1',
  })
}
