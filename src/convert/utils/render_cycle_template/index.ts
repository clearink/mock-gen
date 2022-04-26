import CycleCache from './cycle_cache'
import logger from '../../../utils/logger'
import getCycleTemplate from './get_cycle_template'
import getStructMap from '../../../utils/get_struct_map'
import { API_REQUEST_PARAM_TYPE as TYPE } from '../../../constant'

export default function renderCycleTemplate(template: MockTemplateType | [MockTemplateType]) {
  for (const cache of CycleCache.values) {
    let { paramKey, parents, cycle_path, paramType, cycle_depth = 3 } = cache

    const parentTemplate = getCycleTemplate(template, parents) // 根据 patents  拿到父级模板
    if (!getCycleTemplate(template, cycle_path) || !parentTemplate) {
      throw new Error(logger.error(`[cycle_path]字段设置错误，请重新设置！`, false))
    }
    const structMap = getStructMap(true)

    // 是否为数组
    let isArrayType = TYPE.when(paramType, 'array')
    const struct = structMap.get(paramType)
    if (struct) isArrayType = struct.type === 'array'

    const templatePath = JSON.stringify(cycle_path)
    const fullPath = JSON.stringify(parents.concat(paramKey))
    const result = `generateTreeData(${cycle_depth}, ${templatePath}, ${fullPath})`

    parentTemplate[paramKey] = parentTemplate[paramKey] ?? {}
    parentTemplate[paramKey].render_raw = true
    parentTemplate[paramKey].mock_type = isArrayType ? `[${result}]` : result
  }
  return template
}
