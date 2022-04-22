import mockjs, { S } from 'mockjs'
// TODO: 完善ts类型
import { isObject, isArray, isString } from './validate_type'

/**
 * 获取相关模板
 */
function getCycleTemplate($target: any, paths: string[]) {
  let target = isArray($target) ? $target[0] : $target
  if (!isObject(target)) return false
  for (const path of paths) {
    const keys = Object.keys(target)
    const matched = keys.find((key) => key.replace(/\|.*$/g, '') === path)
    if (!matched || isString(target)) return false
    const type = target[matched]
    if (!isObject(type)) return false
    target = isArray(type) ? type[0] : type
  }
  return isString(target) ? false : target
}

/**
 * @description 删除 no-match-placeholder
 */
export function removeNoMathPlaceholder(result: any): any {
  if (isArray(result)) {
    return result
      .map((item) => {
        if (isObject(item)) return removeNoMathPlaceholder(item)
        return item
      })
      .filter((item) => item !== 'NO_MATCH_PLACEHOLDER')
  } else if (isObject(result)) {
    const target: Record<string, any> = {}
    for (const [key, value] of Object.entries(result)) {
      if (isObject(value)) target[key] = removeNoMathPlaceholder(value)
      else if (value !== 'NO_MATCH_PLACEHOLDER') target[key] = value
    }
    return target
  }
  return result
}
/**
 * @description 生成树形数据
 */
export function generateTreeData($depth: number, paths: string[]) {
  let count = 0
  const depth = ~~(Math.random() * $depth) + 1
  console.log(depth)
  return function (arg: MockContext) {
    const {
      context: { templateRoot },
    } = arg
    if (depth - count < 2) return 'NO_MATCH_PLACEHOLDER'
    const parents = count == 0 ? paths : []
    const template = getCycleTemplate(templateRoot, parents)
    count++
    return removeNoMathPlaceholder(mockjs.mock(template))
  }
}
