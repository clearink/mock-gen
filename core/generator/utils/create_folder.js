const path = require("path");
const fs = require("fs/promises");
const chalk = require("chalk");
/**
 * @description 创建文件夹
 * @param {string} filePath
 * @param {string} uri
 * @returns
 */
async function createFolder(filePath, uri) {
  const dirName = path.dirname(filePath);
  try {
    await fs
      .access(dirName)
      .catch(() => fs.mkdir(dirName, { recursive: true }));
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ 文件创建失败：${uri}`));
    return false;
  }
}
module.exports = createFolder;
