import { renderFile } from 'ejs'
import logger from '../utils/logger'
import { appendFile, ensureFile, writeFile } from 'fs-extra'
import { convertToJoi, convertToMock } from '../convert'
import { API_REQUEST_TYPE, RESULT_PARAM_JSON_TYPE } from '../constant'
import { joiToString, shouldGenerateApi, normalizeFilePath, normalizeFileData } from './utils'

// 是否已经写入过该文件 适配同一个url 不同的 method
const writeSet = new Set<string>()

/**
 * @description 将数据写入相应的文件
 * @param {object} baseInfo api配置数据
 * @param {{mockData:any,joiData:any,tsData:any}} fileData 文件数据
 * @param {boolean} isAppend 是否追加到文件
 */
async function handleWriteFile({ apiConfig, isAppend, path, data }) {
  const { baseInfo, resultParamJsonType: responseType } = apiConfig
  // 返回数据根类型
  const arrayRoot = RESULT_PARAM_JSON_TYPE.when(responseType, 'array')
  // 组装数据                           // 模板路径
  const fileData = await renderFile(path.templatePath, {
    method: API_REQUEST_TYPE.findByValue(baseInfo.apiRequestType)?.key,
    mock_data: JSON.stringify(data?.mockData),
    joi_data: data?.joiData ?? {},
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
    joiToString,
    isAppend,
    arrayRoot,
  })

  await ensureFile(path.filePath)
  await (isAppend ? appendFile : writeFile)(
    path.filePath,
    normalizeFileData(fileData, path.filePath)
  )
}
/**
 * @description 生成 mock 数据文件
 * @param {object} apiGroup apiGroup数据
 */
export default async function generateMockFile(apiGroup, structMap, mockConfig) {
  for (const apiConfig of apiGroup.apiList) {
    const { baseInfo } = apiConfig

    // 是否应该生成该 api
    if (!shouldGenerateApi(baseInfo, mockConfig)) continue

    // 文件路径
    const filePath = normalizeFilePath(baseInfo.apiURI, mockConfig)

    // 生成 mock 数据
    const mockData = convertToMock(apiConfig, structMap)

    // 生成 joi 数据
    const joiData = convertToJoi(apiConfig, structMap)

    logger.info(`✌ 正在生成 mock 文件: ${filePath}`)

    // 生成文件
    await handleWriteFile({
      apiConfig,
      isAppend: writeSet.has(filePath),
      path: { filePath, templatePath: mockConfig.templatePath },
      data: { mockData, joiData },
    })
    writeSet.add(filePath)
    // 间隔 60ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 60))
  }
}
