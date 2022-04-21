import {
  RULE_CACHE_SEPARATOR as SEPARATOR,
  API_REQUEST_PARAM_TYPE as TYPE,
} from '../../../constant'

/**
 * @description 记录循环依赖的结构体或自定义的树形数据
 */
type CacheKey = string | number
export interface CacheValue {
  paramType: CacheKey // 当前字段的类型
  paramKey: string // 字段名称
  parents: string[] // 父级路径
  cycle_path: string[] // 树形结构路径
  mock_rule?: string // mock 规则
}
class CycleCache {
  private cache: Map<string, CacheValue> = new Map()

  public get values() {
    return Array.from(this.cache.values())
  }

  public has(keys: CacheKey[]) {
    return this.cache.has(keys.join(SEPARATOR))
  }
  public set(keys: CacheKey[], value: CacheValue) {
    this.cache.set(keys.join(SEPARATOR), value)
  }
  public get(keys: CacheKey[]) {
    return this.cache.get(keys.join(SEPARATOR))
  }
  public delete(keys: string[]) {
    const key = keys.join(SEPARATOR)
    return this.cache.delete(key)
  }
  public clear() {
    this.cache.clear()
  }

  public shouldCheck(paramType: string | number) {
    return !TYPE.findByValue(paramType)
  }

  // 检查是否出现了循环
  public isCycle(keys: string[], type: CacheValue['paramType']) {
    const parents = keys.concat()
    const set = new Set<CacheKey>()
    while (parents.length) {
      const cache = this.get(parents)
      parents.pop()
      if (!cache || !this.shouldCheck(cache.paramType)) continue
      if (cache.paramType === type && set.has(type)) return true
      set.add(cache.paramType)
    }
    return false
  }
}

export default new CycleCache()
