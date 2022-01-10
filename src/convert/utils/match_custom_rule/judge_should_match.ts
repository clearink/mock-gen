import judgeInclude from "../../../utils/judge_include"

/**
 * @description 是否应该匹配该规则
 *
 * @param {object} mockConfig
 * @param {object} apiConfig
 * @returns
 */
function judgeShouldMatch(mockConfig, apiConfig) {
  const { includeGroup, excludeGroup, includeApi, excludeApi } = mockConfig
  const { apiName, apiURI } = apiConfig?.baseInfo || {}
  const shouldMatchGroup =
    judgeInclude(apiConfig.groupName, includeGroup, true) && // 被包括
    !judgeInclude(apiConfig.groupName, excludeGroup, false) // 被排除
  // 被包括
  const shouldIncludeMatchApi =
    judgeInclude(apiName, includeApi) || judgeInclude(apiURI, includeApi)
  // 被排除
  const shouldExcludeMatchApi =
    judgeInclude(apiName, excludeApi, false) || judgeInclude(apiURI, excludeApi, false)
  return !shouldExcludeMatchApi && shouldMatchGroup && shouldIncludeMatchApi
}

export default judgeShouldMatch
