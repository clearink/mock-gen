// 判断类型
type VariableType =
  | 'Object'
  | 'Array'
  | 'Undefined'
  | 'Null'
  | 'Number'
  | 'String'
  | 'Boolean'
  | 'Function'
  | 'Symbol'
  | 'BigInt'
  | 'AsyncFunction'
  | 'Map'
export const validateType = (obj: any, type: VariableType) =>
  Object.prototype.toString.call(obj) === `[object ${type}]`
export const isString = (obj: any): obj is string => validateType(obj, 'String')
export const isObject = <T extends object>(obj: any): obj is T =>
  obj !== null && typeof obj === 'object'
export const isArray = Array.isArray
