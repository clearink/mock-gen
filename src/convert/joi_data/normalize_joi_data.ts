import { isArray, isObject, isString } from '../../utils/validate_type'
/**
 * @description 解析 joi 配置
 * @param {any[]|Record<string,any>} template joi 配置
 */
type TemplateType = string[] | Record<string, string[]>
export default function normalizeJoiData<T extends TemplateType>(template: T): string {
  const initialValue = isArray(template) ? '' : {} // 初始值

  const content = Object.entries(template).reduce((result, [key, value]) => {
    const content = isObject<T>(value) ? normalizeJoiData(value) : value
    if (isString(result)) return result + content
    return { ...result, [key]: content }
  }, initialValue)

  if (isString(content)) return content

  // 转成 string
  const str = Object.entries(content).reduce((result, [key, value], index) => {
    const separator = index === 0 ? '' : ','
    return `${result}${separator}"${key}":${value}`
  }, '')
  return `{${str}}`
}
