const {
  API_REQUEST_PARAM_TYPE: TYPE,
  API_PARAM_REQUIRED,
} = require("../../constant");
const {
  judgeGenerateEnum,
  normalizeParam,
  normalizeParamType,
} = require("../utils");

/**
 * @description 解析配置得到 joi 数据 **暂时不处理 headers 参数**
 * @param {object} apiConfig 配置的返回值
 * @param {Map} structMap 结构体map
 * @returns {object}
 */
function convertToJoi(apiConfig, structMap) {
  const { requestInfo, urlParam, restfulParam } = apiConfig;
  // get 请求应当是没有 body 参数的
  const bodyParams = generateJoi(requestInfo, structMap, apiConfig, true); // body 参数
  const queryParams = generateJoi(urlParam, structMap, apiConfig); // query 参数
  const restfulParams = generateJoi(restfulParam, structMap, apiConfig); // restful参数
  return { bodyParams, queryParams, restfulParams };
}

/**
 * @description 递归得到 joi 数据
 * @param {any[]} schemaList 需要分析的数据
 * @param {Map<string|number, {struct:any,type:string}>} structMap 数据结构
 * @param {object} apiConfig 配置的返回值
 * @param {boolean} strict 是否精确匹配类型
 */
function generateJoi(schemaList, structMap, apiConfig, strict = false) {
  return normalizeParam(schemaList).reduce((result, schema) => {
    const { paramKey, structureID, paramNotNull, paramType } = schema;
    if (schema.hasOwnProperty("structureID")) {
      const struct = structMap.get(structureID)?.struct;
      if (!struct) return result;
      const args = [struct, structMap, apiConfig, strict];
      return { ...result, ...generateJoi(...args) };
    }

    const content = schemaToJoi(schema, structMap, apiConfig, strict);
    if (content.length <= 0) return result; // 为空直接返回
    // 是否为必填项
    const required = API_PARAM_REQUIRED.when(paramNotNull, "required");
    const stringType = TYPE.when(paramType, "string");

    if (required && (stringType || !strict)) content.push(".allow('')");
    if (required) content.push(".required()");

    return { ...result, [paramKey]: ["joi."].concat(content) };
  }, {});
}

/**
 * @description 根据类型获得相应的 joi 数据
 * @param {object} schema 请求参数配置
 * @param {Map<string|number, {struct:any,type:string}>} structMap 数据结构
 * @param {object} apiConfig apiConfig 配置
 * @param {boolean} strict 是否精确匹配类型
 */
function schemaToJoi(schema, structMap, apiConfig, strict = false) {
  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, structMap, apiConfig, {
    matchType: "joi",
  });

  if (shouldGenerate !== false) {
    // 其他需求暂不明确 目前只处理枚举值
    let enumList = shouldGenerate.joi;
    if (Array.isArray(enumList)) {
      enumList = JSON.stringify(enumList).replace(/(^\[)|(\]$)/g, "");
    }

    return [["valid(", enumList, ")"]];
  }
  // 类型字符串
  const type = normalizeParamType(schema, structMap);

  // 判断类型
  switch (type) {
    case "string":
    case "char":
    case "date":
    case "datetime":
      return ["string()"];
    case "file":
      // 暂时不知道是啥玩意儿
      return [];
    case "int":
    case "float":
    case "double":
    case "number":
    case "byte":
    case "short":
    case "long":
      return [strict ? "number()" : "string()"];
    case "boolean":
      return [strict ? "boolean()" : "string()"];
    case "null":
      // 不验证该种类型, 因为 null 类型大多数不会被传递给后端
      return [];
    case "array":
    case "json":
    case "object":
      const { childList = [] } = schema;
      const joiType = type === "array" ? "array" : "object";
      const items = generateJoi(childList, structMap, apiConfig, strict);
      if (Object.keys(items).length === 0) return [`${joiType}()`];
      if (type !== "array") return ["object(", items, ")"];
      return ["array().", "items(joi.object(", items, "))"];
  }

  return [];
}
module.exports = convertToJoi;
