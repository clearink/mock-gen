import { API_REQUEST_TYPE } from '../../constant'

/**
 * @description 将 name 以 -_[A-Z]拆分开 获得首字母大写的数组
 * @param {string} name 名称字符串
 */
function normalizeTypeName(name: string) {
  return name
    .replace(/([A-Z])/g, '_$1') // 大写字母前加 _
    .replace(/^\w|(?<=[-_])(\w)/g, ($0) => $0.toUpperCase())
    .replace(/\s/g, '') // 去除空格
    .split(/[-_]/g) // 按照特殊符号拆开
    .filter(Boolean) // 去除空字符; // 特殊符号首字母全部转成大写;
}

/**
 * @description
 * 获取 namespace name
 */
export function normalizeRootName(baseInfo) {
  const { apiURI, apiRequestType } = baseInfo
  const method = API_REQUEST_TYPE.findByValue(apiRequestType)?.key
  const lastSlash = apiURI.replace(/(.*)\//g, '')
  return normalizeTypeName(`${method}_${lastSlash}`).join('')
}

/**
 * @description 压缩字段名
 */
function compressName(parentName: string, name: string, maxLen: number) {
  const parentList = normalizeTypeName(parentName)

  const nameList = normalizeTypeName(name)

  let normalized = parentList.concat(nameList).join('').replace(/\?/g, '')

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
    parentList.length && nameList.unshift(parentList.pop())
    normalized = parentList.concat(nameList).join('').replace(/\?/g, '')
  }
  return normalized
}
/**
 * @description 将 ts 生成的类型对象处理成能够被渲染的 cjs 数据
 * 步骤
 * 1. 扁平化整个对象
 * 2. 生成对应的名称
 * 3. 返回
 */
export function normalizeTsData(parentName: string, data: Record<string, any> = {}) {
  return Object.entries(data).reduce((result, [name, config]) => {
    const { tsType, tsContent } = config
    // 如果是对象则需要计算出对应的 typeName
    if (tsContent === null || typeof tsContent !== 'object') {
      const prop = name.replace(/\s/g, '')
      result[parentName] = { ...result[parentName], [prop]: tsContent }
      return { ...result }
    }
    // 最长不超过 24 个字符
    const optimized = compressName(parentName, name, 24)
    const typeName = `${optimized}${tsType === 'array' ? '[]' : ''}`

    result[parentName] = { ...result[parentName], [name]: typeName }
    return { ...result, ...normalizeTsData(optimized, tsContent) }
  }, {})
}
