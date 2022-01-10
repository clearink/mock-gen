/**
 * @description 获取需要更新的组数据
 */
export default function flatGroupList(apiGroupList: any[]) {
  return apiGroupList.reduce<any[]>((result, group) => {
    const { apiGroupChildList: child = [] } = group
    const appendList = child.length ? flatGroupList(child) : []
    return result.concat(group, appendList)
  }, [])
}
