import { STRUCTURE_TYPE } from '../../constant'

/**
 * @description 获取所有的数据结构
 */
export default function findStructMap(jsonData: Record<string, any>) {
  const map = new Map<string | number, { struct: any; type: string }>()
  const structList = jsonData.dataStructureList || []
  for (const struct of structList) {
    const id = struct.structureID
    const type = STRUCTURE_TYPE.findByValue(struct.structureType)?.key
    const schema = JSON.parse(struct.structureData)
    type !== undefined && map.set(id, { struct: schema, type })
  }
  return map
}

export type StructMap = ReturnType<typeof findStructMap>
