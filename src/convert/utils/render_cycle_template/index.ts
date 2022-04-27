import CycleCache from './cycle_cache'
import logger from '../../../utils/logger'
import getCycleTemplate from './get_cycle_template'
import getStructMap from '../../../utils/get_struct_map'
import { RULE_CACHE_SEPARATOR as SEPARATOR } from '../../../constant'
import { isArray } from '../../../utils/validate_type'

export default function renderCycleTemplate(template: MockTemplateType | [MockTemplateType]) {
  const structMap = getStructMap(true)
  for (const [$paths, cache] of CycleCache.entries) {
    const { paramType, cycle_path } = cache
    let paths = $paths.split(SEPARATOR)

    if (structMap.has(paramType)) paths = paths.slice(0, -1)
    const parents = paths.slice(0, -1)
    const paramKey = paths.slice(-1)[0]

    const parentTemplate = getCycleTemplate(template, parents) // 根据 patents  拿到父级模板
    if (!getCycleTemplate(template, cycle_path) || !parentTemplate) {
      throw new Error(logger.error(`[cycle_path]字段设置错误，请重新设置！`, false))
    }

    const templatePath = JSON.stringify(cycle_path)
    const fullPath = JSON.stringify(parents.concat(paramKey))

    parentTemplate[paramKey] = parentTemplate[paramKey] ?? {}
    parentTemplate[paramKey].render_raw = true

    const depth = parentTemplate[paramKey].cycle_depth ?? 3
    const result = `generateTreeData(${depth}, ${templatePath}, ${fullPath})`

    // 是否为数组
    const isArrayType = isArray(parentTemplate[paramKey].content)
    parentTemplate[paramKey].content = isArrayType ? `[${result}]` : result
  }
  return template
}
