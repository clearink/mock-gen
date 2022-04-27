import { isString, isArray, isObject } from '../../utils/validate_type'

export default function normalizeMockData(
  template: MockTemplateType | MockTemplateType[],
  raw?: true // 渲染原始数据
): string {
  // hack 修复 normalize 时失效
  if (!isObject(template)) return raw ? template : `"${template}"`

  const initialValue = isArray(template) ? '' : {}
  const $template: [string, MockTemplateValue | MockTemplateType][] = Object.entries(template) // [string, ][]
  const content = $template.reduce((result, [key, value]) => {
    // 数组的情况一定要转成字符串
    if (isString(result)) return result + normalizeMockData(value as MockTemplateType, raw)

    const { rule, content, render_raw } = value as MockTemplateValue
    const suffix = rule ? `|${rule}` : ''
    const prop = `${key}${suffix}`

    return { ...result, [prop]: normalizeMockData(content, render_raw) }
  }, initialValue)

  // 数组字符串
  if (isArray(template)) return `[${content}]`

  const str = Object.entries(content).reduce((result, [key, value], index) => {
    const separator = index === 0 ? '' : ','
    return `${result}${separator}"${key}":${value}`
  }, '')
  return `{${str}}`
}
