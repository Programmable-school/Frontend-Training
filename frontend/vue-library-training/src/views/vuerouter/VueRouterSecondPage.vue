<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="container">
      <v-flex>
        <h2>VueRouter ページ 2</h2>
        <div>{{ date }}</div>
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
  date?: Date = undefined
  created() {
    const data = (this.$route.params.data as any) as Date
    console.log(data, data.getUTCFullYear(), data.getTime())
    this.date = data
  }
}
</script>
<style lang="stylus">
.top
  margin 10px

.container
  text-align left 
</style>