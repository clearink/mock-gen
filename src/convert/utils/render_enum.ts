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

export function renderMockEnum(mockRule: CustomMockRule, type: string) {
  // TODO: 待优化
  return mockRule
}
export function renderTsEnum(enumList: any[] | string, type: string) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList)
      .replace(/(^\[)|(\]$)/g, '')
      .replace(/\,/g, ' | ')
  }
  if (type === 'array') {
    return { type: 'enum', content: `(${enumList})[]` }
  }
  return { type: 'enum', content: enumList }
}
