import mockjs from 'mockjs'
import getMockTemplate from './get_mock_template'
/**
 * @description 生成树形数据
 */
export function generateTreeData(
  depth: number,
  $templatePath: string[],
  $fullPath: string[],
  useRootTemplate = false // 是否使用根模板
) {
  return function (this: any, arg: MockContext) {
    const {
      context: { templateRoot },
    } = arg
    const templatePath = useRootTemplate ? [] : $templatePath
    const fullPath = useRootTemplate
      ? $fullPath
      : $fullPath.slice($templatePath.length - $fullPath.length)
    const template = getMockTemplate(depth, templateRoot, templatePath, fullPath)
    return template ? mockjs.mock(template) : null
  }
}
