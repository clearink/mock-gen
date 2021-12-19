/**
 * @description
 * 渲染 joi 枚举数据
 * @param {string|array} enumList
 * @param {string} type
 */
function renderJoiEnum(enumList, type) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList).replace(/(^\[)|(\]$)/g, "");
  }
  // 单独处理 array 情况
  if (type === "array") {
    return ["array().", "items(joi.valid(", enumList, "))"];
  }
  return [["valid(", enumList, ")"]];
}
module.exports = renderJoiEnum;
