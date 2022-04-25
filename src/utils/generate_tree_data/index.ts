import mockjs from 'mockjs'
import getMockTemplate from './get_mock_template'
/**
 * @description 生成树形数据
 */
export function generateTreeData($depth: number, parents: string[], paths: string[]) {
  const depth = ~~(Math.random() * $depth) + 1
  return function (this: any, arg: MockContext) {
    const {
      context: { templateRoot },
    } = arg
    const template = getMockTemplate(templateRoot, parents, paths, depth - 1)
    return mockjs.mock(template)
  }
}
