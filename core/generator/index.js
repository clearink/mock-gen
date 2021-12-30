const generateMockFile = require("./generate_mock");
const generateTsFile = require("./generate_ts");
const fetchEolinker = require("./fetch_eolinker");
const { findStructMap, flatGroupList, findUpdateGroup } = require("./utils");
const config = require("../config");
const { fetchConfig, mockConfig, tsConfig } = config ?? {};

// 生成 mock
async function generateMock(groupList, structMap) {
  const updateMockGroupList = findUpdateGroup(groupList, mockConfig);
  for (const apiGroup of updateMockGroupList) {
    await generateMockFile(apiGroup, structMap);
  }
}

// 生成 ts
async function generateTs(groupList, structMap) {
  const updateTsGroupList = findUpdateGroup(groupList, tsConfig);
  for (const apiGroup of updateTsGroupList) {
    await generateTsFile(apiGroup, structMap);
  }
}

async function generate({ ts, mock, fetch }) {
  const fetchSuccess = fetch ? (await fetchEolinker()) : true;

  // 更新失败 直接返回
  if (!fetchSuccess) return;

  // api 配置
  const EOLINKER_JSON = require(fetchConfig.filePath);

  // 获得结构体数据
  const structMap = findStructMap(EOLINKER_JSON);
  // 获得拍平后的 groupList;
  const groupList = flatGroupList(EOLINKER_JSON.apiGroupList);

  if (mock) generateMock(groupList, structMap);

  if (ts) generateTs(groupList, structMap);

}
module.exports = generate;