/**
 * TODO: 增加 groupName 判断逻辑 
 * 使得自动获取其父组别下的所有组别 api 数据
 * @description 获取需要更新的组数据
 */
export default function flatGroupList(apiGroupList: GroupListItem[] = []) {
  return apiGroupList.reduce((result, group) => {
    const { apiGroupChildList: child = [] } = group
    const appendList: GroupListItem[] = child.length ? flatGroupList(child) : []
    delete group['apiGroupChildList'] // 删除对应的属性
    return result.concat(group, appendList)
  }, [] as GroupListItem[])
}
