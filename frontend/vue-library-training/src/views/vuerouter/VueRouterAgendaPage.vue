<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="container">
      <v-flex>
        <h2>VueRouterトレーニング</h2>
        <v-flex style="margin: 24px;">
          <h3>ページ遷移</h3>
          <v-flex style="margin: 8px;">
            <!-- router-linkでページ遷移 -->
            <router-link to="vue_router_top_page/vue_router_first_page">
              <div>ページ</div>
            </router-link>
          </v-flex>
        </v-flex>
        <v-flex style="margin: 24px;">
          <h3>ページ遷移 params指定</h3>
          <v-flex style="margin: 8px;">
            <div class="router-link"
              @click="onClickSecond(1)">
              ページ 1
            </div>
            <div class="router-link"
              @click="onClickSecond(2)">
              ページ 2
            </div>
          </v-flex>
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
  onClickSecond(pageId: string) {
    this.$router.push({ name: 'vue_router_second_page', params: { id: pageId } })
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