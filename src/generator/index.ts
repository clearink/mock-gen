import getMockConfig from '../utils/get_mock_config'
import fetchEolinker from './fetch_eolinker'
import generateMockFile from './generate_mock'
import generateTsFile from './generate_ts'

import { findStructMap, flatGroupList, findUpdateGroup } from './utils'

// 生成 mock
async function generateMock(groupList, structMap, mockConfig) {
  const updateMockGroupList = findUpdateGroup(groupList, mockConfig)
  for (const apiGroup of updateMockGroupList) {
    await generateMockFile(apiGroup, structMap, mockConfig)
  }
}

// 生成 ts
async function generateTs(groupList, structMap, tsConfig) {
  const updateTsGroupList = findUpdateGroup(groupList, tsConfig)
  for (const apiGroup of updateTsGroupList) {
    await generateTsFile(apiGroup, structMap, tsConfig)
  }
}

interface GenerateProps {
  ts: boolean
  mock: boolean
  fetch: boolean
}
export default async function generate(props: GenerateProps) {
  const { ts, mock, fetch } = props

  const { fetchConfig, mockConfig, tsConfig } = await getMockConfig(true)

  const fetchSuccess = fetch ? await fetchEolinker(fetchConfig) : true

  // 更新失败 直接返回
  if (!fetchSuccess) return

  // api 配置
  delete require.cache[fetchConfig.filePath]
  const EOLINKER_JSON = require(fetchConfig.filePath)

  // 获得结构体数据
  const structMap = findStructMap(EOLINKER_JSON)
  // 获得拍平后的 groupList;
  const groupList = flatGroupList(EOLINKER_JSON.apiGroupList)

  if (mock) generateMock(groupList, structMap, mockConfig)

  if (ts) generateTs(groupList, structMap, tsConfig)
}
