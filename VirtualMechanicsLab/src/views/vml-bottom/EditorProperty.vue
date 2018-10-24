<template>
  <div id="scene-editor-property">
    <el-tabs v-model="activeTabName" style='margin-left: 6px;margin-top: 3px' @tab-click="handleClick">
      <el-tab-pane label="通用属性" name="generalProperty">
        <el-form label-width="100px" label-position="right">
          <el-form-item label="物体名称：">
            <el-input placeholder="请输入名称" v-model="label" @blur="modifyAttribute('label')"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="物理属性" name="physicalProperty">
        <el-form label-width="100px" label-position="right">
          <el-form-item label="是否静止">
            <el-switch v-model="isStatic" @change="modifyAttribute('isStatic')">
            </el-switch>
          </el-form-item>
          <el-form-item label="质量:">
            <el-input-number v-model="mass" style='width:100%' @change="modifyAttribute('mass')" :min="0" :step="1" :precision="2" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="摩擦力:">
            <el-input-number v-model="friction" style='width:100%' @change="modifyAttribute('friction')" :min="0" :max="1" :step="0.1" :precision="2" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="恢复系数:">
            <el-input-number v-model="restitution" style='width:100%' @change="modifyAttribute('restitution')" :min="0" :max="1" :step="0.1" :precision="2" controls-position="right"></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="初始条件" name="initialCondition">初始条件</el-tab-pane>
      <el-tab-pane label="样式属性" name="styleProperty">样式属性</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js'
import defaultProperty from '@/common/default/default-property.json'
import { mapGetters, mapMutations, mapActions } from 'vuex'
let options = defaultProperty.options;
export default {
  name: 'scene-property',
  data: function () {
    return {
      activeTabName: 'generalProperty',
      label: "Body",
      isStatic: false,
      mass: 1,
      friction: 0.1,
      restitution: 0,
    }
  },
  computed: {
    ...mapGetters({ selectionCell: 'editorSelectionCell', graph: 'editorGraph' })
  },
  watch: {
    selectionCell: function (newCell, oldCell) {
      // reset
      this.label = options.label;
      this.isStatic = options.isStatic;
      this.mass = options.mass;
      this.friction = options.friction;
      this.restitution = options.restitution;
      if (newCell) {
        let value = newCell.value;
        this.label = value.label || this.label
        this.isStatic = value.isStatic || this.isStatic
        this.mass = value.mass || this.mass
        this.friction = value.friction || this.friction
        this.restitution = value.restitution || this.restitution
      }
    }
  },
  methods: {
    modifyAttribute: function (attrName) {
      let oldValue = this.selectionCell.getAttribute(attrName, options[attrName]);
      let newValue = this[attrName]
      if (newValue != oldValue) {
        this.graph.getModel().beginUpdate();
        try {
          let edit = new mxCellAttributeChange(
            this.selectionCell, attrName,
            newValue);
          this.graph.getModel().execute(edit);
        }
        finally {
          this.graph.getModel().endUpdate();
        }
      }
    },
    handleClick (tab, event) {
      console.log(tab, event);
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style scoped>
#scene-editor-property /deep/ .el-form-item {
  margin-bottom: 5px;
}
</style>
