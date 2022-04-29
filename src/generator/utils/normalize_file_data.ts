import prettier from 'prettier'
import logger from '../../utils/logger'

/**
 * @description 使用 prettier 格式化文件
 * @param {any} source 源数据
 */
export default function normalizeFileData(source: string, filepath: string, keepQuote = true) {
  const config = {
    tabWidth: 4,
    filepath,
    quoteProps: keepQuote ? 'preserve' : 'as-needed',
  } as const
  try {
    return prettier.format(source, config)
  } catch (error) {
    logger.error(`❌ 文件格式化失败 请检查：${filepath}`)
    return source
  }
}
