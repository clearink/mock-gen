import { CycleCache } from '../utils'
const isObject = (obj: any): obj is object => obj !== null && typeof obj === 'object'
function get(obj: Record<string, any>, paths: string[]) {
  let target = { ...obj }
  for (const path of paths) {
    if (target.hasOwnProperty(path) && isObject(target[path])) {
      target = { ...target[path] }
    } else return target
  }
  return target
}

function set() {}

export default function renderCycleTemplate(template: Record<string, any>) {
  // console.log('template', template)
  console.log(CycleCache.values)
  /**
   * 过程
   * 1. 遍历 CycleCache
   * 2. 拆分出路径与 paramKey
   */
  for (let cache of CycleCache.values) {
    const { type: $type, paths } = cache
    if (paths.length < 2) continue
    const nodeTemplate = template.a.b.tree
    template.a.b.tree.children = `function(){
        return Mock.mock(${JSON.stringify(nodeTemplate)})
      }`
    // const templatePaths = paths.slice(0, -1)
    // const nodeTemplate = _.get(template, templatePaths)
    // _.set(
    //   template,
    //   paths,
    //   `function(){
    //   return Mock.mock(${JSON.stringify(nodeTemplate)})
    // }`
    // )
  }

  return template
}
