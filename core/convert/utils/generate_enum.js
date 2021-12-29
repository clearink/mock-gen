const { API_REQUEST_PARAM_TYPE: TYPE } = require("../../constant");
const logger = require("../../utils/logger");
/**
 * @description 获取字段枚举值 不允许 array object 自定义数据结构
 * @param {Map} structMap 结构体 map
 * @param {string} paramType 默认枚举值类型
 * @param {Array<{value:any, paramType:string}>} array 枚举值数组
 * @param {boolean} shouldGenerate 是否需要生成
 * @returns { Array }
 */
function generateEnum(structMap, array = [], shouldGenerate = true) {
  if (!shouldGenerate) return [];
  // 获取参数类型 默认都是 string
  return array.reduce((pre, item) => {
    const { value: $value, paramKey, paramType } = item;
    const value = $value ?? paramKey;
    // 值为空 直接返回
    if (!value) return pre;
    if (structMap.has(paramType)) {
      logger.warning("枚举值暂不支持自定义结构体");
      return pre;
    }

    const type = TYPE.matchValue(paramType, "string").key; // 默认为 string
    switch (type) {
      case "string":
      case "char":
      case "date":
      case "datetime":
        return pre.concat(value);
      case "int":
      case "float":
      case "double":
      case "number":
      case "byte":
      case "short":
      case "long":
        // 转换为数字
        return pre.concat(Number.isNaN(+value) ? value : +value);
      case "boolean":
        // 布尔值
        return pre.concat(/^true$/i.test(value));
      case "null":
        return pre.concat(null);
      case "file":
      case "array":
      case "json":
      case "object":
        // 复杂类型 直接返回
        logger.error(`枚举值暂不支持${type}类型`);
        return pre;
      default:
        return pre;
    }
  }, []);
}
module.exports = generateEnum;
/** 字段值  enum
 *  {
      "value": "1",
      "paramType": "0",
    },

    数据结构 enum
    {
      paramKey: "true"
      paramType: "8"
    }
 */
