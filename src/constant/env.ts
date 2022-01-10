import { realpathSync } from 'fs-extra'
import { resolve } from 'path'

// 配置变量
export const CWD = realpathSync(process.cwd())
export const resolveApp = (...relativePath: string[]) => resolve(CWD, ...relativePath)

export const MOCK_GEN_CONSTANT = (() => {
  const constant = {
    APP_DIR: resolveApp('.'),
    CONFIG_FILE_NAME: 'mock_gen.config.js',
    MOCK_DIR_NAME: resolveApp('mock'),
    MOCK_TEMPLATE_PATH: resolve(__dirname, '../templates/mock_file.ejs'),

    TYPE_DIR_NAME: resolveApp('src/ts'),
    TYPE_TEMPLATE_PATH: resolve(__dirname, '../templates/ts_file.ejs'),

    EOLINKER_FILE_PATH: resolveApp('.mock-gen/eolinker.json'),
  }
  const { CONFIG_FILE_NAME } = constant
  return Object.assign(constant, {
    CONFIG_FILE_PATH: resolveApp('.mock-gen', CONFIG_FILE_NAME),
  })
})()
