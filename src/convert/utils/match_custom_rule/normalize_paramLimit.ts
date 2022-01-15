/**
 * @description 格式化自定义匹配规则
 * @param paramLimit 自定义匹配规则
 * @returns
 */
function normalizeSchemaLimit(paramLimit?: string): CustomMockRule {
  try {
    if (!paramLimit?.replace(/\s+/g, '')) throw new Error('Empty ParamLimit')
    return eval(`(()=>(${paramLimit}))()`)
  } catch (error) {
    return { mock_type: paramLimit }
  }
}

export function normalizeParamLimit(
  matchType: 'mock' | 'joi' | 'ts',
  initState: CustomMockRule,
  paramLimit?: string
) {
  const result = normalizeSchemaLimit(paramLimit) as Required<CustomMockRule>
  const { mock_args, mock_rule, mock_type, joi_type, ts_type } = result
  const edit = {
    mock_rule: !mock_rule, // 允许修改 rule
    mock_type: !mock_type, // 允许修改 content
    mock_args: !mock_args, // 允许修改 args
    joi_type: !joi_type, // 允许修改 joi 数据
    ts_type: !ts_type, // 允许修改 ts 类型
  }
  let shouldMatch = false // 是否应该进行匹配
  if (!edit.mock_rule && !edit.mock_type && !edit.mock_args && matchType === 'mock') {
    return { result, shouldMatch, edit }
  }
  if (!edit.joi_type && matchType === 'joi') return { result, edit, shouldMatch }
  if (!edit.ts_type && matchType === 'ts') return { result, edit, shouldMatch }

  shouldMatch = true
  // 允许修改时才可以设置默认值
  if (edit.mock_rule) result.mock_rule = initState?.mock_rule
  if (edit.mock_type) result.mock_type = initState?.mock_type
  if (edit.mock_args) result.mock_args = initState?.mock_args
  if (edit.joi_type) result.joi_type = initState?.joi_type
  if (edit.ts_type) result.ts_type = initState?.ts_type
  return { result, edit, shouldMatch }
}
