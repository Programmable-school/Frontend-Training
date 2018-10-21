<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div v-once>私の名前は{{ name }}です。</div>
    <div v-html="htmlData"/>
    <button v-bind:disabled="isEnable">ボタン</button>
    <div v-if="isShow">見えていますか</div>
    <span v-for="(item, index) in items" :key="index">{{ item }}</span>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data() {
    return {
      name: "shohei",
      htmlData: "<p>私の名前はshoheiです</p>",
      isEnable: false,
      isShow: true,
      items: ["こ", "ん", "に", "ち", "わ"]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
