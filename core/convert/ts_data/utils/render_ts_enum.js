/**
 * @description
 * 渲染 ts 枚举数据
 * @param {string|array} enumList
 * @param {string} type
 */
function renderTsEnum(enumList, type) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList)
      .replace(/(^\[)|(\]$)/g, "")
      .replace(/\,/g, " | ");
  }
  if (type === "array") {
    return { tsType: "enum", tsContent: `(${enumList})[]` };
  }
  return { tsType: "enum", tsContent: enumList };
}
module.exports = renderTsEnum;
