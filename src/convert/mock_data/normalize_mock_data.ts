import { isString, isArray } from '../../utils/validate_type'

export default function normalizeMockData(
  template: MockTemplateType | MockTemplateType[],
  raw?: true // 渲染原始数据
): string {
  // hack 修复 normalize 时失效
  if (isString(template)) return raw ? template : `"${template}"`

  const initialValue = isArray(template) ? '' : {}
  const $template: [string, MockTemplateValue | MockTemplateType][] = Object.entries(template) // [string, ][]
  const content = $template.reduce((result, [key, value]) => {
    // 数组的情况一定要转成字符串
    if (isString(result)) return result + normalizeMockData(value as MockTemplateType, raw)

    const { mock_rule, mock_type, render_raw } = value as MockTemplateValue
    const suffix = mock_rule ? `|${mock_rule}` : ''
    const prop = `${key}${suffix}`

    return { ...result, [prop]: normalizeMockData(mock_type, render_raw) }
  }, initialValue)

  // 数组字符串
  if (isArray(template)) return `[${content}]`

  const str = Object.entries(content).reduce((result, [key, value], index) => {
    const separator = index === 0 ? '' : ','
    return `${result}${separator}"${key}":${value}`
  }, '')
  return `{${str}}`
}
