const { API_REQUEST_TYPE } = require("../../../constant");
const normalizeTypeName = require("./normalize_type_name");
/**
 * @description
 * 获取 namespace name
 */
function normalizeRootName(baseInfo) {
  const { apiURI, apiRequestType } = baseInfo;
  const method = API_REQUEST_TYPE.matchValue(apiRequestType).key;
  const lastSlash = apiURI.replace(/(.*)\//g, "");
  return normalizeTypeName(`${method}_${lastSlash}`).join("");
}

module.exports = normalizeRootName;
