import { normalizeTypeName } from "../../../utils/normalize_prop_name"

/**
 * @description 压缩字段名
 */
export default function compressName(parentName: string, name: string, maxLen: number) {
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
