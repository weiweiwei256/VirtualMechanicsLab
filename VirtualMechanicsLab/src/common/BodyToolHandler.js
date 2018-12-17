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
  // createSelectionShape(bounds) {
  //   console.log(this)
  //   let type = this.state.cell.value.general.type
  //   let shape
  //   if (type == types.CIRCLE) {
  //     let radius = 10
  //     this.bounds.height = radius
  //     this.bounds.width = radius
  //     shape = new mxEllipse(bounds, '@990099', '#000000')
  //   } else {
  //     shape = new mxRectangleShape(bounds, null, '#000000')
  //   }
  //   shape.apply(this.state)
  //   shape.outline = true
  //   shape.strokewidth = this.getSelectionStrokeWidth()
  //   shape.isDashed = this.isSelectionDashed()
  //   shape.isShadow = false
  //   return shape
  // }
}
export default BodyToolHandler
