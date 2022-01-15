import { renderFile } from 'ejs'
import logger from '../utils/logger'
import { convertToTs } from '../convert'
import { API_REQUEST_TYPE } from '../constant'
import { ensureFile, appendFile, writeFile } from 'fs-extra'
import { shouldGenerateApi, normalizeFilePath, normalizeFileData } from './utils'
import getMockConfig from '../utils/get_mock_config'
import { normalizeRootName } from '../utils/normalize_prop_name'

// 是否已经写入过该文件 适配同一个url 不同的 method
const writeSet = new Set()

/**
 * @description 将数据写入相应的文件
 * @param {object} baseInfo api配置数据
 * @param {object} fileData 文件数据
 * @param {boolean} isAppend 是否追加到文件
 */
async function handleWriteFile(apiConfig: ApiListItem, data: Record<string, any>) {
  const { tsConfig } = getMockConfig(true)
  const { baseInfo } = apiConfig

  // 文件路径
  const filePath = normalizeFilePath('ts', baseInfo.apiURI, tsConfig.dirPath)
  logger.info(`✌ 正在生成 ts 文件: ${filePath}`)

  // 是否追加
  const isAppend = writeSet.has(filePath)

  // 组装数据                           // 模板路径
  const fileData = await renderFile(tsConfig.templatePath, {
    method: API_REQUEST_TYPE.findByValue(baseInfo.apiRequestType)!.key,
    rootName: normalizeRootName(baseInfo),
    body: data.body || {},
    query: data.query || {},
    response: data.response || {},
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
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
 * @description 生成 ts 文件
 * @param {object} apiGroup apiGroup数据
 * @param {any} config
 */
export default async function generateTsFile(apiGroup: GroupListItem) {
  const { tsConfig } = await getMockConfig(true)
  for (const apiConfig of apiGroup.apiList || []) {
    const { baseInfo } = apiConfig

    // 是否应该生成该 api
    if (!shouldGenerateApi(baseInfo, tsConfig)) continue

    // 生成文件
    await handleWriteFile(apiConfig, convertToTs(apiConfig))

    // 间隔 100ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}
