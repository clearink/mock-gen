import generateEnum from './generate_enum'
import matchCustomRule from './match_custom_rule'
import { API_REQUEST_PARAM_TYPE as TYPE } from '../../constant'

const typeList = ['enum', 'json', 'object', 'array'] // 这几种才能生成枚举值

// TODO: 待优化 是否传入apiConfig

/**
 * @description 判断是否能够生成枚举
 * @param matchType 匹配类型 mock joi ts
 * @param schema 字段配置
 * @param apiConfig api 配置
 * @returns
 */
export default function judgeGenerateEnum(
  schema: ParamItemSchema,
  matchRule: (initState: any) => CustomMockRule
) {
  const { paramType, paramValueList = [], childList = [] } = schema

  const list = TYPE.when(paramType, 'enum') ? childList : paramValueList
  const shouldGenerate = list.length > 0 || TYPE.when(paramType, typeList)

  const enumList = generateEnum(list, shouldGenerate)

  if (enumList.length <= 0) return false
  return matchRule({
    mock_rule: '1',
    mock_type: enumList,
    joi_type: enumList,
    ts_type: enumList,
  })
}
