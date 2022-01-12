import { realpathSync } from 'fs-extra'
import { resolve } from 'path'

// 配置变量
export const CWD = realpathSync(process.cwd())
export const resolveApp = (...relativePath: string[]) => resolve(CWD, ...relativePath)

export const MOCK_GEN_CONSTANT = (() => {
  const constant = {
    CONFIG_DIR_PATH: resolveApp('.mock-gen'),
    // 默认mock文件地址
    MOCK_DIR_NAME: resolveApp('mock'),
    MOCK_TEMPLATE_PATH: resolve(__dirname, '../templates/mock_file.ejs'),
    // 默认ts文件地址
    TYPE_DIR_NAME: resolveApp('src/ts'),
    TYPE_TEMPLATE_PATH: resolve(__dirname, '../templates/ts_file.ejs'),
  }
  const { CONFIG_DIR_PATH } = constant
  return Object.assign(constant, {
    CONFIG_FILE_PATH: resolve(CONFIG_DIR_PATH, 'mock_gen.config.js'),
    EOLINKER_FILE_PATH: resolve(CONFIG_DIR_PATH, 'eolinker.json'),
  })
})()
