import { renderFile } from 'ejs'
import logger from '../utils/logger'
import { appendFile, ensureFile, writeFile } from 'fs-extra'
import { convertToJoi, convertToMock } from '../convert'
import { API_REQUEST_TYPE, RESULT_PARAM_JSON_TYPE } from '../constant'
import { shouldGenerateApi, normalizeFilePath, normalizeFileData } from './utils'
import getMockConfig from '../utils/get_mock_config'
import { ConvertJoiResult } from '../convert/joi_data'

// 是否已经写入过该文件 适配同一个url 不同的 method
const writeSet = new Set<string>() // TODO: 独立维护

/**
 * @description 将数据写入相应的文件
 * @param apiConfig api 配置
 * @param mockData mock 数据
 * @param joiData joi 数据
 */
async function handleWriteFile(
  apiConfig: ApiListItem,
  mockData: any,
  joiData: ConvertJoiResult,
  filePath: string
) {
  const { mockConfig } = getMockConfig(true)
  const { baseInfo, resultParamJsonType: responseType } = apiConfig

  // 是否追加
  const isAppend = writeSet.has(filePath)

  // 返回数据根类型
  const arrayRoot = RESULT_PARAM_JSON_TYPE.when(responseType, 'array')
  // 组装数据                           // 模板路径
  const fileData = await renderFile(mockConfig.templatePath, {
    method: API_REQUEST_TYPE.findByValue(baseInfo.apiRequestType)?.key,
    mock_data: mockData,
    joi_body: joiData.bodyParams,
    joi_query: joiData.queryParams,
    joi_restful: joiData.restfulParams,
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
    isAppend,
    arrayRoot,
  })

  await ensureFile(filePath)
  if (isAppend) {
    await appendFile(filePath, normalizeFileData(fileData, filePath))
  } else {
    await writeFile(filePath, normalizeFileData(fileData, filePath))
  }
  writeSet.add(filePath)
}

/**
 * @description 生成 mock 数据文件
 * @param apiGroup apiGroup 配置
 */
export default async function generateMockFile(apiGroup: GroupListItem) {
  const { mockConfig } = getMockConfig(true)
  for (const apiConfig of apiGroup.apiList || []) {
    const { baseInfo } = apiConfig

    // 是否应该生成该 api
    if (!shouldGenerateApi(baseInfo, mockConfig)) continue

    // 文件路径
    const filePath = normalizeFilePath('js', baseInfo.apiURI, mockConfig.dirPath)

    logger.info(`✌ 正在生成 mock 文件: ${filePath}`)

    // 生成 mock 数据
    const mockData = convertToMock(apiConfig)

    // 生成 joi 数据
    const joiData = convertToJoi(apiConfig)

    // 生成文件
    await handleWriteFile(apiConfig, mockData, joiData, filePath)

    // 间隔 60ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 60))
  }
}
