<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="container">
        <v-flex>
          <h2>必須ライブラリトレーニング</h2>
          <v-flex style="margin: 24px;">
            <router-link to="vue_router_top_page">
              <div><b>ページ遷移（VueRouter）</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="vue_store_top_page">
              <div><b>状態管理（VueStore）</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="vuetify_top_page">
              <div><b>ナビゲーショントップページ作成（Vuetify）</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="local_forage_roster_list_page">
              <div><b>ローカルストレージに保存（localforage）</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="axios_lesson">
              <div><b>Qiitaリスト表示ページ作成（axios）</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="dotenv_lesson">
              <div><b>環境変数を設定（dotenv）</b></div>
            </router-link>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class TopPage extends Vue {}
</script>
<style lang="stylus">

.top
  margin 10px

.container
  text-align left 

.subtitle
  padding-left 12px

</style>