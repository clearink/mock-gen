/**
 * @description 获取需要更新的组数据
 * @param {array} apiGroupList eolinker 数据
 * @returns {Array}
 */
function flatGroupList(apiGroupList) {
  return apiGroupList.reduce((result, group) => {
    const { apiGroupChildList: child = [] } = group;
    const appendList = child.length ? flatGroupList(child) : [];
    return result.concat(group, appendList);
  }, []);
}
module.exports = flatGroupList;
