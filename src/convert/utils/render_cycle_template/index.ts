import CycleCache from './cycle_cache'
import logger from '../../../utils/logger'
import getCycleTemplate from './get_cycle_template'
import getStructMap from '../../../utils/get_struct_map'
import { API_REQUEST_PARAM_TYPE as TYPE } from '../../../constant'

export default function renderCycleTemplate(template: MockTemplateType | [MockTemplateType]) {
  for (const cache of CycleCache.values) {
    let { paramKey, parents, cycle_path, paramType } = cache

    const targetTemplate = getCycleTemplate(template, cycle_path) //  根据 cycle_path 拿到树形结构模板
    const parentTemplate = getCycleTemplate(template, parents) // 根据 patents  拿到父级模板
    if (!targetTemplate || !parentTemplate) {
      throw new Error(logger.error(`[cycle_path]字段设置错误，请重新设置！`, false))
    }
    const structMap = getStructMap(true)

    // 是否为数组
    let isArrayType = TYPE.when(paramType, 'array')
    const struct = structMap.get(paramType)
    if (struct) isArrayType = struct.type === 'array'
    const result = `generateTreeData(3, ${JSON.stringify(cycle_path)})`;
    
    const target = parentTemplate[paramKey]
    // 删除目标 避免 cycleTemplate 获取时发生异常
    delete parentTemplate[paramKey]
    parentTemplate[paramKey] = {
      mock_rule: target?.mock_rule,
      render_raw: true,
      // 生成对应的数据
      mock_type: isArrayType ? `[${result}]` : result
    }
  }
  return template
}
const a = {
  name: { mock_type: '@cname()' },
  value: { mock_type: '@integer(0, 6)' },
  key: { mock_type: '@word()' },
}
