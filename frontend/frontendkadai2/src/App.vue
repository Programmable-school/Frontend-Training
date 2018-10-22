<template>
  <div id="app">
    <to-do-form />
  </div>
</template>

<script>
import ToDoForm from './components/ToDoForm.vue'
export default {
  name: 'app',
  components: {
    ToDoForm
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
