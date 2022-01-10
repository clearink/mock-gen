import { resolve } from 'path'
/**
 * @description 获取生成的文件路径 优先使用配置的路径
 */
// TODO: 待优化
export default function normalizeFilePath(uri: string, config: Record<string, any>, type = 'js') {
  const fileName = uri.replace(/\?.*/g, '').replace(/\{(.*?)\}/g, '[$1]')
  if (config.dirPath) {
    return resolve(config.dirPath, `./${fileName}.${type}`)
  }
  const pathSegment = type === 'js' ? 'mock' : 'src/ts'
  return resolve(process.cwd(), `./${pathSegment}/${fileName}.${type}`)
}
