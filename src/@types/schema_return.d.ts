// render_cycle_template
interface MockTemplateValue {
  rule?: string
  content: MockTemplateType | MockTemplateType[]
  render_raw?: true
  cycle_depth?: number
}
type MockTemplateType = string | Record<string, MockTemplateValue>
// 规定 如果是数组 那么一定只会有一个元素 或者 没有元素

interface SchemaToMockReturn {
  rule?: string // mock 规则
  content: any // mock 类型
  render_raw?: true // 不转成 string
  cycle_path?: string[] // 循环路径
  cycle_depth?: number // 循环深度
}
interface SchemaToJoiReturn {
  content: string[]
  cycle_path?: string[]
}
interface SchemaToTsReturn {
  content: string
  cycle_path?: string[]
  type: string
}
