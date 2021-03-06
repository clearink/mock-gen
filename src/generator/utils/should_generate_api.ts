import { API_STATUS } from '../../constant'
import judgeInclude from '../../utils/judge_include'

/**
 * @description 是否应该生成该 api
 */
export default function shouldGenerateApi(
  baseInfo: ApiListItem['baseInfo'],
  config: ConfigSchemaItem
) {
  const { apiName, apiURI, apiStatus } = baseInfo ?? {}
  const { excludeApi, includeApi, includeStatus } = config
  const shouldExclude =
    judgeInclude(apiName, excludeApi, false) || judgeInclude(apiURI, excludeApi, false) // 被排除的 api
  const shouldUpdate = judgeInclude(apiName, includeApi) || judgeInclude(apiURI, includeApi) // 需要更新的 api

  const apiStatusLabel = API_STATUS.findByValue(+apiStatus, 'publish')!.label
  const shouldUpdateStatus = judgeInclude(apiStatusLabel, includeStatus) // 需要更新的 api 状态

  return !shouldExclude && shouldUpdate && shouldUpdateStatus
}
