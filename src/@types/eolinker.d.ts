interface ParamValueEnum {
  value?: string // 常规 paramValueList
  paramKey?: string // 自定义数据结构 paramValueList
  paramType: ParamItemSchema['paramType']
}

interface ParamItemSchema {
  paramNotNull: '0' | '1'
  paramType: string | number // 被修正过
  originalType: string // 原始的类型
  paramKey: string
  structureID?: number | string
  paramLimit?: string
  paramValueList?: ParamValueEnum[]
  childList?: ParamValueEnum[]
  minValue?: any
  maxValue?: any
  minLength?: any
  maxLength?: any
}
interface ResultInfoItem {
  responseID: number
  responseCode: string // 状态码
  responseName: string // 响应名称
  paramJsonType: number // JSON数据根类型
  isDefault: 0 | 1 // 是否为默认返回值
  paramList: ParamItemSchema[]
}

interface ApiListItem {
  requestInfo: ParamItemSchema[]
  urlParam: ParamItemSchema[]
  restfulParam: ParamItemSchema[]
  resultInfo: ResultInfoItem[]
  resultParamJsonType: 0 | 1
  groupName: string
  baseInfo: {
    apiName: string
    apiURI: string
    apiStatus: string
    apiRequestType: number
  }
}

interface GroupListItem {
  groupID: number
  groupName: string
  parentGroupID: number
  apiList?: ApiListItem[]
  apiGroupChildList?: GroupListItem[]
}

interface StructDataSchema {
  paramID: string
  paramKey: string
  paramNotNull: ParamItemSchema['paramNotNull']
  paramType: ParamItemSchema['paramType']
  originalType: ParamItemSchema['originalType']
  paramValueList?: ParamItemSchema['paramValueList']
  childList?: ParamItemSchema['childList']
}
interface StructureListItem {
  structureID: number
  structureName: string
  structureData: StructDataSchema[]
  structureType: string
}
interface EolinkerDataSchema {
  dataStructureList?: StructureListItem[]
  apiGroupList?: GroupListItem[]
}
