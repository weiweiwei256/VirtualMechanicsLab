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
      var dy = mxClient.IS_VML && document.compatMode == 'CSS1Compat' ? 20 : 4
      this.domNode.style.left = this.state.x + this.state.width + 'px'
      this.domNode.style.top = this.state.y + this.state.height + dy + 'px'
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
}
export default BodyToolHandler
