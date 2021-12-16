const judgeInclude = require("../../utils/judge_include");
const { API_STATUS } = require("../../constant");

/**
 * @description 是否应该生成该 api
 * @param {*} baseInfo
 * @param {*} config
 */
function shouldGenerateApi(baseInfo, config) {
  const { apiName, apiURI, apiStatus } = baseInfo ?? {};
  const { excludeApi, includeApi, includeStatus } = config;
  const shouldExclude =
    judgeInclude(apiName, excludeApi, false) ||
    judgeInclude(apiURI, excludeApi, false); // 被排除的 api
  const shouldUpdate =
    judgeInclude(apiName, includeApi) || judgeInclude(apiURI, includeApi); // 需要更新的 api

  const apiStatusLabel = API_STATUS.matchValue(+apiStatus)?.label;
  const shouldUpdateStatus = judgeInclude(apiStatusLabel, includeStatus); // 需要更新的 api 状态

  return !shouldExclude && shouldUpdate && shouldUpdateStatus;
}
module.exports = shouldGenerateApi;
