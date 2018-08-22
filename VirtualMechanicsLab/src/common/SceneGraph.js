/**
 * 重写mxGraph方法  以适应SceneEditor需求
 *
 */
import PolygonShape from './PolygonShape.js';
mxCellRenderer.registerShape('polygonShape', PolygonShape);
mxCell.prototype.getAttribute = function(name, defaultValue) {
  var cellValue = this.getValue();
  return cellValue[name] || defaultValue;
};
mxCell.prototype.setAttribute = function(name, value) {
  var cellValue = this.getValue();
  cellValue[name] = value;
};
mxVertexHandler.prototype.rotationEnabled = true;

mxVertexHandler.prototype.init = function() {
  this.graph = this.state.view.graph;
  this.selectionBounds = this.getSelectionBounds(this.state);
  this.bounds = new mxRectangle(
    this.selectionBounds.x,
    this.selectionBounds.y,
    this.selectionBounds.width,
    this.selectionBounds.height
  );
  this.selectionBorder = this.createSelectionShape(this.bounds);
  // VML dialect required here for event transparency in IE
  this.selectionBorder.dialect =
    this.graph.dialect != mxConstants.DIALECT_SVG ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
  this.selectionBorder.pointerEvents = false;
  this.selectionBorder.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
  this.selectionBorder.init(this.graph.getView().getOverlayPane());
  mxEvent.redirectMouseEvents(this.selectionBorder.node, this.graph, this.state);

  if (this.graph.isCellMovable(this.state.cell)) {
    this.selectionBorder.setCursor(mxConstants.CURSOR_MOVABLE_VERTEX);
  }

  // Adds the sizer handles
  if (mxGraphHandler.prototype.maxCells <= 0 || this.graph.getSelectionCount() < mxGraphHandler.prototype.maxCells) {
    var resizable = this.graph.isCellResizable(this.state.cell);
    this.sizers = [];

    if (resizable || (this.graph.isLabelMovable(this.state.cell) && this.state.width >= 2 && this.state.height >= 2)) {
      var i = 0;

      if (resizable) {
        if (!this.singleSizer) {
          this.sizers.push(this.createSizer('nw-resize', i++));
          this.sizers.push(this.createSizer('n-resize', i++));
          this.sizers.push(this.createSizer('ne-resize', i++));
          this.sizers.push(this.createSizer('w-resize', i++));
          this.sizers.push(this.createSizer('e-resize', i++));
          this.sizers.push(this.createSizer('sw-resize', i++));
          this.sizers.push(this.createSizer('s-resize', i++));
        }
        this.sizers.push(this.createSizer('se-resize', i++));
      }

      var geo = this.graph.model.getGeometry(this.state.cell);

      if (
        geo != null &&
        !geo.relative &&
        !this.graph.isSwimlane(this.state.cell) &&
        this.graph.isLabelMovable(this.state.cell)
      ) {
        // Marks this as the label handle for getHandleForEvent
        this.labelShape = this.createSizer(
          mxConstants.CURSOR_LABEL_HANDLE,
          mxEvent.LABEL_HANDLE,
          mxConstants.LABEL_HANDLE_SIZE,
          mxConstants.LABEL_HANDLE_FILLCOLOR
        );
        this.sizers.push(this.labelShape);
      }
    } else if (
      this.graph.isCellMovable(this.state.cell) &&
      !this.graph.isCellResizable(this.state.cell) &&
      this.state.width < 2 &&
      this.state.height < 2
    ) {
      this.labelShape = this.createSizer(
        mxConstants.CURSOR_MOVABLE_VERTEX,
        mxEvent.LABEL_HANDLE,
        null,
        mxConstants.LABEL_HANDLE_FILLCOLOR
      );
      this.sizers.push(this.labelShape);
    }
  }

  // Adds the rotation handler
  if (this.isRotationHandleVisible()) {
    this.rotationShape = this.createSizer(
      this.rotationCursor,
      mxEvent.ROTATION_HANDLE,
      mxConstants.HANDLE_SIZE + 3,
      mxConstants.HANDLE_FILLCOLOR
    );
    this.sizers.push(this.rotationShape);
  }

  this.customHandles = this.createCustomHandles();
  this.redraw();

  if (this.constrainGroupByChildren) {
    this.updateMinBounds();
  }
};
