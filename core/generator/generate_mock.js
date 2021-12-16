const fs = require("fs/promises");
const chalk = require("chalk");
const ejs = require("ejs");
const prettier = require("prettier");
const { mockConfig = {} } = require("../config");
const { convertToMock, convertToJoi } = require("../convert");
const { API_REQUEST_TYPE, RESULT_PARAM_JSON_TYPE } = require("../constant");
const {
  shouldGenerateApi,
  normalizeFilePath,
  createFolder,
  joiToString,
} = require("./utils");

// 是否已经写入过该文件 适配同一个url 不同的 method
const writeSet = new Set();

/**
 * @description 将数据写入相应的文件
 * @param {object} baseInfo api配置数据
 * @param {{mockData:any,joiData:any,tsData:any}} fileData 文件数据
 * @param {boolean} isAppend 是否追加到文件
 */
async function handleWriteFile({ apiConfig, isAppend, path, data }) {
  const { baseInfo, resultParamJsonType: responseType } = apiConfig;
  // 返回数据根类型
  const arrayRoot = RESULT_PARAM_JSON_TYPE.when(responseType, "array");
  // 组装数据                           // 模板路径
  const fileData = await ejs.renderFile(path.templatePath, {
    method: API_REQUEST_TYPE.matchValue(baseInfo.apiRequestType).key,
    mock_data: JSON.stringify(data?.mockData),
    joi_data: data?.joiData ?? {},
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
    joiToString,
    isAppend,
    arrayRoot,
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
 * @description 生成 mock 数据文件
 * @param {object} apiGroup apiGroup数据
 */
async function generatorMockFile(apiGroup, structMap) {
  for (const apiConfig of apiGroup.apiList) {
    const { baseInfo } = apiConfig;

    // 是否应该生成该 api
    if (!shouldGenerateApi(baseInfo, mockConfig)) continue;

    // 文件路径
    const filePath = normalizeFilePath(baseInfo.apiURI, mockConfig);

    // 创建文件夹
    const createSuccess = await createFolder(filePath, baseInfo.apiURI);
    if (!createSuccess) continue;

    // 生成 mock 数据
    const mockData = convertToMock(apiConfig, structMap);

    // 生成 joi 数据
    const joiData = convertToJoi(apiConfig, structMap);
    
    console.log(chalk.green(`✌  mock 文件准备生成: ${filePath}`));
    // 生成文件
    await handleWriteFile({
      apiConfig,
      isAppend: writeSet.has(filePath),
      path: { filePath, templatePath: mockConfig.templatePath },
      data: { mockData, joiData },
    });
    writeSet.add(filePath);
    // 间隔 60ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
}

module.exports = generatorMockFile;
