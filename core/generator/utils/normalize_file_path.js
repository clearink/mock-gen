const path = require("path");

/**
 * @description 获取生成的文件路径 优先使用配置的路径
 * @param {string} uri 文件路径
 * @param {object} config 配置属性
 * @param {"js"|"ts"} type 文件类型 js or ts
 * @returns {string}
 */
function normalizeFilePath(uri, config, type = "js") {
  const fileName = uri.replace(/\?.*/g, "").replace(/\{(.*?)\}/g, "[$1]");
  if (config.dirPath) {
    return path.resolve(config.dirPath, `./${fileName}.${type}`);
  }
  const pathSegment = type === "js" ? "mock" : "src/ts";
  return path.resolve(process.cwd(), `./${pathSegment}/${fileName}.${type}`);
}
module.exports = normalizeFilePath;
