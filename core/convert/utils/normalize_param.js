/**
 *
 * @param {array|undefined} schemaList 字段配置
 * @description 修正错误的属性名称
 */
const separator = ">>";
// 过滤函数 使用结构体或者 不存在 >> 直接略过
const normalizeFilter = (item) =>
  item.hasOwnProperty("structureID") || !item.paramKey.includes(separator);
function normalizeParam(schemaList = []) {
  for (let $schema of schemaList) {
    if (normalizeFilter($schema)) continue;
    // 需要修正
    const attrList = $schema.paramKey.split(separator);
    let $schemaList = schemaList;
    while (attrList.length > 1) {
      const attr = attrList.shift();
      // 在schema 中寻找
      const schemaItem = $schemaList.find((item) => item.paramKey === attr);
      if (!schemaItem) continue;
      if (!schemaItem.hasOwnProperty("childList")) {
        schemaItem.childList = [];
      }
      $schemaList = schemaItem.childList;
    }
    $schemaList.push({ ...$schema, paramKey: attrList.shift() });
  }
  return schemaList.filter(normalizeFilter);
}
module.exports = normalizeParam;
