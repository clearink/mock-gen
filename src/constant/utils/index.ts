// 常量定义辅助函数
interface ConstantItem {
  /** 名称 */
  label: string

  /** 值 */
  value: any
  color?: string
  key?: boolean | number | string | symbol
  [K: string]: any
}

// 可选中排除一些必选项
type PartialExcludeKey<T, K extends keyof T> = Partial<T> & { [P in K]-?: T[P] }

type ExtendCallback<C extends Constant<any>, R> = (constant: C) => R

export default class Constant<V extends PartialExcludeKey<ConstantItem, 'value' | 'label'>> {
  public valueMap: Map<V['value'], V> = new Map()
  public keyMap: Map<V['key'], V> = new Map()

  // 默认的list 用于 选择项
  public _list: V[] = []

  public constructor(list: Readonly<V[]>) {
    this._list = list.concat()
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < list.length; i++) {
      const item = list[i] as V
      this.valueMap.set(item.value, item)
      if (item.hasOwnProperty('key')) {
        this.keyMap.set(item.key, item)
      }
    }
  }

  public get keys() {
    return Array.from(this.keyMap.keys())
  }

  public get values() {
    return Array.from(this.valueMap.values())
  }

  // 属性扩展
  public extend<R extends object>(fn: ExtendCallback<this, R>) {
    return Object.assign(this, fn(this))
  }

  // 匹配
  public match<T extends 'key' | 'value', Value = any>(
    property: T,
    value: T extends 'key' ? V['key'] : Value,
    // 预防某些以 undefined 作为 key 的情况
    defaultKey: V['key'] | symbol = Symbol('default')
  ): (V & Record<string, any>) | undefined {
    const attribute = property === 'key' ? 'keyMap' : 'valueMap'
    const matchItem = this[attribute].get(value as V['key'])
    return matchItem ?? this.keyMap.get(defaultKey)
  }

  public findByKey(
    key: V['key'],
    dk: V['key'] | symbol = Symbol('dk')
  ): (V & Record<string, any>) | undefined {
    const matchItem = this.keyMap.get(key)
    return matchItem ?? this.keyMap.get(dk)
  }
  public findByValue<Value = any>(
    value: Value,
    dk: V['key'] | symbol = Symbol('dk')
  ): (V & Record<string, any>) | undefined {
    const matchItem = this.valueMap.get(value)
    return matchItem ?? this.keyMap.get(dk)
  }

  // 当满足条件 以 key 做标识是为了更好的可读性
  public when<T = any>(value: T, content: V['key'] | V['key'][], attribute = 'value') {
    const contentList = ([] as V['key'][]).concat(content)
    for (const key of contentList) {
      const item = this.keyMap.get(key)
      // eslint-disable-next-line curly
      if (item && value === item[attribute]) return true
    }
    return false
  }
}
