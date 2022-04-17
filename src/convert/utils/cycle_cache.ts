import { RULE_CACHE_SEPARATOR as SEPARATOR, API_REQUEST_PARAM_TYPE as TYPE } from '../../constant'

/**
 * @description 记录循环依赖的结构体或自定义的树形数据
 */
interface CacheValue {
  type: string | number
  depth: number
}

class CycleCache {
  private cache: Map<string | number, CacheValue> = new Map()
  public has(key: string | number) {
    return this.cache.has(key)
  }
  public set(keys: string[], value: CacheValue) {
    this.cache.set(keys.join(SEPARATOR), value)
  }
  public get(key: string | number) {
    return this.cache.get(key)
  }
  public delete(keys: string[]) {
    const key = keys.join(SEPARATOR)
    return this.cache.delete(key)
  }
  public clear() {
    this.cache.clear()
  }
  public get size() {
    return this.cache.size
  }
  public shouldCheck(type: string) {
    return !TYPE.findByValue(type)
  }

  // 检查是否出现了循环
  public isCycle(keys: string[], type: CacheValue['type']) {
    const parents = keys.concat()
    while (parents.length) {
      const cacheKey = parents.join(SEPARATOR)
      if (this.cache.has(cacheKey)) {
        const { type: $type, depth } = this.cache.get(cacheKey)!
        if ($type === type) {
          if (depth === 0) return true
          this.cache.set(cacheKey, { type, depth: depth - 1 })
        }
      }
      parents.pop()
    }
    return false
  }
}

export default new CycleCache()
