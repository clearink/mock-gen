const ora = require("ora");
const fs = require("fs/promises");
const fetch = require("node-fetch");
const config = require("../config") ?? {};
const logger = require("../utils/logger");
const { filePath, spaceKey, projectHashKey, EOLINKER_URL, EO_SECRET_KEY } =
  config.fetchConfig ?? {};

/**
 * @description 获取 eolinker 配置文件
 * @returns {boolean}
 */
async function fetchEolinker() {
  const spinner = ora(logger.info("正在请求 api 数据", false)).start();
  try {
    const response = await fetch(EOLINKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Eo-Secret-Key": EO_SECRET_KEY,
      },
      body: `space_id=${spaceKey}&project_id=${projectHashKey}`,
    });
    const fileData = await response.json();
    await fs.writeFile(filePath, JSON.stringify(fileData));
    const text = `数据请求成功, 已存储到: ${filePath}`;
    spinner.succeed(logger.success(text, false));
    return true;
  } catch (error) {
    const text = `数据请求失败, 请重试 \n ${error.toString()}`;
    spinner.fail(logger.error(text, false));
    return false;
  }
}
module.exports = fetchEolinker;
