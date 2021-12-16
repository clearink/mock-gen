const normalizeTypeName = require("./normalize_type_name");

/**
 * @description 将 ts 生成的类型对象处理成能够被渲染的 cjs 数据
 * 步骤
 * 1. 扁平化整个对象
 * 2. 生成对应的名称
 * 3. 返回
 */
function normalizeTsData(parentName, data = {}) {
  return Object.entries(data).reduce((result, [name, config]) => {
    const { tsType, tsContent } = config;
    // 如果是对象则需要计算出对应的 typeName
    if (!isObject(tsContent)) {
      const prop = name.replace(/\s/g, "");
      result[parentName] = { ...result[parentName], [prop]: tsContent };
      return { ...result };
    }
    // 最长不超过 24 个字符
    const optimized = compressName(parentName, name, 24);
    const typeName = `${optimized}${tsType === "array" ? "[]" : ""}`;

    result[parentName] = { ...result[parentName], [name]: typeName };
    return { ...result, ...normalizeTsData(optimized, tsContent) };
  }, {});
}

// 判断是否为对象
function isObject(object) {
  return Object.prototype.toString.call(object) === "[object Object]";
}
/**
 * @description 压缩字段名
 * @param {array} parentName 父级名称
 * @param {string} name 名称
 */
function compressName(parentName, name, maxLen) {
  const parentList = normalizeTypeName(parentName);

  const nameList = normalizeTypeName(name);

  let normalized = parentList.concat(nameList).join("").replace(/\?/g, "");

  // 长度符合
  while (normalized.length > maxLen) {
    // 最长和最短的字符串长度
    const maxItem = Math.max(...nameList.map((item) => item.length));
    let minItem = Math.min(...nameList.map((item) => item.length));

    if ((maxItem + minItem) % 2 === 0) minItem -= 1; // 强制 itemAvgLen 为奇数 防止死循环

    const itemAvgLen = ~~((maxItem + minItem) / 2);
    const minLen = Math.max(~~(maxLen / nameList.length), itemAvgLen);

    // 每次只尝试一个 从右向左匹配
    for (let i = nameList.length - 1; i >= 0; i--) {
      const item = nameList[i];
      if (item.length <= minLen) continue;
      nameList[i] = item.substring(0, item.length - 2);
      break;
    }
    parentList.length && nameList.unshift(parentList.pop());
    normalized = parentList.concat(nameList).join("").replace(/\?/g, "");
  }
  return normalized;
}
module.exports = normalizeTsData;
