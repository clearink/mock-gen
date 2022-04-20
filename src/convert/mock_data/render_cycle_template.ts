import { CycleCache } from '../utils'
import { isObject, isArray, isString } from '../../utils/validate_type'
import normalizeMockData from './normalize_mock_data'
function get($target: MockTemplateType | [MockTemplateType], paths: string[]) {
  let target = isArray($target) ? $target[0] : $target
  if (!isObject(target)) return false
  for (const path of paths) {
    // 不含有该字段 or target 是字符串的 返回 false
    if (!target.hasOwnProperty(path) || isString(target)) return false
    const { mock_type, mock_rule } = target[path] as MockTemplateValue
    if (!isObject(mock_type)) return false
    target = isArray(mock_type) ? mock_type[0] : mock_type
  }
  return isString(target) ? false : target
}

export default function renderCycleTemplate(template: MockTemplateType | [MockTemplateType]) {
  /**
   * 过程
   * 1. 遍历 CycleCache
   * 2. 拆分出路径与 paramKey
   */
  for (let cache of CycleCache.values) {
    const { type: $type, paths } = cache
    if (paths.length < 2) continue
    const parents = paths.slice(0, -1)
    const target = get(template, parents)
    if (target === false) console.warn(`no such path: ${parents.join('=>')}`)
    else {
      const paramKey = paths.slice(-1)[0]
      target[paramKey] = {
        render_raw: true,
        mock_type: `function ({ parsedName, context }) {
        const template = getCycleTemplate(context.templateRoot, ${JSON.stringify(paths)})          
        return Mock.mock(loop(3))
      }`,
      }
    }
    return template
  }

  return template
}
