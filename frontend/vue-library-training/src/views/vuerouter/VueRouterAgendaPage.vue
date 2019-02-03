<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="container">
      <v-flex>
        <h2>VueRouterトレーニング</h2>
        <v-flex style="margin: 24px;">
          <router-link to="vue_router_top_page/vue_router_first_page">
            <div><b>ページ遷移</b></div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <div class="router-link"
            @click="onClickSecond">
            <b>ページ遷移 params指定</b>
          </div>
        </v-flex>
      </v-flex>
    </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class VueRouterAgendaPage extends Vue {
  onClickSecond() {
    const object: any = new Date()
    this.$router.push({ name: 'vue_router_second_page', params: { data: object } })
  }
}
</script>
<style lang="stylus">

.top
  margin 10px

.container
  text-align left 

.subtitle
  padding-left 12px

.router-link
  color blue
  text-decoration underline
</style>