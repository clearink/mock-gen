interface ParamValueEnum {
  value?: string // 常规 paramValueList
  paramKey?: string // 自定义数据结构 paramValueList
  paramType: ParamItemSchema['paramType']
}

interface ParamItemSchema {
  paramNotNull: '0' | '1'
  paramType: string | number
  paramKey: string
  structureID?: number
  paramLimit?: string
  paramValueList?: ParamValueEnum[]
  childList?: ParamValueEnum[]
  minValue?: any
  maxValue?: any
  minLength?: any
  maxLength?: any
}

interface ApiListItem {
  requestInfo: ParamItemSchema[]
  urlParam: ParamItemSchema[]
  restfulParam: ParamItemSchema[]
  resultInfo: ParamItemSchema[]
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
