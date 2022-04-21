import mockjs from 'mockjs'
// TODO: 完善ts类型
import { isObject, isArray, isString } from './validate_type'

function getCycleTemplate($target: any, paths: string[]) {
  let target = isArray($target) ? $target[0] : $target
  if (!isObject(target)) return false
  for (const path of paths) {
    // 不含有该字段 or target 是字符串的 返回 false
    const keys = Object.keys(target)
    const included = keys.find((key) => key.replace(/\|.*$/g, '') === path)
    if (!included || isString(target)) return false
    const type = target[included] as MockTemplateValue
    if (!isObject(type)) return false
    target = isArray(type) ? type[0] : type
  }
  return isString(target) ? false : target
}

/**
 * @description 生成树形数据
 */
export default function generateTreeData(depth: number, paths: string[]) {
  let count = 0
  return function (arg: MockContext) {
    const {
      context: { templateRoot },
    } = arg
    if (depth - count < 2) return
    const parents = count == 0 ? paths : []
    const template = getCycleTemplate(templateRoot, parents)
    count++
    return template ? mockjs.mock(template) : undefined
  }
}
