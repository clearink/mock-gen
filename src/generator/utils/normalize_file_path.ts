import { resolve } from 'path'
import { MOCK_GEN_CONSTANT } from '../../constant/env'
/**
 * @description 获取生成的文件路径 优先使用配置的路径
 */
const { TYPE_DIR_NAME, MOCK_DIR_NAME } = MOCK_GEN_CONSTANT
export default function normalizeFilePath(extension: 'js' | 'ts', uri: string, dirPath?: string) {
  const formattedName = uri.replace(/\?.*/g, '').replace(/\{(.*?)\}/g, '[$1]')

  const filePath = `./${formattedName}.${extension}`

  const relativePath = extension === 'js' ? MOCK_DIR_NAME : TYPE_DIR_NAME
  return resolve(dirPath ?? relativePath, filePath)
}
