class PolygonShape extends mxShape {
  paintBackground(c, x, y, w, h) {
    console.log(this.state.cell.value.vertices);
    console.log(c);
    let vertices = this.state.cell.value.vertices;
    c.translate(x, y);
    c.begin();
    c.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      let vertice = vertices[i];
      c.lineTo(vertice.x, vertice.y);
    }
    c.fillAndStroke();
    c.end();

    c.stroke();
  }
}
export default PolygonShape;
