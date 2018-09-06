<template>
  <div class="vml-workbench" style="height:100%:width:100%">
    <!-- <div id='menu'>
      <el-menu mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="scene">
          <template slot="title">场景</template>
          <el-menu-item index="createScene">新建</el-menu-item>
          <el-menu-item index="showScene">查看</el-menu-item>
          <el-submenu index="2">
            <template slot="title">打开</template>
            <el-menu-item :index="item" v-for="(item, index) in storageFileNames" :key='index'>{{item}}</el-menu-item>
            <el-menu-item index="importScene">
              <span class="fileinput-button">
                <span>导入</span>
                <input type="file" id="import-scene-input" @change="importScene" />
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
          <a href="#" target="_blank">关于</a>
        </el-menu-item>
      </el-menu>
    </div> -->
    <header id='vml-header'>

    </header>
    <circle-menu class='circle-menu-style' type="bottom" :number="4" animate="animated jello" circle>
      <a slot="item_btn" class="question el-icon-question" title="帮助"></a>
      <a slot="item_1" class='question-font' @click="handleAbout">关于</a>
      <a slot="item_2" class='question-font'>问答</a>
      <a slot="item_3" class='question-font'>建议</a>
      <a slot="item_4" class='question-font'>支持</a>
    </circle-menu>
    <!-- <div id='workbench-toolbar'>
      <el-button type="primary" size="mini" circle title="编辑" @click='sceneEdit' icon="el-icon-setting"></el-button>
      <el-button type="primary" size="mini" circle title='编辑&运行' @click='sceneHalf' icon="el-icon-menu"></el-button>
      <el-button type="primary" size="mini" circle title='运行' @click='sceneRunning' icon="el-icon-d-arrow-right"></el-button>
    </div> -->
    <div id='main-workbench'>
      <el-row style="height:100%">
        <el-col style="height:100%" :span="sceneEditorSpan">
          <SceneEditor></SceneEditor>
        </el-col>
        <el-col style="height:100%" :span="sceneRunningSpan">
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
import CircleMenu from 'vue-circle-menu'
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
      updateSceneRunning: types.UPDATE_SCENE_RUNNING
    }),
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR,
      initSceneRunning: types.INIT_SCENE_RUNNING
    }),
    handleSelect (key) {
      switch (key) {
        case 'createScene':
          this.updateSceneRunning({ fileName: key, sceneData: this.storage.getItem(key) })
          break;
        case 'showScene':
          console.log(JSON.stringify(this.sceneData, null, 2))
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
        self.updateSceneRunning({ fileName: file.name, sceneData: JSON.parse(this.result) })
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
    },
    handleAbout: function () {
      this.$confirm('这是一个模拟物理场景的实验室！', '关于', {
        center: true,
        showConfirmButton: false,
        showCancelButton: false,
        showClose: true,
        type: 'info '
      })
    }
  },
  beforeMount: function () {
    this.initSceneEditor();
    this.initSceneRunning();
  },
  components: {
    SceneEditor,
    SceneRunning,
    CircleMenu
  }
}
</script>
<style>
#vml-header {
  background-color: #3399cc;
  height: 30px;
}
.circle-menu-style {
  position: absolute;
  top: 3px;
  right: 10px;
}
.question {
  font-size: 28px;
  margin-left: -8px;
  margin-top: -3px;
}
.circle-menu-style /deep/ .oy-menu-btn {
  line-height: 0px;
  width: 24px;
  height: 24px;
  background: #2b59c5;
}

.circle-menu-style /deep/ .bottom .oy-menu-group .btn-list .oy-menu-item {
  left: auto;
  line-height: inherit;
  width: 40px;
  height: 40px;
}
.circle-menu-style /deep/ .bottom .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_1 {
  top: 35px;
}
.circle-menu-style /deep/ .bottom .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_2 {
  top: 90px;
}
.circle-menu-style /deep/ .bottom .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_3 {
  top: 145px;
}
.circle-menu-style /deep/ .bottom .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_4 {
  top: 200px;
}
.question-font {
  line-height: 40px;
  color: #020e1a;
}
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
