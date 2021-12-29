const prettier = require("prettier");
const logger = require("../../utils/logger");
/**
 * @description 使用 prettier 格式化文件
 * @param {any} source 源数据
 */
function normalizeFileData(source, filepath) {
  const config = { tabWidth: 4, filepath };
  try {
    return prettier.format(source, config);
  } catch (error) {
    logger.error(`❌ 文件格式化失败 请检查：${filepath}`);
    return source;
  }
}
module.exports = normalizeFileData;
