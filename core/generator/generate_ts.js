const fs = require("fs/promises");
const chalk = require("chalk");
const ejs = require("ejs");
const prettier = require("prettier");
const { convertToTs } = require("../convert");
const { tsConfig = {} } = require("../config");
const { API_REQUEST_TYPE } = require("../constant");
const {
  shouldGenerateApi,
  normalizeFilePath,
  normalizeRootName,
  normalizeTsData,
  createFolder,
} = require("./utils");

// 是否已经写入过该文件 适配同一个url 不同的 method
const writeSet = new Set();

/**
 * @description 将数据写入相应的文件
 * @param {object} baseInfo api配置数据
 * @param {object} fileData 文件数据
 * @param {boolean} isAppend 是否追加到文件
 */
async function handleWriteFile({ apiConfig, isAppend, path, data }) {
  const { baseInfo } = apiConfig;
  // 组装数据                           // 模板路径
  const fileData = await ejs.renderFile(path.templatePath, {
    method: API_REQUEST_TYPE.matchValue(baseInfo.apiRequestType).key,
    rootName: normalizeRootName(baseInfo),
    body: normalizeTsData("BodyParam", data.request.body),
    query: normalizeTsData("QueryParam", data.request.query),
    response: normalizeTsData("Response", data.response),
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
  });

  let formatted = fileData;
  try {
    formatted = prettier.format(fileData, {
      tabWidth: 4,
      filepath: path.filePath,
    });
  } catch (error) {
    console.log(chalk.redBright(`❌ 文件格式化失败 请检查：${path.filePath}`));
  }
  await fs[isAppend ? "appendFile" : "writeFile"](path.filePath, formatted);
}
/**
 * @description 生成 ts 文件
 * @param {object} apiGroup apiGroup数据
 * @param {any} config
 */
async function generatorTsFile(apiGroup, structMap) {
  for (const apiConfig of apiGroup.apiList) {
    const { baseInfo } = apiConfig;

    // 是否应该生成该 api
    if (!shouldGenerateApi(baseInfo, tsConfig)) continue;

    // 文件路径
    const filePath = normalizeFilePath(baseInfo.apiURI, tsConfig, "ts");

    // 创建文件夹
    const createSuccess = await createFolder(filePath, baseInfo.apiURI);
    if (!createSuccess) continue;
    console.log(chalk.green(`✌  ts 文件准备生成: ${filePath}`));

    // 生成文件
    await handleWriteFile({
      apiConfig,
      isAppend: writeSet.has(filePath),
      path: { filePath, templatePath: tsConfig.templatePath },
      data: convertToTs(apiConfig, structMap), // 生成 ts 数据
    });
    writeSet.add(filePath);
    // 间隔 100ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

module.exports = generatorTsFile;
