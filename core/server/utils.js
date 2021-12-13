// 数组去重
function unique(array, by) {
  if (by === undefined) return Array.from(new Set(array));
  const map = new Map();
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    map.set(element[by], element);
  }
  return Array.from(map.values());
}
// 防抖
function debounce(delay, fn) {
  let timer = undefined;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
module.exports = {
  unique,
  debounce,
};
