import { isString, isArray, isObject } from '../../utils/validate_type'

type MockTemplateType =
  | string
  | string[]
  | Record<string, MockTemplate>
  | Record<string, MockTemplate>[]
interface MockTemplate {
  mock_rule?: string
  mock_type: MockTemplateType
}
export default function normalizeMockData(template: MockTemplateType): string {
  // hack 修复 normalize 时失效
  if (isString(template)) return `"${template}"`

  const initialValue = isArray(template) ? '' : {}
  const $template = Object.entries(template)

  const content = $template.reduce((result, [key, value]) => {
    if (isString(result)) return result + normalizeMockData(value)

    const { mock_rule, mock_type } = value
    const suffix = mock_rule ? `|${mock_rule}` : ''
    const prop = `${key}${suffix}`

    return { ...result, [prop]: normalizeMockData(mock_type) }
  }, initialValue)

  if (isString(content)) return `[${content}]`

  const str = Object.entries(content).reduce((result, [key, value], index) => {
    const separator = index === 0 ? '' : ','
    return `${result}${separator}"${key}":${value}`
  }, '')
  return `{${str}}`
}
