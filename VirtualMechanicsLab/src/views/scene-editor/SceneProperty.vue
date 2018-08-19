<template>
  <div id="scene-editor-property">
    <el-input ref='elinput' value='sadfasdf'></el-input>
  </div>
</template>

<script>
import Vue from "vue"
import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PropertyStringEditor from './property-editor/PropertyStringEditor.vue'
export default {
  name: 'scene-property',
  data: function () {
    return {
      propertyNameToEditorMap: new Map([
        [types.BODY_PROPERTY_LABEL, PropertyStringEditor],
      ]),
      activePropertyEditors: [],
      demoCell: new window.mxCell()
    }
  },
  computed: {
    ...mapGetters(['editorSelectionCell'])
  },
  watch: {
    editorSelectionCell: function (newCell, oldCell) {
      let bodyType = newCell.type;
      for (let i in newCell.value) {
        let containerEle = $("#scene-editor-property")[0];
        let vueClass = Vue.extend(this.propertyNameToEditorMap.get(i));
        let vueObject = new vueClass({
          propsData: { value: newCell.value[i] }
        });
        let vueObjectEle = vueObject.$mount();
        containerEle.appendChild(vueObjectEle.$el);
        this.activePropertyEditors.push(vueObject);
      }
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
  components: {
    PropertyStringEditor
  }
}
</script>

<style>
</style>
