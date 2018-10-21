<template>
  <div class="inputForm">
    <p>
      <input type="text" placeholder="名前" v-model="value.name"/>
    </p>
    <p>
      <input type="radio" value="男性" v-model="value.sex" checked/>男性
      <input type="radio" value="女性" v-model="value.sex"/>女性
    </p>
    <p>
      <textarea rows="5" cols="30" placeholder="自己紹介" v-model="value.profile"/>
    </p>
    <button @click="onInit">値を初期化</button>
    <button @click="onClick">表示</button>
    <div v-if="isShow">
      <p>{{ value.name }}</p>
      <p>{{ value.sex }}</p>
      <p>{{ value.profile }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InputForm',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  watch: {
    info: {
      handler(val) {
        this.isShow = false
      },
      deep: true
    }
  },
  methods: {
    onInit() {
      const value = {
        name: "",
        sex: "",
        profile: ""
      }
      this.$emit("input", value)
    },
    onClick() {
      this.isShow = true
      
    }
  }
}
</script>
<style scoped>
.inputForm {
  margin: 10px;
  background: wheat;
}
</style>
