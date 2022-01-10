import { renderFile } from 'ejs'
import logger from '../utils/logger'
import { convertToTs } from '../convert'
import { API_REQUEST_TYPE } from '../constant'
import { ensureFile, appendFile, writeFile } from 'fs-extra'
import {
  shouldGenerateApi,
  normalizeFilePath,
  normalizeRootName,
  normalizeTsData,
  normalizeFileData,
} from './utils'

// 是否已经写入过该文件 适配同一个url 不同的 method
const writeSet = new Set()

/**
 * @description 将数据写入相应的文件
 * @param {object} baseInfo api配置数据
 * @param {object} fileData 文件数据
 * @param {boolean} isAppend 是否追加到文件
 */
async function handleWriteFile({ apiConfig, isAppend, path, data }) {
  const { baseInfo } = apiConfig
  // 组装数据                           // 模板路径
  const fileData = await renderFile(path.templatePath, {
    method: API_REQUEST_TYPE.findByValue(baseInfo.apiRequestType).key,
    rootName: normalizeRootName(baseInfo),
    body: normalizeTsData('BodyParam', data.request.body),
    query: normalizeTsData('QueryParam', data.request.query),
    response: normalizeTsData('Response', data.response),
    name: baseInfo.apiName,
    uri: baseInfo.apiURI,
  })

  await ensureFile(path.filePath)
  await (isAppend ? appendFile : writeFile)(
    path.filePath,
    normalizeFileData(fileData, path.filePath)
  )
}
/**
 * @description 生成 ts 文件
 * @param {object} apiGroup apiGroup数据
 * @param {any} config
 */
export default async function generateTsFile(apiGroup, structMap, tsConfig) {
  for (const apiConfig of apiGroup.apiList) {
    const { baseInfo } = apiConfig

    // 是否应该生成该 api
    if (!shouldGenerateApi(baseInfo, tsConfig)) continue
    // 文件路径
    const filePath = normalizeFilePath(baseInfo.apiURI, tsConfig, 'ts')

    logger.info(`✌ 正在生成 ts 文件: ${filePath}`)

    // 生成文件
    await handleWriteFile({
      apiConfig,
      isAppend: writeSet.has(filePath),
      path: { filePath, templatePath: tsConfig.templatePath },
      data: convertToTs(apiConfig, structMap), // 生成 ts 数据
    })
    writeSet.add(filePath)
    // 间隔 100ms 太快了内存会占满
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}
