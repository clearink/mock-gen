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
  console.log("data", data);
  // 组装数据                           // 模板路径
  const fileData = await ejs.renderFile(path.templatePath, {
    method: API_REQUEST_TYPE.matchValue(baseInfo.apiRequestType).key,
    bodyData: undefined,
    queryData: undefined,
    responseData: undefined,
    // bodyData: normalizeTsData(data.request.body),
    // queryData: normalizeTsData(data.request.query),
    // responseData: normalizeTsData(data.response),
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
  });

  await fs[isAppend ? "appendFile" : "writeFile"](
    path.filePath,
    fileData
    // prettier.format(fileData, { tabWidth: 4, filepath: path.filePath })
  );
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

    // 生成文件
    await handleWriteFile({
      apiConfig,
      isAppend: writeSet.has(filePath),
      path: { filePath, templatePath: tsConfig.templatePath },
      data: convertToTs(apiConfig, structMap), // 生成 ts 数据
    });
    writeSet.add(filePath);
    console.log(chalk.green(`✌  ts 文件生成完毕: ${filePath}`));
    // 间隔 100ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

module.exports = generatorTsFile;
