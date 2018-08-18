<template>
  <div id="scene-editor-property">
    <el-input ref='elinput' value='sadfasdf'></el-input>
  </div>
</template>

<script>
import Vue from "vue"
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Input } from "element-ui"
export default {
  name: 'scene-property',
  data: function () {
    return {
      activePropertyEditors: []
    }
  },
  computed: {
    ...mapGetters(['editorSelectionCell'])
  },
  watch: {
    editorSelectionCell: function (newVal, oldVal) {
      console.log(newVal)
      let containerEle = $("#scene-editor-property")[0];
      let vueClass = Vue.extend(Input);
      let vueObject = new vueClass({
        propsData: { value: newVal.value.label }
      });
      let vueObjectEle = vueObject.$mount();
      containerEle.appendChild(vueObjectEle.$el);
      this.activePropertyEditors.push(vueObject);
    }
  },
  methods: {
    // 清空整个属性区
    cleanPropertyArea: function () {
      this.activePropertyEditors.forEach(object => object.$destroy());
      let containerEle = $("#scene-editor-property")[0];
      // 移除所有子孩子 清空自定义数据
      var childs = containerEle.childNodes;
      while (childs.length != 0) {
        containerEle.removeChild(containerEle.firstChild);
      }
    },
    change: function () {
      var oldValue = cell.getAttribute(attribute.nodeName, '');
      if (newValue != oldValue) {
        graph.getModel().beginUpdate();
        try {
          var edit = new mxCellAttributeChange(
            cell, attribute.nodeName,
            newValue);
          graph.getModel().execute(edit);
          graph.updateCellSize(cell);
        }
        finally {
          graph.getModel().endUpdate();
        }
      }
    }
  },
  mounted () {
    console.log(this.$refs.elinput)
  },
}
</script>

<style>
</style>
