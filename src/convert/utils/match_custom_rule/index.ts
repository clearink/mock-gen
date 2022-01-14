import { API_REQUEST_PARAM_TYPE as TYPE } from '../../../constant'
import getMockConfig from '../../../utils/get_mock_config'
import judgeInclude from '../../../utils/judge_include'
import findMockPlaceholder from './find_mock_placeholder'
import judgeShouldMatch from './judge_should_match'

/**
 * @description 格式化自定义匹配规则
 * @param paramLimit 自定义匹配规则
 * @returns
 */
function normalizeParamLimit(paramLimit?: string): CustomMockRule {
  try {
    if (!paramLimit?.replace(/\s+/g, '')) throw new Error('Empty ParamLimit')
    return eval(`(()=>(${paramLimit}))()`)
  } catch (error) {
    return { content: paramLimit }
  }
}

/**
 *
 * @param matchType 匹配类型 mock joi ts
 * @param schema 字段配置
 * @param apiConfig api 配置
 * @param initState
 * @returns
 */
async function matchCustomRule(
  matchType: 'mock' | 'joi' | 'ts',
  schema: ParamItemSchema,
  apiConfig: ApiListItem,
  initState: CustomMockRule
) {
  const { paramKey, paramType, paramLimit } = schema

  // 当前字段的 keyString
  const pt = TYPE.findByValue(paramType)!.key

  // 自定义 mock 规则
  const result = normalizeParamLimit(paramLimit)
  // 针对 mock
  const editRule = !result.rule // 允许修改 rule
  const editContent = !result.content // 允许修改 content
  const editArgs = !result.args // 允许修改 args
  // 针对 request 参数
  const editJoi = !result.joi // 允许修改 joi 数据
  // 针对 ts 类型
  const editTsType = !result.tsType // 允许修改 ts 类型
  const editTsContent = !result.tsContent // 允许修改 ts 数据

  // 自定义 mock 规则同时设置了 rule 与 content 直接返回
  if (!editContent && !editRule && matchType === 'mock') return result
  if (!editJoi && matchType === 'joi') return result
  if (!editTsType && !editTsContent && matchType === 'ts') return result

  // 允许修改时才可以设置默认值
  if (editRule) result.rule = initState?.rule
  if (editContent) result.content = initState?.content
  if (editArgs) result.args = initState?.args
  if (editJoi) result.joi = initState?.joi
  if (editTsType) result.tsType = initState?.tsType
  if (editTsContent) result.tsContent = initState?.tsContent

  const { customMatchRule } = await getMockConfig(true)

  for (const [name, config] of Object.entries(customMatchRule || {})) {
    // 生成正则表达式
    const reg = new RegExp(name)
    const list = ([] as CustomMockRule[]).concat(config)
    for (const item of list) {
      if (item !== null && typeof item === 'object') {
        const { type, important = false } = item
        // 先匹配 key 数据
        if (!reg.test(paramKey)) continue
        
        // 匹配 类型
        if (!judgeInclude(pt, ([] as string[]).concat(type || []))) continue

        // 匹配 配置
        if (!judgeShouldMatch(item, apiConfig)) continue

        if (item.hasOwnProperty('rule') && (important || editRule)) {
          result.rule = item.rule
        }
        if (item.hasOwnProperty('content') && (important || editContent)) {
          result.content = item.content
        }
        if (item.hasOwnProperty('args') && (important || editArgs)) {
          result.args = item.args
        }

        if (item.hasOwnProperty('joi') && (important || editJoi)) {
          result.joi = item.joi
        }

        if (item.hasOwnProperty('tsType') && (important || editTsType)) {
          result.tsType = item.tsType
        }
        if (item.hasOwnProperty('tsContent') && (important || editTsType)) {
          result.tsContent = item.tsContent
        }
      } else if (reg.test(paramKey) && editContent) {
        result.content = item
      }
    }
  }
  // 完善 mock_data.js 根据类型推断的 mock 规则
  const hasDefaultContent = initState?.hasOwnProperty?.('content')
  const contentEqual = result.content === initState?.content
  const matchMock = matchType === 'mock'
  if (hasDefaultContent && contentEqual && matchMock) {
    try {
      const args = findMockPlaceholder(schema, result.args)
      result.content = result.content.replace('{args}', args)
    } catch (error) {}
  }
  return result
}

export default matchCustomRule
