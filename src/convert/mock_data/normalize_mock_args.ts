import { API_REQUEST_PARAM_TYPE as TYPE } from '../../constant'

export default function normalizeMockArgs(
  schema: ParamItemSchema,
  mockArgs: any[] = [],
  mockType: any
) {
  const { paramType, minValue, maxValue, minLength, maxLength } = schema
  const pt = TYPE.findByValue(paramType)?.key
  let result = mockArgs
  switch (pt) {
    case 'string':
    case 'char':
    case 'boolean':
    case 'array':
      result[0] = minLength || mockArgs[0]
      result[1] = maxLength || mockArgs[1]
      break
    case 'int':
    case 'float':
    case 'double':
    case 'byte':
    case 'short':
    case 'long':
    case 'number':
      result[0] = minValue || mockArgs[0]
      result[1] = maxValue || mockArgs[1]
      break
  }
  try {
    const args = result.filter((item) => item !== undefined).join(', ')
    return mockType.replace(REPLACE_FLAG, args)
  } catch (error) {
    return mockType
  }
}

export const REPLACE_FLAG = '$$args$$'