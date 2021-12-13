const generateMockFile = require("./generate_mock");
const generateTsFile = require("./generate_ts");
const { findStructMap, flatGroupList, findUpdateGroup } = require("./utils");
const config = require("../config");

const { EOLINKER_JSON, mockConfig, tsConfig } = config ?? {};

// 获得结构体数据
const structMap = findStructMap(EOLINKER_JSON);
// 获得拍平后的 groupList;
const groupList = flatGroupList(EOLINKER_JSON.apiGroupList);

// 生成mock文件
const updateMockGroupList = findUpdateGroup(groupList, mockConfig);
(async () => {
  for (const apiGroup of updateMockGroupList)
    await generateMockFile(apiGroup, structMap);
})();

// 生成 ts 文件
const updateTsGroupList = findUpdateGroup(groupList, tsConfig);
(async () => {
  for (const apiGroup of updateTsGroupList)
    await generateTsFile(apiGroup, structMap);
})();
