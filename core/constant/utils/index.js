class Constant {
  valueMap = new Map();
  keyMap = new Map();

  _list = [];

  constructor(list) {
    this._list = list.concat();
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      this.valueMap.set(item.value, item);
      if (item.hasOwnProperty("key")) {
        this.keyMap.set(item.key, item);
      }
    }
  }

  get keys() {
    return Array.from(this.keyMap.keys());
  }

  get values() {
    return Array.from(this.valueMap.values());
  }

  // 属性扩展
  extend(fn) {
    return Object.assign(this, fn(this));
  }

  // 以 value 去 匹配 item
  matchValue(key, defaultKey = Symbol("defaultKey")) {
    // 匹配 属性
    const matchItem = this.valueMap.get(key);
    return matchItem ?? this.keyMap.get(defaultKey);
  }

  // 以 key 去匹配 value + status
  matchKey(key, defaultKey = Symbol("defaultKey")) {
    // 匹配 属性
    const matchItem = this.keyMap.get(key);
    return matchItem ?? this.keyMap.get(defaultKey);
  }

  when(value, content, attribute = "value") {
    const contentList = [].concat(content);
    for (const key of contentList) {
      const item = this.keyMap.get(key);
      if (item && value === item[attribute]) return true;
    }
    return false;
  }
}

module.exports = Constant;
