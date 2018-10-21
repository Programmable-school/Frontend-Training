<template>
  <div id="app">
    <!--
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
    <div v-once>私の名前は{{ name }}です。</div>
    <div v-html="htmlData"/>
    <button v-bind:disabled="isDisabled">ボタン1</button>
    <button :disabled="isDisabled">ボタン2</button>
    <div v-if="isShow">見えていますか</div>
    <span v-for="(item, index) in items" :key="index">{{ item }}</span>
    <div>
      <button v-on:click="onClick(1)">ボタン1</button>
      <button @click="onClick(2)">ボタン2</button>
    </div>
    <div>
      ボタンタグ = {{ btnTag }}
    </div>
    <div>
      <div @click="onClick(100)">
        <button @click.stop="onClick(3)">ボタン3</button>
      </div>
    </div>
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
      isDisabled: false,
      isShow: true,
      btnTag: 0,
      items: ["こ", "ん", "に", "ち", "わ"],
      n: 0
    }
  },
  methods: {
    onClick(tag) {
      this.btnTag = tag
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
