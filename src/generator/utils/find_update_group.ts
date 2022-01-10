import judgeInclude from '../../utils/judge_include'
/**
 * @description 获取需要更新的组数据
 */
interface findUpdateGroupConfig {
  includeGroup?: string[]
  excludeGroup?: string[]
  [key: string]: any
}
export default function findUpdateGroup(groupList: any[], config: findUpdateGroupConfig = {}) {
  // 需要更新的组 , 不需要更新的组(优先级高)
  const { includeGroup, excludeGroup } = config

  return groupList.filter((group) => {
    const { groupName } = group
    const shouldExclude = judgeInclude(groupName, excludeGroup, false) // 被排除
    const shouldUpdate = judgeInclude(groupName, includeGroup) // 被包括
    return !shouldExclude && shouldUpdate
  })
}
