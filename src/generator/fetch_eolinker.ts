import ora from 'ora'
import fetch from 'node-fetch'
import logger from '../utils/logger'
import { ensureFile, writeFile } from 'fs-extra'
import getMockConfig from '../utils/get_mock_config'

/**
 * @description 获取 eolinker 配置文件
 * @returns {boolean}
 */
export default async function fetchEolinker(fetchConfig: Record<string, any>) {
  const { filePath, spaceKey, projectHashKey, EOLINKER_URL, EO_SECRET_KEY } = fetchConfig

  const spinner = ora(logger.info('正在请求 api 数据', false)).start()
  try {
    const response = await fetch(EOLINKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Eo-Secret-Key': EO_SECRET_KEY,
      },
      body: `space_id=${spaceKey}&project_id=${projectHashKey}`,
    })
    const fileData = await response.json()
    await ensureFile(filePath)
    await writeFile(filePath, JSON.stringify(fileData))
    const text = `数据请求成功, 已存储到: ${filePath}`
    spinner.succeed(logger.success(text, false))
    return true
  } catch (error) {
    const text = `数据请求失败, 请重试 \n ${error.toString()}`
    spinner.fail(logger.error(text, false))
    return false
  }
}
