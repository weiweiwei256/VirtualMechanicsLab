<template>
  <div id="scene-editor-property">
    <el-tabs v-model="activeTabName" style='margin-left: 6px;margin-top: 3px'>
      <el-tab-pane label="通用属性" name="generalProperty">
        <el-form label-width="80px" label-position="right">
          <el-form-item label="物体名称：">
            <el-input v-model="label" placeholder="请输入名称" @blur="modifyAttribute('label')"></el-input>
          </el-form-item>
          <el-form-item label="物体描述：">
            <el-input v-model="description" placeholder="请输入描述" type="textarea" :rows="3" @blur="modifyAttribute('description')"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="物理属性" name="physicalProperty">
        <el-form label-width="80px" label-position="right">
          <el-form-item label="是否静止：">
            <el-switch v-model="isStatic" @change="modifyAttribute('isStatic')">
            </el-switch>
          </el-form-item>
          <el-form-item label="质量：">
            <el-input-number v-model="mass" style='width:100%' @change="modifyAttribute('mass')" :min="0" :step="1" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="摩擦力：">
            <el-slider v-model="friction" :max='1' :step='0.1' show-input @change="modifyAttribute('friction')"></el-slider>
          </el-form-item>
          <el-form-item label="恢复系数：">
            <el-slider v-model="friction" :max='1' :step='0.1' show-input @change="modifyAttribute('restitution')"></el-slider>
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
      description: '物体描述',
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
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style>
#scene-editor-property /deep/ .el-form-item {
  margin-bottom: 5px;
}
#scene-editor-property /deep/ .el-form-item__label {
  padding-right: 0px;
  height: 100%;
}
#scene-editor-property /deep/ .el-form-item__content {
  margin-right: 10px;
  height: 100%;
}
</style>
