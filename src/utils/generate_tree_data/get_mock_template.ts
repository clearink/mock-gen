import { generateTreeData } from '.'
import cloneDeep from 'lodash.clonedeep'
import { isArray, isObject, isString } from '../validate_type'

function getTemplate(template: any, paths: string[]) {
  let target = isArray(template) ? template[0] : template
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

export default function getMockTemplate(
  depth: number,
  $template: any,
  templatePath: string[], // 模板路径
  $fullPath: string[] // 全路径 用来替换相关属性的
) {
  const template = cloneDeep(getTemplate($template, templatePath))
  if (!template) return template
  const fullPath = $fullPath.concat()
  const paramKey = fullPath.pop()!

  const currentTemplate = getTemplate(template, fullPath)
  if (!currentTemplate) return template

  const keys = Object.keys(currentTemplate)
  const matched = keys.find((key) => key.replace(/\|.*$/g, '') === paramKey)!

  if (depth <= 2 || !matched) { 
    delete currentTemplate[matched]
    return template
  }

  currentTemplate[matched] = generateTreeData(depth - 1, templatePath, $fullPath, true)
  if (isArray(currentTemplate[matched])) {
    currentTemplate[matched] = [currentTemplate[matched]]
  }
  return template
}
