const judgeInclude = require("./judge_include");
/**
 * @description 获取需要更新的组数据
 * @param {array} groupList eolinker 数据
 * @param {any} config 配置
 * @returns {Array}
 */
function findUpdateGroup(groupList, config = {}) {
  // 需要更新的组 , 不需要更新的组(优先级高)
  const { includeGroup, excludeGroup } = config;

  return groupList.filter((group) => {
    const { groupName } = group;
    const shouldExclude = judgeInclude(groupName, excludeGroup, false); // 被排除
    const shouldUpdate = judgeInclude(groupName, includeGroup); // 被包括
    return !shouldExclude && shouldUpdate;
  });
}
module.exports = findUpdateGroup;
