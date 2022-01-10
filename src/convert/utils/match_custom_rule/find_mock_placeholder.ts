import { API_REQUEST_PARAM_TYPE as TYPE } from '../../../constant'

/**
 * @description 将数组转化为字符串
 * @param {string[]} array 数组
 * @param {string} separator 分隔符号
 * @returns {string}
 */
function arrayToString(array, separator = ', ') {
  return array.reduce((pre, cur, index, arr) => {
    if (cur === undefined) return pre
    if (index < arr.length - 1) return pre + cur + separator
    return pre + cur
  }, '')
}

/**
 * @description 获取 mock 占位符参数
 * @param {object} schema
 * @param {array} args
 * @returns {array}
 */
function findMockPlaceholder(schema, args = []) {
  const { paramType, minValue, maxValue, minLength, maxLength } = schema
  const pt = TYPE.findByValue(paramType)?.key
  let result = []
  switch (pt) {
    case 'string':
    case 'char':
    case 'boolean':
    case 'array':
      result = [minLength || args[0], maxLength || args[1]]
      break
    case 'int':
    case 'float':
    case 'double':
    case 'byte':
    case 'short':
    case 'long':
    case 'number':
      result = [minValue || args[0], maxValue || args[1]]
      break
  }
  return arrayToString(result)
}
export default findMockPlaceholder
