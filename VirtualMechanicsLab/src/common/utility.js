import * as types from '@/modules-constant.js'
import defaultProperty from '@/common/default/default-property.json'
import defaultRectangle from './default/default-rectangle.json'
import defaultCircle from './default/default-circle.json'
import defaultTriangle from './default/default-triangle.json'
let utility = {
  generateCellData(type, body = {}) {
    let mxCell = new window.mxCell()
    mxCell.vertex = true
    mxCell.value = body
    // 物理属性混合
    mxCell.value.physics = Object.assign({}, this.deepClone(defaultProperty.physics), body.physics)
    mxCell.value.condition = Object.assign({}, this.deepClone(defaultProperty.condition), body.condition)
    // 样式属性混合
    mxCell.value.style = Object.assign({}, this.deepClone(defaultProperty.style), body.style)
    let { fillColor, fontColor } = mxCell.value.style
    mxCell.style = 'fillColor=' + fillColor + ';fontColor=' + fontColor

    // 个性属性设置
    let { general, geometry, physics, condition, style } = body
    switch (type) {
      case types.RECTANGLE:
        var { x, y, width, height } = geometry
        mxCell.geometry = new window.mxGeometry(x - width / 2, y - height / 2, width, height)
        mxCell.style += ';shape=rectangle;'
        break
      case types.CIRCLE:
        var { x, y, radius } = geometry
        mxCell.geometry = new window.mxGeometry(x - radius, y - radius, 2 * radius, 2 * radius)
        mxCell.style += ';shape=MyCircle'
        break
      default:
        console.error('unknown body type:' + type)
    }
    return mxCell
  },
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}
export default utility
// var styles = ['shadow', 'dashed', 'dashPattern', 'fontFamily', 'fontSize', 'fontColor', 'align', 'startFill',
// 'startSize', 'endFill', 'endSize', 'strokeColor', 'strokeWidth', 'fillColor', 'gradientColor',
// 'html', 'part', 'noEdgeStyle', 'edgeStyle', 'elbow', 'childLayout'
// ];
