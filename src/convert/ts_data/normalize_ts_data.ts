import { normalizeTypeName } from '../../utils/normalize_prop_name'

/**
 * @description 压缩字段名
 */
function compressName(parentName: string, name: string, maxLen: number) {
  const parentList = normalizeTypeName(parentName)

  const nameList = normalizeTypeName(name)

  let normalized = parentList.concat(nameList).join('')

  // 长度符合
  while (normalized.length > maxLen) {
    // 最长和最短的字符串长度
    const maxItem = Math.max(...nameList.map((item) => item.length))
    let minItem = Math.min(...nameList.map((item) => item.length))

    if ((maxItem + minItem) % 2 === 0) minItem -= 1 // 强制 itemAvgLen 为奇数 防止死循环

    const itemAvgLen = ~~((maxItem + minItem) / 2)
    const minLen = Math.max(~~(maxLen / nameList.length), itemAvgLen)

    // 每次只尝试一个 从右向左匹配
    for (let i = nameList.length - 1; i >= 0; i--) {
      const item = nameList[i]
      if (item.length <= minLen) continue
      nameList[i] = item.substring(0, item.length - 2)
      break
    }
    parentList.length && nameList.unshift(parentList.pop()!)
    normalized = parentList.concat(nameList).join('').replace(/\?/g, '')
  }
  return normalized
}

/**
 * @description 将 ts 生成的类型对象处理成能够被渲染的 cjs 数据
 * @param parentName 初始名称
 * @param data 数据源
 * @returns
 */
export function normalizeTsData(
  parentName: string,
  data: Record<string, { type: string; content: any }> = {}
): Record<string, any> {
  return Object.entries(data).reduce((result, [name, config]) => {
    const { type, content } = config
    if (content === null || typeof content !== 'object') {
      result[parentName] = { ...result[parentName], [name]: content }
      return { ...result }
    }
    // 如果是对象则需要计算出对应的 typeName
    // 最长不超过 24 个字符
    const optimized = compressName(parentName, name.replace(/\?|"/g, ''), 24)
    const suffix = type === 'array' ? '[]' : ''
    const typeName = `${optimized}${suffix}`

    result[parentName] = { ...result[parentName], [name]: typeName }
    return { ...result, ...normalizeTsData(optimized, content) }
  }, {} as Record<string, any>)
}
