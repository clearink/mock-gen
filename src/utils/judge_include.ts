/**
 * @description 是否被包含
 * @param {string} name groupName/apiName
 * @param {string[]|undefined} config 配置文件
 * @param {boolean} includeEmpty 值为空也可
 * @returns {boolean}
 */
export default function judgeInclude(name: string, config: string[] = [], includeEmpty = true) {
  if (includeEmpty && config.length === 0) return true
  return config.includes(name)
}
