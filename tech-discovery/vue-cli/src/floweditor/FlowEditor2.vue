<template>
  <div id="floweditor2">
    <p>this is a flow editor demo2</p>
    <div id="toolbar2"></div>
    <div id="graphContainer2"></div>
    <div id="property2"></div>
  </div>
</template>

<script>
import mxData from './mxData.js'
export default {
  name: 'flowEditor2',
  data: function() {
    return {
      graph: null,
      vertices: [], //图源数组
      edges: [] //线数组
    }
  },
  methods: {},
  mounted() {
    let container = document.getElementById('graphContainer2')
    var graph = new mxGraph(container)
    let doc = mxUtils.parseXml(mxData)
    let codec = new mxCodec(doc)
    codec.decode(doc.documentElement, graph.getModel())
    console.log('rootCell',graph.getModel().root)
  }
}
</script>

<style scoped>
#graphContainer2 {
  position: relative;
  overflow: hidden;
  width: 800px;
  height: 400px;
  cursor: default;
  background: url('/static/src/images/grid.gif');
}
</style>
