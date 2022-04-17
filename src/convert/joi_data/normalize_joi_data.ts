const isPlainObject = (obj: any) => obj !== null && typeof obj === 'object'

/**
 * @description 解析 joi 配置
 * @param {any[]|Record<string,any>} joiConfig joi 配置
 */
function joiToString(joiConfig: string[] | Record<string, string[]>[]): string {
  const initialValue = Array.isArray(joiConfig) ? '' : {} // 初始值
  const content = Object.entries(joiConfig).reduce((result, [key, value]) => {
    const isString = typeof result === 'string'
    const content = isPlainObject(value) ? joiToString(value) : value
    if (isString) return result + content
    return { ...result, [key]: content }
  }, initialValue)

  if (typeof content === 'string') return content
  if (Object.keys(content).length === 0) return ''
  // 转成 string
  const str = Object.entries(content).reduce((result, [key, value], index) => {
    const separator = index === 0 ? '' : ','
    return `${result}${separator}"${key}":${value}`
  }, '')
  return `{${str}}`
}

export default function normalizeJoiData(source: string[] | Record<string, string[]>) {
  return Object.entries(source).reduce((result, [name, config]) => {
    return { ...result, [name]: joiToString(config) }
  }, {})
}
