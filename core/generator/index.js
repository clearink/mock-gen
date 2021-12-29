const generateMockFile = require("./generate_mock");
const generateTsFile = require("./generate_ts");
const fetchEolinker = require("./fetch_eolinker");
const { findStructMap, flatGroupList, findUpdateGroup } = require("./utils");
const config = require("../config");
const { fetchConfig, mockConfig, tsConfig } = config ?? {};

// 参数
const args = process.argv.slice(2).map((item) => item.toLowerCase());

(async () => {
  // 更新 eolinker 是否成功
  const fetchSuccess = args.includes("nofetch") ? true : await fetchEolinker();

  // 更新失败 直接返回
  if (!fetchSuccess) return;

  // api 配置
  const EOLINKER_JSON = require(fetchConfig.filePath);

  // 获得结构体数据
  const structMap = findStructMap(EOLINKER_JSON);
  // 获得拍平后的 groupList;
  const groupList = flatGroupList(EOLINKER_JSON.apiGroupList);

  if (!args.includes("nomock")) generateMock(groupList, structMap);

  if (!args.includes("nots")) generateTs(groupList, structMap);
})();

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
