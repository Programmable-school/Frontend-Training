<template>
  <div id="app">
    <input-form v-model="info"/>
    <div>
      呼び元の値
      <p>{{ info.name }}</p>
      <p>{{ info.sex }}</p>
      <p>{{ info.profile }}</p>
    </div>
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
    <div>変数は {{ name }}</div>
    <div>
      配列の中身は「
      <span v-for="(item, index) in items" :key="index">{{ item }}</span>
      」
    </div>
    <div>
      JSON配列の中身はこちら
      <div v-for="(item) in infos" :key="item.id">
        {{ item.name }}は{{ item.hobby }}が趣味
      </div>
    </div>
    <div>
      <button @click="onLink">Googleへゴー！</button>
    </div>
    <div>
      <input type="text" v-model="name"/>
      <div>あたなの名前は {{ name }}</div>
      <div>文字数: {{ nameCount }}</div>
    </div>
    <div v-if="dateJudgement">
      まだ2018年ですね！
    </div>
    <div v-bind:class="fontColor">
      エラーだったら赤色になるよ
    </div>
    <div>
      {{ nowDate | year }}
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import InputForm from './components/InputForm.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    InputForm
  },
  data() {
    return {
      name: "エンジニア",
      nameCount: 0,
      htmlData: `<b><font color="red">私の名前はエンジニアです</font></b>`,
      isDisabled: false,
      isShow: true,
      btnTag: 0,
      items: ["こ", "ん", "に", "ち", "わ"],
      n: 0,
      infos: [
        { id: "0", name: "エンジニア", hobby: "ランニング" },
        { id: "1", name: "プログラマー", hobby: "ウォーキング" },
        { id: "2", name: "デザイナー", hobby: "水泳" }
      ],
      error: null,
      nowDate: new Date(),
      info: {
        name: "エンジニア",
        sex: "男性",
        profile: "プログラムを書くのが好きです。"
      },
      watchItem: ""
    }
  },
  filters: {
    year(val) {
      return val.getFullYear()
    }
  },
  computed: {
    dateJudgement() {
      const date = new Date()
      return date.getFullYear() === 2018 ? true : false
    },
    fontColor() {
      return this.error === null ? "fontColor__blue" : "fontColor__red"
    } 
  },
  created() {
  },
  mounted() {
    this.nameCount = this.name.length
  },
  destroyed() {
  },
  watch: {
    name(newVal, oldVal) {
      this.nameCount = newVal.length
    },
    'info.name': {
      handler(val) {
        this.watchItem  = val
      }
    }
    /*
    info: {
      handler(val) {
        this.watchItem = `${val.id}, ${val.name}, ${val.hobby}`
      },
      deep: true
    }
    */
  },
  methods: {
    onClick(tag) {
      this.btnTag = tag
    },
    onLink() {
      location.href = "https://www.google.com/"
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

.fontColor__blue {
  color: blue
}
.fontColor__red {
  color: red
}
</style>
