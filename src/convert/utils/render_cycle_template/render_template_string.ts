import { CacheValue } from './cycle_cache'
import getStructMap from '../../../utils/get_struct_map'
import { API_REQUEST_PARAM_TYPE as TYPE } from '../../../constant'
import normalizeMockData from '../../mock_data/normalize_mock_data'

export default function renderTemplateString(
  template: Record<string, MockTemplateValue>,
  cache: CacheValue
) {
  let { paramType, mock_rule, paramKey } = cache
  const structMap = getStructMap(true)

  // 是否为数组
  let isArrayType = TYPE.when(paramType, 'array')
  const struct = structMap.get(paramType)
  if (struct) isArrayType = struct.type === 'array'

  const name = `${paramKey}${mock_rule ? `|${mock_rule}` : ''}`
  const result = `function () {
    const template = ${normalizeMockData(template)}
    function loop(depth){
      if(depth === 0) return template;
      return {...template, "${name}": loop(depth - 1)}
    }
    return Mock.mock(loop(3))
  }`
  return isArrayType ? `[${result}]` : result
}
