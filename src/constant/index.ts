import Constant from './utils'

/** @description api 状态 */
export const API_STATUS = new Constant([
  { label: '已发布', value: 0, key: 'publish' },
  { label: '维护', value: 1, key: 'uphold' },
  { label: '废弃', value: 2, key: 'deprecated' },
  { label: '待确定', value: 3, key: 'pending' },
  { label: '开发', value: 4, key: 'developing' },
  { label: '测试', value: 5, key: 'testing' },
  { label: '对接', value: 6, key: 'docking' },
  { label: '异常', value: 7, key: 'error' },
  { label: '设计中', value: 8, key: 'design' },
  { label: '完成', value: 9, key: 'complete' },
])

/** @description 请求方法 */
export const API_REQUEST_TYPE = new Constant([
  { label: 'post', value: 0, key: 'post' },
  { label: 'get', value: 1, key: 'get' },
  { label: 'put', value: 2, key: 'put' },
  { label: 'delete', value: 3, key: 'delete' },
  { label: 'head', value: 4, key: 'head' },
  { label: 'options', value: 5, key: 'options' },
  { label: 'patch', value: 6, key: 'patch' },
])

/** @description 请求参数是否为必填 */
export const API_PARAM_REQUIRED = new Constant([
  { label: '必填', value: '0', key: 'required' },
  { label: '可选', value: '1', key: 'option' },
])

/** @description 数据结构类型 */
export const STRUCTURE_TYPE = new Constant([
  { label: 'formData', key: 'formData', value: '0' },
  { label: 'json', key: 'json', value: '15' },
  { label: 'xml', key: 'xml', value: '16' },
  { label: 'array', key: 'array', value: '12' },
  { label: 'object', key: 'object', value: '13' },
  { label: 'enum', key: 'enum', value: '17' },
])
/** @description 响应值根类型 object/array */
export const RESULT_PARAM_JSON_TYPE = new Constant([
  { label: 'object', value: 0, key: 'object' },
  { label: 'array', value: 1, key: 'array' },
])

/**
 * @description 参数类型
 */
export const API_REQUEST_PARAM_TYPE = new Constant([
  { label: 'string', value: '0', key: 'string' },
  { label: 'file', value: '1', key: 'file' },
  { label: 'json', value: '2', key: 'json' },
  { label: 'int', value: '3', key: 'int' },
  { label: 'float', value: '4', key: 'float' },
  { label: 'double', value: '5', key: 'double' },
  { label: 'date', value: '6', key: 'date' },
  { label: 'datetime', value: '7', key: 'datetime' },
  { label: 'boolean', value: '8', key: 'boolean' },
  { label: 'byte', value: '9', key: 'byte' },
  { label: 'short', value: '10', key: 'short' },
  { label: 'long', value: '11', key: 'long' },
  { label: 'array', value: '12', key: 'array' },
  { label: 'object', value: '13', key: 'object' },
  { label: 'number', value: '14', key: 'number' },
  { label: 'null', value: '15', key: 'null' },
  { label: 'char', value: 'char', key: 'char' },
  { label: 'enum', value: '17', key: 'enum' },
])
