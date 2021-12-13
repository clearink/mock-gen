/**
 * @description 将 ts 生成的类型对象处理成能够被渲染的 cjs 数据
 * 步骤
 * 1. 扁平化整个对象
 * 2. 生成对应的名称
 * 3. 返回
 */
 function normalizeTsData(data) {
    const flattenData = flatTsData(data);
}

/**
 * @description ts 配置数据
 * @param {object} data
 */
function flatTsData(data) {
    return Object.entries(data).reduce(
        result,
        ([name, config]) => {
            if (isObject(config)) {
                const { type, content } = config;
                const typeName = normalizeTypeName(name);
                return { ...result, [typeName]: flatTsData(content) };
            }
            return result;
        },
        {}
    );
}

const isObject = (object) =>
    Object.prototype.toString.call(object) === "[object Object]";

/**
 * @description 格式化类型名称 用于生成新的 interface
 * @param { string } name 名称
 */
function normalizeTypeName(name, pascal = true) {
    let normalized = name
        .replace(/(.*)\//g, "") // 截取最后一个 / 后面的值
        .replace(/[-_](\w)/g, (_, $1) => $1.toUpperCase());
    if (!pascal) return normalized;
    return normalized.replace(/^\w/g, ($0) => $0.toUpperCase()); // 帕斯卡命名
}
module.exports = {
    normalizeTsData,
    normalizeTypeName
}