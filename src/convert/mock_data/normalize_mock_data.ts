import { isString, isArray, isObject } from '../../utils/validate_type'

export default function normalizeMockData(
  template: MockTemplateType | MockTemplateType[],
  raw?: true // 渲染原始数据
): string {
  // hack 修复 normalize 时失效
  if (!isObject(template)) return raw || !isString(template) ? template : `"${template}"`

  const isArrayType = isArray(template)
  const $template: [string, MockTemplateValue | MockTemplateType][] = Object.entries(template) // [string, ][]
  const content = $template.reduce((result, [key, value], index) => {
    // 数组的情况一定要转成字符串
    const separator = index === 0 ? '' : ','
    if (isArrayType) {
      const content = normalizeMockData(value as MockTemplateType, raw)
      return `${result}${separator}${content}`
    }

    const { rule, content, render_raw } = value as MockTemplateValue
    const suffix = rule ? `|${rule}` : ''
    const prop = `${key}${suffix}`
    return `${result}${separator}"${prop}":${normalizeMockData(content, render_raw)}`
  }, '')

  return isArrayType ? `[${content}]` : `{${content}}`
}
