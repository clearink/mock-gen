import Mock from 'mockjs'
// 树形结构备用方案
export default function generateTreeData(depth: number | number[], template: any) {
  const depths = ([] as number[]).concat(depth)
  const min = depths[0]
  const max = depths[1] ?? depths[0]
  const depthRandom = Math.round(Math.random() * (max - min)) + min
  return function ({ parsedName }: Record<string, any>) {
    if (!template) return
    return (function loop(depth): Record<string, any> {
      const obj = Mock.mock(template)
      if (depth <= 1) return obj
      return { ...obj, [parsedName]: loop(depthRandom - 1) }
    })(depth)
  }
}
