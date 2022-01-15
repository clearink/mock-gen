import merge from 'lodash.merge'
import { resolve } from 'path'
import { pathExistsSync, copyFileSync, ensureFileSync, copySync } from 'fs-extra'
import { MOCK_GEN_CONSTANT } from '../constant/env'
import defaultConfig from './mock_gen.config'
import logger from './logger'

/**
 *
 * @param useCache 是否使用缓存数据
 * @returns
 */
let cache: ConfigSchema | null = null
export default function getMockConfig(useCache = false): ConfigSchema {
  // 项目内的config
  if (useCache && cache !== null) return cache
  const { CONFIG_FILE_PATH: CONFIG_PATH, TEMPLATE_DIR_PATH } = MOCK_GEN_CONSTANT
  let customConfig = {}
  if (pathExistsSync(CONFIG_PATH)) {
    delete require.cache[CONFIG_PATH]
    customConfig = require(CONFIG_PATH)
  } else {
    // 静默生成默认配置文件 并提示
    ensureFileSync(CONFIG_PATH)
    copyFileSync(resolve(__dirname, './mock_gen.default.js'), CONFIG_PATH)
    copySync(resolve(__dirname, '../templates'), TEMPLATE_DIR_PATH)
    logger.warning(`未检测到配置文件,已自动生成.请修改配置后运行: ${CONFIG_PATH}`)
    process.exit(0)
  }
  return (cache = merge({} as any, defaultConfig, customConfig))
}
