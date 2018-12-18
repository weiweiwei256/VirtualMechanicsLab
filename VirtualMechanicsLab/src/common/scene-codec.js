import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js'
let SceneCodec = {
  /**
   *将jsonData解码到model
   *
   * @param {*} jsonData
   * @param {*} model
   */
  decode(jsonData, model) {
    let parentCell = model.root.children[0]
    let { name, description, gravity } = jsonData
    parentCell.value = { name, description, gravity }
    for (let i in jsonData.bodies) {
      let mxCell = utility.generateCellData(jsonData.bodies[i].general.type, jsonData.bodies[i])
      parentCell.insert(mxCell)
    }
    model.setRoot(model.root)
  },

   encode(model) {
    // 从rootCell中提取属性
    let { name, description, gravity } = model.root.children[0].value
    let jsonData = { name, description, gravity, bodies: [] }
    // 获取组件属性
    for (let i in model.root.children[0].children) {
      jsonData.bodies.push(model.root.children[0].children[i].value)
    }
    return jsonData
  }
}
export default SceneCodec
