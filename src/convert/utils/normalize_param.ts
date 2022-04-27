import { DIRTY_SEPARATOR } from '../../constant'

// 过滤函数 使用结构体或者 不存在 >> 直接略过
const normalizeFilter = (item: ParamItemSchema) =>
  item.hasOwnProperty('structureID') || !item.paramKey.includes(DIRTY_SEPARATOR)
/**
 *
 * @param {array|undefined} schemaList 字段配置
 * @description 修正错误的属性名称
 */
export default function normalizeParam(schemaList: ParamItemSchema[] = []) {
  for (let $schema of schemaList) {
    $schema.paramType = `${$schema.paramType}` // 转成 string
    $schema.originalType = $schema.originalType ?? $schema.paramType // 保存原有的 type 类型
    if (normalizeFilter($schema)) continue
    // 需要修正
    const attrList = $schema.paramKey.split(DIRTY_SEPARATOR)
    let $schemaList = schemaList
    while (attrList.length > 1) {
      const attr = attrList.shift()
      // 在schema 中寻找
      const schemaItem = $schemaList.find((item) => item.paramKey === attr)
      if (!schemaItem) continue
      if (!schemaItem.hasOwnProperty('childList')) {
        schemaItem.childList = []
      }
      $schemaList = (schemaItem.childList || []) as ParamItemSchema[]
    }
    const paramKey = attrList.shift()!
    // 不存在才新增 避免多次操作重复添加
    if (!$schemaList.find((item) => item.paramKey === paramKey)) {
      $schemaList.push({ ...$schema, paramKey })
    }
  }
  return schemaList.filter(normalizeFilter)
}
