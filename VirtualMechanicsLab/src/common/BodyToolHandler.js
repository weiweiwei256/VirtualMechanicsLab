import * as types from '@/modules-constant.js'
class BodyToolHandler extends mxVertexHandler {
  init() {
    super.init()
    this.domNode = document.createElement('div')
    this.domNode.style.position = 'absolute'
    this.domNode.style.whiteSpace = 'nowrap'
    var deleteIcon = document.createElement('i')
    deleteIcon.setAttribute('class', 'iconfont icon-delete')
    mxEvent.addListener(
      deleteIcon,
      'click',
      mxUtils.bind(this, function(evt) {
        this.graph.removeCells([this.state.cell])
        mxEvent.consume(evt)
      })
    )
    this.domNode.appendChild(deleteIcon)

    this.graph.container.appendChild(this.domNode)
    this.redrawTools()
  }
  redrawTools() {
    if (this.state != null && this.domNode != null) {
      this.domNode.style.left = this.state.x + 'px'
      this.domNode.style.top = this.state.y + this.state.height + 'px'
    }
  }
  redraw() {
    super.redraw()
    this.redrawTools()
  }
  destroy(sender, me) {
    super.destroy()
    if (this.domNode != null) {
      this.domNode.parentNode.removeChild(this.domNode)
      this.domNode = null
    }
  }
  createSelectionShape(bounds) {
    let type = this.state.cell.value.general.type
    let shape
    if (type == types.CIRCLE) {
      shape = new mxEllipse(bounds, null, this.getSelectionColor())
    } else {
      shape = new mxRectangleShape(bounds, null, this.getSelectionColor())
    }
    shape.strokewidth = this.getSelectionStrokeWidth()
    shape.isDashed = this.isSelectionDashed()

    return shape
  }
}
export default BodyToolHandler
