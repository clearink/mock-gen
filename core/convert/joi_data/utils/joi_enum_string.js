/**
 * @description 枚举值转换为 joi 字符串
 * @param {array} enumList
 * @returns string
 */
function joiEnumString(enumList) {
  if (Array.isArray(enumList)) {
    return JSON.stringify(enumList).replace(/(^\[)|(\]$)/g, "");
  }
  return enumList;
}
module.exports = joiEnumString;
