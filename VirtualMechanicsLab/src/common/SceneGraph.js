// 重写原有方法
mxCell.prototype.getAttribute = function(name, defaultValue) {
  let cellValue = this.getValue()
  return cellValue[name] || defaultValue
}
mxCell.prototype.setAttribute = function(name, value) {
  let cellValue = this.getValue()
  cellValue[name] = value
}
mxVertexHandler.prototype.singleSizer = true
// 从value中获取展示名
mxGraph.prototype.convertValueToString = function(cell) {
  return cell.value.general.label
}
mxGraph.prototype.valueForCellChanged = function(cell, newValue) {
  cell.value.general.label = newValue
}
