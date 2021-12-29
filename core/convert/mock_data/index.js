const {
  matchCustomRule,
  normalizeParam, // 修正错误的属性名称
  judgeGenerateEnum,
  normalizeParamType,
} = require("../utils");
const renderMockEnum = require("./utils/render_mock_enum");

/**
 * @description 解析配置得到 mock 数据
 * @param {object} resultInfo 配置的返回值
 * @param {Map} structMap 结构体map
 * @param {object} apiConfig apiConfig 配置
 * @returns {object}
 */
function convertToMock(apiConfig, structMap) {
  const { resultInfo } = apiConfig;
  return generateMock(resultInfo, structMap, apiConfig);
}

/**
 * @description 递归得到 mock 数据
 * @param {any[]} schemaList 需要分析的数据
 * @param {Map<string|number, {struct:any,type:string}>} structMap 数据结构
 * @param {object} apiConfig api配置
 */
function generateMock(schemaList, structMap, apiConfig) {
  return normalizeParam(schemaList).reduce((result, schema) => {
    if (schema.hasOwnProperty("structureID")) {
      const struct = structMap.get(schema.structureID)?.struct;
      if (!struct) return result;
      return { ...result, ...generateMock(struct, structMap, apiConfig) };
    }
    const { rule, content } = schemaToMock(schema, structMap, apiConfig);
    const suffix = rule ? `|${rule}` : "";
    const paramKey = `${schema.paramKey}${suffix}`.replace(/\s/g, "");
    return { ...result, [paramKey]: content };
  }, {});
}

/**
 * @description 根据 schema 生成 mock 数据
 * @param {object} schema
 * @param {Map<number,{content: object,type:string}>} structMap
 * @param {object} apiConfig apiConfig 配置
 * @returns {{ rule:string, content:any }}
 */
function schemaToMock(schema, structMap, apiConfig) {
  
  // 获取参数的类型字符串 同时处理自定义数据结构
  const type = normalizeParamType(schema, structMap);

  // 获取枚举值
  const shouldGenerate = judgeGenerateEnum(schema, structMap, apiConfig, {
    matchType: "mock",
  });

  if (shouldGenerate !== false) {
    return renderMockEnum(shouldGenerate, type);
  }

  let content = "@word({args})";
  // 判断类型
  switch (type) {
    case "string":
      content = `@word({args})`;
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "file":
      content = "暂不支持[file]类型";
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "int":
      content = `@integer({args})`;
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "float":
    case "double":
      content = `@float({args})`;
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "date":
    case "datetime":
      content = "@date('yyyy-MM-dd hh:mm:ss')";
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "boolean":
      content = `@boolean({args})`;
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "number":
    case "byte":
    case "short":
    case "long":
      content = `@integer({args})`;
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "null":
      content = null;
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "char":
      content = "@character('lower')";
      return matchCustomRule("mock", schema, apiConfig, { content });
    case "array":
    case "json":
    case "object":
      const { childList = [] } = schema;
      const complexContent = generateMock(childList, structMap, apiConfig);
      const isEmpty = Object.keys(complexContent).length === 0;
      const matched = matchCustomRule("mock", schema, apiConfig, {
        content: isEmpty ? content : complexContent,
      });
      const { rule: mRule, content: mContent } = matched;
      return { rule: mRule, content: type === "array" ? [mContent] : mContent };
  }
  return matchCustomRule("mock", schema, apiConfig, { content });
}

module.exports = convertToMock;
