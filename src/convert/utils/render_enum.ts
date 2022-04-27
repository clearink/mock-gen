export function renderJoiEnum(enumList: any[] | string, type: string) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList).replace(/(^\[)|(\]$)/g, '')
  }
  // 单独处理 array 情况
  if (type === 'array') {
    return { content: ['array().', 'items(joi.valid(', enumList, '))'] }
  }
  return { content: ['valid(', enumList, ')'] }
}

export function renderMockEnum(rule: CustomMockRule): SchemaToMockReturn {
  // TODO: 待优化
  const enumList = JSON.stringify(rule.mock_type)
  return { rule: rule.mock_rule, content: enumList, render_raw: true }
}
export function renderTsEnum(enumList: any[] | string, isArrayType: boolean) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList)
      .replace(/(^\[)|(\]$)/g, '')
      .replace(/\,/g, ' | ')
  }
  if (isArrayType) {
    return { type: 'enum', content: `(${enumList})[]`, isArrayType }
  }
  return { type: 'enum', content: enumList, isArrayType }
}
