class Triangle extends mxShape {
  paintBackground(c, x, y, width, height) {
    let direction = this.state.cell.direction;
    let vertices;
    switch (direction) {
      case 1:
        vertices = [{ x: 0, y: 0 }, { x: 0, y: height }, { x: width, y: height }];
        break;
      case 2:
        vertices = [{ x: width, y: 0 }, { x: 0, y: height }, { x: width, y: height }];
        break;
      case 3:
        vertices = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }];
        break;
      case 4:
        vertices = [{ x: 0, y: 0 }, { x: 0, y: height }, { x: width, y: 0 }];
        break;
    }
    c.translate(x, y);
    c.begin();
    c.moveTo(vertices[0].x, vertices[0].y);
    c.lineTo(vertices[1].x, vertices[1].y);
    c.lineTo(vertices[2].x, vertices[2].y);
    c.lineTo(vertices[0].x, vertices[0].y);
    c.fillAndStroke();
    c.end();

    c.stroke();
  }
}
mxCellRenderer.registerShape('triangle', Triangle);
export default Triangle;
