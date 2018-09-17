import defaultScene from './scenes/default.scene';
let storage = window.localStorage;
let sceneManager = {
  getScene: function(sceneName) {
    if (!storage.getItem(sceneName)) {
      console.error(sceneName + ' 未存在， 将默认场景作为其内容');
      storage.setItem(sceneName, JSON.stringify(defaultScene));
    }
    return JSON.parse(storage.getItem(sceneName));
  },
  getUserScenes: function() {
    let userScenes = [];
    for (let i = 0; i < storage.length; i++) {
      let key = storage.key(i);
      if (key.includes('.scene')) {
        let scene = JSON.parse(storage.getItem(key));
        userScenes.push({ sceneName: key, sceneData: scene });
      }
    }
    return userScenes;
  },
  getDefaultScenes: function() {
    let defaultScenes = [];
    defaultScenes.push({ sceneName: '未命名.scene', description: defaultScene.description });
  }
};
export default sceneManager;
