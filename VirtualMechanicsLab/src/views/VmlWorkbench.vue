<template>
  <div class="vml-workbench"
       style="height:100%:width:100%">
    <div id='menu'>
      <el-menu mode="horizontal"
               @select="handleSelect"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <el-submenu index="scene">
          <template slot="title">场景</template>
          <el-menu-item index="createScene">新建</el-menu-item>
          <el-menu-item index="showScene">查看</el-menu-item>
          <el-submenu index="2">
            <template slot="title">打开</template>
            <el-menu-item :index="item"
                          v-for="(item, index) in storageFileNames"
                          :key='index'>{{item}}</el-menu-item>
            <el-menu-item index="importScene">
              <span class="fileinput-button">
                <span>导入</span>
                <input type="file"
                       id="import-scene-input"
                       @change="importScene" />
              </span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="saveScene">保存</el-menu-item>
        </el-submenu>
        <el-submenu index="edit">
          <template slot="title">编辑</template>
          <el-menu-item index="2-1">仅编辑</el-menu-item>
          <el-menu-item index="2-2">编辑&运行</el-menu-item>
          <el-menu-item index="2-3">运行</el-menu-item>
        </el-submenu>
        <el-menu-item index="about">
          <a href="#"
             target="_blank">关于</a>
        </el-menu-item>
      </el-menu>
    </div>
    <div id='workbench-toolbar'>
      <el-button type="primary"
                 title="编辑"
                 @click='sceneEdit'
                 icon="el-icon-setting"></el-button>
      <el-button type="primary"
                 title='编辑&运行'
                 @click='sceneHalf'
                 icon="el-icon-menu"></el-button>
      <el-button type="primary"
                 title='运行'
                 @click='sceneRunning'
                 icon="el-icon-d-arrow-right"></el-button>
    </div>
    <div id='main-workbench'>
      <el-row style="height:100%">
        <el-col style="height:100%"
                :span="sceneEditorSpan">
          <SceneEditor></SceneEditor>
        </el-col>
        <el-col style="height:100%"
                :span="sceneRunningSpan">
          <SceneRunning></SceneRunning>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import SceneEditor from './scene-editor/SceneEditor.vue'
import SceneRunning from './SceneRunning.vue'
export default {
  name: 'vml-workbench',
  data: function () {
    return {
      storage: window.localStorage,
      sceneEditorSpan: 12,
      sceneRunningSpan: 12,
    }
  },
  computed: {
    ...mapGetters([
      'fileName',
      'sceneData'
    ]),
    storageFileNames: function () {
      let storageFileNames = [];
      for (let i = 0; i < this.storage.length; i++) {
        storageFileNames.push(this.storage.key(i))
      }
      return storageFileNames;
    }
  },
  watch: {
    storageFileNames: function () { }
  },
  methods: {
    ...mapMutations({
      saveScene: types.SAVE_SCENE
    }),
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR,
      initSceneRunning: types.INIT_SCENE_RUNNING
    }),
    handleSelect (key) {
      switch (key) {
        case 'createScene':
          this.saveScene({ fileName: key, sceneData: this.storage.getItem(key) })
          break;
        case 'showScene':
          console.log(JSON.stringify(this.sceneData))
          break;
        case 'importScene':
          // do nothing.  handle by input event
          break;
        case 'saveScene':
          this.storage.setItem(this.fileName, JSON.stringify(this.sceneData, null, 2));
          break;
        default:
          console.error('unknown menu key:' + key)
      }
    },
    importScene: function () {
      let file = $("#import-scene-input")[0].files[0];
      let reader = new FileReader();
      //将文件以文本形式读入页面
      reader.readAsText(file);
      let self = this;
      reader.onload = function () {
        console.log(file.name)
        console.log(this.result)
        self.saveScene({ fileName: file.name, sceneData: JSON.parse(this.result) })
      }
    },

    sceneEdit: function () {
      this.sceneEditorSpan = 24;
      this.sceneRunningSpan = 0;
    },
    sceneHalf: function () {
      this.sceneEditorSpan = 12;
      this.sceneRunningSpan = 12;
    },
    sceneRunning: function () {
      this.sceneEditorSpan = 0;
      this.sceneRunningSpan = 24
    }
  },
  beforeMount: function () {
    this.initSceneEditor();
    this.initSceneRunning();
  },
  components: {
    SceneEditor,
    SceneRunning
  }
}
</script>
<style>
#main-workbench {
  position: absolute;
  top: 60px;
  bottom: 0px;
  width: 100%;
}
#workbench-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
}
.fileinput-button {
  position: relative;
  display: inline-block;
}

.fileinput-button input {
  position: absolute;
  right: 0px;
  top: 0px;
}
</style>
