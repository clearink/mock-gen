import { isArray, isObject, isString } from '../validate_type'

export default function getMockTemplate(
  template: any,
  parents: string[],
  paths: string[],
  depth: number,
  useRootTemplate = false
) {
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
