const { API_PARAM_REQUIRED } = require("../../constant");
const {
  judgeGenerateEnum,
  normalizeParam,
  normalizeParamType,
} = require("../utils");

/**
 * @description 生成 typescript 文件
 */

/**
 * @description 解析配置得到 ts 数据 **不处理 header 与 restful 参数**
 * @param {object} apiConfig 配置的返回值
 * @param {Map} structMap 结构体map
 * @returns {object}
 */
function convertToTs(apiConfig, structMap) {
  const { requestInfo, urlParam, resultInfo } = apiConfig;
  const body = generateTs(requestInfo, structMap, apiConfig); // body 参数
  const query = generateTs(urlParam, structMap, apiConfig); // query 参数
  const response = generateTs(resultInfo, structMap, apiConfig); // 响应数据
  return { request: { body, query }, response };
}

/**
 * @description 递归得到 ts 数据
 * @param {any[]} schemaList 需要分析的数据
 * @param {Map<string|number, {struct:any,type:string}>} structMap 数据结构
 * @param {object} apiConfig apiConfig 配置
 */
function generateTs(schemaList, structMap, apiConfig) {
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { structureID, paramNotNull, paramKey } = schema;
    if (schema.hasOwnProperty("structureID")) {
      const struct = structMap.get(structureID)?.struct;
      if (!struct) return result;
      return { ...result, ...generateTs(struct, structMap, apiConfig) };
    }
    const content = schemaToTs(schema, structMap, apiConfig) || "any";
    // 是否为必填项
    const suffix = API_PARAM_REQUIRED.when(paramNotNull, "required") ? "" : "?";

    return { ...result, [`${paramKey}${suffix}`]: content };
  }, {});
}

/**
 * @description 根据类型获得相应的 ts 数据
 * @param {object} schema 请求参数配置
 * @param {Map<string|number, {struct:any,type:string}>} structMap 数据结构
 * @param {object} apiConfig apiConfig 配置
 */
function schemaToTs(schema, structMap, apiConfig) {
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, structMap, apiConfig, {
    matchType: "ts",
  });
  if (shouldGenerate !== false) {
    return shouldGenerate.ts?.join?.(" | ");
  }

  // 获取类型字符串
  const type = normalizeParamType(schema, structMap);

  switch (type) {
    case "string":
    case "char":
    case "date":
    case "datetime":
      return "string";
    case "file":
      // 暂时不知道是啥玩意儿
      return "any";
    case "int":
    case "float":
    case "double":
    case "number":
    case "byte":
    case "short":
    case "long":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "array":
    case "json":
    case "object":
      const { childList = [] } = schema;
      const tsType = type === "array" ? "any[]" : "Record<string, any>";
      const items = generateTs(childList, structMap, apiConfig);
      if (Object.keys(items).length === 0) return tsType;
      return { type, content: items };
  }
  return "any";
}

// 枚举值

// 复杂类型 (array/object)

module.exports = convertToTs;
