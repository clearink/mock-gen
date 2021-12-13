const { API_REQUEST_PARAM_TYPE: TYPE } = require("../../constant");
/**
 * @description 修正数据类型 将自定义数据类型处理成基本数据类型
 * @param {any[]} childList
 * @param {string} paramType
 * @returns
 */
function normalizeParamType(schema, structMap) {
  const { paramType, childList = [] } = schema;
  // // 如果自定义结构体中有该类型 直接返回
  if (structMap.has(paramType)) {
    const { type, struct } = structMap.get(paramType);
    schema.childList = struct;
    schema.paramType = TYPE.matchKey(type, "object").value;
    return TYPE.matchValue(schema.paramType)?.key;
  }
  // 如果 有子元素 且类型不是 json,object,array 默认修正为 object
  const complexType = ["json", "object", "array"];
  if (childList.length > 0 && !TYPE.when(paramType, complexType)) {
    return TYPE.matchKey("object").key;
  }
  return TYPE.matchValue(paramType)?.key;
}
module.exports = normalizeParamType;
