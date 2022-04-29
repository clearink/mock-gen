import { isObject } from '../../../utils/validate_type'
import { API_PARAM_REQUIRED, RULE_CACHE_SEPARATOR as SEPARATOR } from '../../../constant'
import compressName from './compress_name'

/**
 * @description 将 ts 生成的类型对象处理成能够被渲染的 cjs 数据
 * @param parentName 初始名称
 * @param data 数据源
 * @returns
 */
export function normalizeTsData(
  rootName: string, // 根名称
  data: Record<string, SchemaToTsReturn> = {}
): Record<string, any> {
  const tsCache = new Map<string, string>() // 记录循环字段的类型声明

  const result: Record<string, any> = {}
  const stack = Object.entries(data)

  while (stack.length) {
    const [name, config] = stack.shift()!
    const { isArrayType, content, parents, paramNotNull, cycle_path } = config

    const fullPaths = [rootName].concat(parents)

    const required = API_PARAM_REQUIRED.when(+paramNotNull, 'required') // 是否必填
    const attr = `"${name}"${required && !cycle_path ? '' : '?'}`

    // 父级名称
    const parentName = compressName(fullPaths.join('-'), '', 24)
    if (isObject(content)) {
      const optimized = compressName(parentName, name.replace(/\?|"/g, ''), 24)
      const typeName = `${optimized}${isArrayType ? '[]' : ''}`
      tsCache.set(fullPaths.concat(name).join('=>'), typeName)
      result[parentName] = { ...result[parentName], [attr]: typeName }
      stack.unshift(...Object.entries(content as typeof data))
    } else if (cycle_path) {
      const paths = [rootName].concat(cycle_path)
      const cacheType = tsCache.get(paths.join(SEPARATOR))
      result[parentName] = { ...result[parentName], [attr]: cacheType ?? content }
    } else {
      result[parentName] = { ...result[parentName], [attr]: content }
    }
  }
  return result
}
