import { isObject, isArray, isString } from '../../../utils/validate_type'

export default function getCycleTemplate($target: MockTemplateType | [MockTemplateType], paths: string[]) {
  let target = isArray($target) ? $target[0] : $target
  if (!isObject(target)) return false
  for (const path of paths) {
    // 不含有该字段 or target 是字符串的 返回 false
    if (!target.hasOwnProperty(path) || isString(target)) return false
    const { mock_type } = target[path] as MockTemplateValue
    if (!isObject(mock_type)) return false
    target = isArray(mock_type) ? mock_type[0] : mock_type
  }
  return isString(target) ? false : target
}
