import utility from '@/common/utility.js'
import * as types from '@/modules-constant.js'
// 重写原有方法
mxCell.prototype.getAttribute = function(name, defaultValue) {
  let cellValue = this.getValue()
  return cellValue[name] || defaultValue
}
mxCell.prototype.setAttribute = function(name, value) {
  let cellValue = this.getValue()
  cellValue[name] = value
}
mxCell.prototype.cloneValue = function() {
  return utility.deepClone(this.getValue())
}
mxVertexHandler.prototype.singleSizer = true
// 从value中获取展示名
mxGraph.prototype.convertValueToString = function(cell) {
  return cell.value.general.label
}
mxGraph.prototype.valueForCellChanged = function(cell, newValue) {
  cell.value.general.label = newValue
}
// 拖动辅助
mxGraphHandler.prototype.guidesEnabled = true
// Alt 使拖动辅助失效
mxGuide.prototype.isEnabledForEvent = function(evt) {
  return !mxEvent.isAltDown(evt)
}
// 对于圆形的拖拽进行约束
mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained, centered) {
  if (this.state.cell.value.general.type == types.CIRCLE) {
    let minOffset = Math.min(dx, dy)
    dx = minOffset
    dy = minOffset
  }
  var x = bounds.x + bounds.width + dx
  var y = bounds.y + bounds.height + dy

  if (gridEnabled) {
    x = this.graph.snap(x / scale) * scale
    y = this.graph.snap(y / scale) * scale
  }

  var rect = new mxRectangle(bounds.x, bounds.y, 0, 0)
  rect.add(new mxRectangle(x, y, 0, 0))

  return rect
}
