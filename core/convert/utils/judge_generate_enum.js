const generateEnum = require("./generate_enum");
const matchCustomRule = require("./match_custom_rule");
const { API_REQUEST_PARAM_TYPE: TYPE } = require("../../constant");
const typeValue = TYPE.matchKey("enum").value;
/**
 * @description 判断是否能够生成枚举
 * @param {*} matchType 匹配类型 mock joi ts
 * @param {*} schema 基本配置
 * @param {*} structMap 数据结构 map
 * @param {*} apiConfig api 配置
 * @returns
 */
function judgeGenerateEnum(schema, structMap, apiConfig, { matchType }) {
  const { paramType, paramValueList, childList = [] } = schema;
  // 普通的
  const config = { ...schema, paramType: typeValue };
  if (!structMap.has(paramType)) {
    const enumList = generateEnum(structMap, paramValueList, !childList.length);
    if (enumList.length <= 0) return false;
    return matchCustomRule(matchType, config, apiConfig, {
      content: enumList,
      joi: enumList,
      ts: enumList,
      rule: "1",
    });
  }
  const { type, struct } = structMap.get(paramType);
  // 不是枚举值直接 return false
  if (type !== "enum") return false;
  const enumList = generateEnum(structMap, struct);
  return matchCustomRule(matchType, config, apiConfig, {
    content: enumList,
    joi: enumList,
    ts: enumList,
    rule: "1",
  });
}
module.exports = judgeGenerateEnum;
