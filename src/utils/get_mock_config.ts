import merge from 'lodash.merge'
import { resolve } from 'path'
import { prompt } from 'inquirer'
import { pathExistsSync, copyFileSync, ensureFile } from 'fs-extra'
import logger from '../utils/logger'
import { MOCK_GEN_CONSTANT } from '../constant/env'
import defaultConfig from './mock_gen.config'

interface ConfigItemProps {
  includeStatus?: string[]
  includeGroup?: string[]
  excludeGroup?: string[]
  includeApi?: string[]
  excludeApi?: string[]
  dirPath: string
  templatePath: string
}
interface ConfigProps {
  mockConfig: ConfigItemProps
  tsConfig: ConfigItemProps
  fetchConfig: {
    filePath: string
    spaceKey: string
    projectHashKey: string
    EOLINKER_URL: string
    EO_SECRET_KEY: string
  }
  customMatchRule?: Record<string, any>
}

/**
 * 获取合并后的配置文件
 */
export default async function getMockConfig(inquire = false) {
  // 项目内的config
  const { CONFIG_FILE_PATH, CONFIG_FILE_NAME } = MOCK_GEN_CONSTANT
  let customConfig = {}
  if (pathExistsSync(CONFIG_FILE_PATH)) {
    delete require.cache[CONFIG_FILE_PATH]
    customConfig = require(CONFIG_FILE_PATH)
  } else if (inquire) {
    const answer = await prompt<{ create: boolean }>([
      {
        type: 'confirm',
        message: logger.warning('检测到项目中没有配置文件，是否自动生成默认配置', false),
        name: 'create',
        default: false,
      },
    ])
    if (answer.create) {
      await ensureFile(CONFIG_FILE_PATH)
      copyFileSync(resolve(__dirname, './mock_gen.default.js'), CONFIG_FILE_PATH)
    }
  }
  return merge({}, defaultConfig, customConfig) as ConfigProps
}
