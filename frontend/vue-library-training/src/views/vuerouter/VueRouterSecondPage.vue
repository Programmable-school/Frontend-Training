<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="container">
      <v-flex>
        <h2>VueRouter params指定</h2>
        <div>ページ {{ id }}</div>
      </v-flex>
    </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

// @Component({
//   name: 'VueRouterSecondPage',
//   data: () => ({
//     dateObject: null,
//   }),
//   props: {
//     id: {
//       type: String,
//       default: 'default',
//     },
//     data: {
//       type: Object,
//       default: null,
//     },
//   },
// })
@Component({
  name: 'VueRouterSecondPage',
})
export default class VueRouterSecondPage extends Vue {
  id: string = '0'
  created() {
    /**
     * $route.paramsで渡されたデータを取得。
     */
    this.id = this.$route.params.id
  }
}
</script>
<style lang="stylus">
.top
  margin 10px

.container
  text-align left 
</style>