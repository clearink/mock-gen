export function renderJoiEnum(enumList: any[] | string, type: string) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList).replace(/(^\[)|(\]$)/g, '')
  }
  // 单独处理 array 情况
  if (type === 'array') {
    return ['array().', 'items(joi.valid(', enumList, '))']
  }
  return [['valid(', enumList, ')']]
}

export function renderMockEnum(mockRule: CustomMockRule, type: string) {
  // TODO: 待优化
  const { content, rule } = mockRule
  return { content, rule }
}
export function renderTsEnum(enumList: any[] | string, type: string) {
  if (Array.isArray(enumList)) {
    enumList = JSON.stringify(enumList)
      .replace(/(^\[)|(\]$)/g, '')
      .replace(/\,/g, ' | ')
  }
  if (type === 'array') {
    return { tsType: 'enum', tsContent: `(${enumList})[]` }
  }
  return { tsType: 'enum', tsContent: enumList }
}
