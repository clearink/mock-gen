/**
 * @description 解析数组/对象类型
 * @param {any} content
 * @param {boolean} isArray
 * @param {any} config 配置
 */
function normalizeComplexType(content, isArray, initState) {
  if (isArray && Object.keys(content).length === 0) {
    return { rule: initState.rule, content: [initState.content] };
  }
  return { rule: initState.rule, content: isArray ? [content] : content };
}
module.exports = normalizeComplexType;
