
const fs = require("fs/promises");
const ora = require("ora");
const chalk = require("chalk");
const fetch = require("node-fetch");
const config = require("../config") ?? {};
const { filePath, spaceKey, projectHashKey, EOLINKER_URL, EO_SECRET_KEY } =
  config.fetchConfig ?? {};

/**
 * @description 获取 eolinker 配置文件
 * @returns {boolean}
 */
async function fetchEolinker() {
  const spinner = ora({
    text: chalk.hex("#fdcb6e")("正在请求 api 数据"),
    color: "yellow",
  }).start();
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
    spinner.stop();
    console.log(chalk.hex("#3ae374")(`数据请求成功, 已存储到: ${filePath}`));
    return true;
  } catch (error) {
    spinner.stop();
    console.log(error);
    console.log(chalk.hex("#d63031")(`数据请求失败, 请重试`));
    return false;
  }
}
module.exports = fetchEolinker;