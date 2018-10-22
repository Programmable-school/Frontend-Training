<template>
  <div>
    <input type="text" v-model="memo"/>
    <button @click="onCreate" style="margin: 0 10px;">追加</button>
    <button @click="onDelete()">削除</button>
    <div class="memo">
      <div class="memo__inner">
        <h4 style="margin: -2px;">TODO</h4>
        <div v-for="(item, index) in items" :key="index">
          <input type="checkbox" v-model="item.isCheck" />
          {{ item.memo }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ToDoForm',
  data() {
    return {
      memo: "",
      items: []
    }
  },
  methods: {
    onCreate() {
      const item = {
        memo: this.memo,
        isCheck: false
      }
      this.items.push(item)
      this.memo = ""
    },
    onDelete() {
      this.items = this.items.filter(element => {
        return element.isCheck !== true
      })
    }
  }
}
</script>
<style scoped>
.memo {
  width: 320px;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #aaa;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
}

.memo__inner {
  margin: 0 10px;
  width: 300px;
  display: inline-block;
  text-align: left;
}
</style>
