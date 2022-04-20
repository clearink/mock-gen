// render_cycle_template
interface MockTemplateValue {
  mock_rule?: string
  render_raw?: true
  mock_type: MockTemplateType | MockTemplateType[]
}
type MockTemplateType = string | Record<string, MockTemplateValue>

// 规定 如果是数组 那么一定只会有一个元素 或者 没有元素