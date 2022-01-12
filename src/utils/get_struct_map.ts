import { STRUCTURE_TYPE } from '../constant'

/**
 * @description 获取所有的数据结构
 */
const map: StructMap = new Map()
export default function getStructMap(useCache = false, jsonData?: EolinkerDataSchema) {
  if (useCache && map.size > 0) return map
  map.clear() // 清空 map
  const structList = jsonData?.dataStructureList || []
  for (const struct of structList) {
    const id = struct.structureID
    const type = STRUCTURE_TYPE.findByValue(struct.structureType, 'object')!.key
    const schema = JSON.parse(struct.structureData as any)
    type !== undefined && map.set(id, { struct: schema, type })
  }
  return map
}
