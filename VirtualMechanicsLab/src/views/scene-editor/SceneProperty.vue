<template>
  <div id="scene-editor-property">
    <el-input placeholder="请输入名称" v-model="label" @blur="modifyAttribute('label')">
      <template slot="prepend">名称：</template>
    </el-input>
    <el-switch inactive-text="静止物体:" v-model="isStatic" @change="modifyAttribute('isStatic')">
    </el-switch>
    <p>质量</p>
    <el-input-number v-model="mass" @change="modifyAttribute('mass')" :min="0" :step="1" :precision="2" controls-position="right"></el-input-number>
    <p>摩擦力</p>
    <el-input-number v-model="friction" @change="modifyAttribute('friction')" :min="0" :max="1" :step="0.1" :precision="2" controls-position="right"></el-input-number>
    <p>恢复系数</p>
    <el-input-number v-model="restitution" @change="modifyAttribute('restitution')" :min="0" :max="1" :step="0.1" :precision="2" controls-position="right"></el-input-number>
  </div>
</template>

<script>
import Vue from "vue"
import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js'
import defaultProperty from '@/store/default-property.json'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'scene-property',
  data: function () {
    return {
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
      this.label = defaultProperty.label;
      this.isStatic = defaultProperty.isStatic;
      this.mass = defaultProperty.mass;
      this.friction = defaultProperty.friction;
      this.restitution = defaultProperty.restitution;
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
      let oldValue = this.selectionCell.getAttribute(attrName, defaultProperty[attrName]);
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
    }
  },
  mounted () {
    console.log(this)
  },
  components: {
  }
}
</script>

<style>
</style>
