const { STRUCTURE_TYPE } = require("../../constant");
/**
 * @description 获取所有的数据结构
 * @param {object} jsonData eolinker 数据
 * @returns {Map<number|string, {
 *  struct:Array,
 *  type:string
 *  }>}
 */
function findStructMap(jsonData) {
  const map = new Map();
  const structList = jsonData.dataStructureList || [];
  for (const struct of structList) {
    const id = struct.structureID;
    const type = STRUCTURE_TYPE.matchValue(struct.structureType)?.key;
    const schema = JSON.parse(struct.structureData);
    type !== undefined && map.set(id, { struct: schema, type });
  }
  return map;
}
module.exports = findStructMap;
