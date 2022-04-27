import { API_REQUEST_PARAM_TYPE as TYPE, REPLACE_FLAG } from '../../constant'

export default function normalizeMockArgs(
  schema: ParamItemSchema,
  mockArgs: any[] = [],
  mockType: any
) {
  const { paramType, minValue, maxValue, minLength, maxLength } = schema
  const type = TYPE.findByValue(paramType, 'string')!.key
  let result = mockArgs
  switch (type) {
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
