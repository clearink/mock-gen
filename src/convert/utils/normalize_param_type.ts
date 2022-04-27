import { API_REQUEST_PARAM_TYPE as TYPE } from '../../constant'
import getStructMap from '../../utils/get_struct_map'
/**
 * @description 修正数据类型 将自定义数据类型处理成基本数据类型
 * @param {any[]} childList
 * @param {string} paramType
 * @returns
 */
export default function normalizeParamType(schema: ParamItemSchema): string {
  const structMap = getStructMap(true)
  const { paramType, childList = [] } = schema

  // 如果自定义结构体中有该类型 直接返回
  const structCache = structMap.get(paramType)
  if (structCache) {
    schema.childList = structCache.struct
    // array => array
    // formData, json, xml, object => object
    // enum => enum
    schema.paramType = TYPE.findByKey(structCache.type, 'object')!.value
    return TYPE.findByValue(schema.paramType, 'object')!.key
  }

  // 如果 有子元素 且类型不是 json,object,array 默认修正为 object
  const needNormalize = !TYPE.when(paramType, ['json', 'object', 'array'])
  if (childList.length > 0 && needNormalize) return TYPE.findByKey('object')!.key
  return TYPE.findByValue(paramType, 'string')!.key
}
