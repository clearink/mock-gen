import { STRUCTURE_TYPE } from '../constant'

/**
 * @description 获取所有的数据结构
 */
const map: StructMap = new Map()
export default function getStructMap(useCache = false, jsonData?: EolinkerDataSchema) {
  if (useCache && map.size > 0) return map
  map.clear() // 清空 map
  const structList = jsonData?.dataStructureList || []
  for (const $struct of structList) {
    if (!$struct.structureID) continue
    // 忽略类型 统一转换成字符串
    const id = `${$struct.structureID}`
    let type = `${$struct.structureType}`
    type = STRUCTURE_TYPE.findByValue(type, 'object')!.key
    const struct = JSON.parse($struct.structureData as any)
    map.set(id, { struct, type })
  }
  return map
}
