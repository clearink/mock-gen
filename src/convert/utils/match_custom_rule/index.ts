import { API_REQUEST_PARAM_TYPE as TYPE } from '../../../constant'
import getMockConfig from '../../../utils/get_mock_config'
import judgeInclude from '../../../utils/judge_include'
import judgeShouldMatch from './judge_should_match'
import { normalizeParamLimit } from './normalize_paramLimit'

/**
 *
 * @param matchType 匹配类型 mock joi ts
 * @param schema 字段配置
 * @param apiConfig api 配置
 * @param initState
 * @returns
 */
function matchCustomRule(
  matchType: 'mock' | 'joi' | 'ts',
  schema: ParamItemSchema,
  apiConfig: ApiListItem
) {
  const { customMatchRule } = getMockConfig(true)
  return (initState: CustomMockRule) => {
    const { paramKey, paramType, paramLimit } = schema

    // 当前字段的类型
    const propType = TYPE.findByValue(paramType, 'string')!.key

    // 自定义 mock 规则
    const { result, edit, shouldMatch } = normalizeParamLimit(matchType, initState, paramLimit)
    if (!shouldMatch) return result

    for (const [name, config] of Object.entries(customMatchRule || {})) {
      // 生成正则表达式
      const reg = new RegExp(name)
      const list = ([] as CustomMockRule[]).concat(config)
      for (const item of list) {
        if (item !== null && typeof item === 'object') {
          const { type = [], important = false } = item
          // 先匹配 key 数据
          if (!reg.test(paramKey)) continue

          // 匹配 类型
          const typeList = ([] as string[]).concat(type)
          if (!judgeInclude(propType, typeList)) continue

          // 匹配 配置
          if (!judgeShouldMatch(item, apiConfig)) continue

          if (item.hasOwnProperty('mock_rule') && (important || edit.mock_rule)) {
            result.mock_rule = item.mock_rule
          }
          if (item.hasOwnProperty('mock_type') && (important || edit.mock_type)) {
            result.mock_type = item.mock_type
          }
          if (item.hasOwnProperty('mock_args') && (important || edit.mock_args)) {
            result.mock_args = item.mock_args
          }

          if (item.hasOwnProperty('joi_type') && (important || edit.joi_type)) {
            result.joi_type = item.joi_type
          }

          if (item.hasOwnProperty('ts_type') && (important || edit.ts_type)) {
            result.ts_type = item.ts_type
          }

          if (item.hasOwnProperty('cycle_depth') && (important || edit.cycle_depth)) {
            result.cycle_depth = item.cycle_depth
          }
        } else if (reg.test(paramKey) && edit.mock_type) {
          result.mock_type = item
        }
      }
    }
    return result
  }
}

export default matchCustomRule
