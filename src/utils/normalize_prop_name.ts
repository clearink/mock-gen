import { API_REQUEST_TYPE } from '../constant'

/**
 * @description 将 name 以 -_[A-Z]拆分开 获得首字母大写的数组
 * @param {string} name 名称字符串
 */
export function normalizeTypeName(name: string) {
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
export function normalizeRootName(baseInfo: ApiListItem['baseInfo']) {
  const { apiURI, apiRequestType } = baseInfo
  const method = API_REQUEST_TYPE.findByValue(apiRequestType)?.key
  const lastSlash = apiURI.replace(/(.*)\//g, '')
  return normalizeTypeName(`${method}_${lastSlash}`).join('')
}
