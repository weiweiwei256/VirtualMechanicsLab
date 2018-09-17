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
      </el-menu>hover
    </div> -->
    <header id='vml-header' @mouseenter='showSceneBar' @mouseleave='hideSceneBar'>
      <el-popover placement="bottom" width="200" trigger="click" @show='loadScene'>
        <el-card class="box-card">
          <div slot="header" shadow="hover">
            <span>示例场景</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" shadow="hover">
            <span>你的场景</span>
          </div>
          <div v-for="scene in userScenes" :key="scene.sceneName" class="text item">
            <span style='width:100%' :title="scene.sceneData.description" @ @click='selectScene(scene)'>{{scene.sceneName}}</span>
            <i style='font-size: 15px;float:right' title='删除场景' class="iconfont icon-delete" @click='handleDeleteScene(scene.sceneName)'></i>
          </div>
        </el-card>
        <i slot="reference" :style="{display:sceneBarDisplay}" class="el-icon-circle-plus-outline"></i>
      </el-popover>
      <input id='scene-name-input' ref='sceneNameInput' type="text" :value='shortName' @focus="focusSceneName" @keyup.enter="saveSceneName" @blur="saveSceneName"></input>
      <el-popover placement="bottom" width="300" trigger="hover" ::open-delay='500'>
        <el-input type="textarea" :rows="5" placeholder="场景描述" v-model="sceneData.description" @blur='saveSceneDescription'>
        </el-input>
        <i slot="reference" :style="{display:sceneBarDisplay}" class="el-icon-edit"></i>
      </el-popover>
    </header>
    <circle-menu class='circle-menu-style' type="bottom" :number="4" animate="animated jello" circle>
      <a slot="item_btn" class="question el-icon-question" title="帮助"></a>
      <a slot="item_1" class='question-font' @click="handleAbout">关于</a>
      <a slot="item_2" class='question-font'>问答</a>
      <a slot="item_3" class='question-font'>建议</a>
      <a slot="item_4" class='question-font'>支持</a>
    </circle-menu>
    <div id='main-workbench'>
      <el-row style="height:100%">
        <el-col style="height:100%" :span="12">
          <SceneEditor></SceneEditor>
        </el-col>
        <el-col style="height:100%" :span="12">
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
import sceneManager from '@/common/scene-manager.js'
import SceneRunning from './SceneRunning.vue'
import CircleMenu from 'vue-circle-menu'
export default {
  name: 'vml-workbench',
  data: function () {
    return {
      storage: window.localStorage,
      sceneBarDisplay: 'none',
      defaultScenes: [],
      userScenes: [],
    }
  },
  computed: {
    ...mapGetters([
      'sceneName',
      'sceneData'
    ]),
    shortName: function () {
      return this.sceneName.substring(0, this.sceneName.indexOf('.scene'))
    },
  },
  watch: {
    storageFileNames: function () { }
  },
  methods: {
    ...mapMutations({
      setScene: types.SET_SCENE
    }),
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR,
      initSceneRunning: types.INIT_SCENE_RUNNING,
      saveScene: types.SAVE_SCENE,
      deleteScene: types.DELETE_SCENE
    }),
    loadScene: function () {
      this.defaultScenes = sceneManager.getDefaultScenes();
      this.userScenes = sceneManager.getUserScenes();
    },
    selectScene: function (scene) {
      console.log('select', scene.sceneData)
      this.setScene({ sceneName: scene.sceneName, sceneData: scene.sceneData })
    },
    handleDeleteScene: function (sceneName) {
      let deleteIndex = this.userScenes.findIndex(scene => scene.sceneName == sceneName)
      this.userScenes.splice(this.userScenes, 1)
      this.deleteScene(sceneName)
    },
    saveSceneName: function () {
      let newSceneName = this.$refs.sceneNameInput.value
      if (newSceneName == this.shortName) {
        return;
      }
      this.saveScene({ sceneName: newSceneName + '.scene', sceneData: this.sceneData })
    },
    saveSceneDescription: function () {
      this.saveScene({ sceneName: this.sceneName, sceneData: this.sceneData })
    },
    focusSceneName: function () {
      this.$notify({
        title: '提示',
        message: '命名场景即可保存；点击关闭不在提示',
        offset: 15,
        onClose: function () {
          console.log('不在提示')
          return true;
        }
      });
    },
    showSceneBar: function () {
      this.sceneBarDisplay = 'inline-block';
    },
    hideSceneBar: function () {
      this.saveSceneName();
      this.sceneBarDisplay = 'none'
    },
    handleSelect (key) {
      switch (key) {
        case 'createScene':
          this.setScene({ sceneName: key, sceneData: this.storage.getItem(key) })
          break;
        case 'showScene':
          console.log(JSON.stringify(this.sceneData, null, 2))
          break;
        case 'importScene':
          // do nothing.  handle by input event
          break;
        case 'saveScene':

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
        self.setScene({ sceneName: file.name, sceneData: JSON.parse(this.result) })
      }
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
  text-align: center;
}
.el-card {
  padding: 5px !important;
}
.el-card > .el-card__header {
  padding: 5px 5px;
  border-bottom: inherit;
}
.el-card > .el-card__body {
  padding: 5px 5px 5px 5px;
}
.el-card__body > .item {
  padding: 2px;
}
.el-card {
  padding: 5px 30px;
}
#scene-name-input {
  width: 150px;
  height: 30px;
  background-color: transparent;
  border-width: 0px;
  margin: 0 auto;
  text-align: center;
}
#scene-name-input:focus {
  outline: none;
  background-color: transparent;
}
#scene-name-input:selection {
  background: transparent;
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
  top: 30px;
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
