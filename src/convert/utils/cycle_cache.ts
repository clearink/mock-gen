import { RULE_CACHE_SEPARATOR as SEPARATOR, API_REQUEST_PARAM_TYPE as TYPE } from '../../constant'

/**
 * @description 记录循环依赖的结构体或自定义的树形数据
 */
type CacheKey = string | number
interface CacheValue {
  type: CacheKey
  paths: string[]
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

  public shouldCheck(type: string) {
    return !TYPE.findByValue(type)
  }

  // 检查是否出现了循环
  public isCycle(keys: string[], type: CacheValue['type']) {
    const parents = keys.concat()
    const set = new Set<CacheKey>()
    while (parents.length) {
      if (this.has(parents)) {
        const { type: $type } = this.get(parents)!
        if ($type === type && set.has(type)) return true
        set.add($type)
      }
      parents.pop()
    }
    return false
  }
}

export default new CycleCache()
