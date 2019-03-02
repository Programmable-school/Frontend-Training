<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="container">
      <v-flex>
        <h2>Firestoreトレーニング</h2>
        <v-flex style="margin: 24px;">
          <router-link to="./create_form_page">
            <div><b>メモフォームを作成</b></div>
            <div class="subtitle">データの追加、読み込み</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="./roster_list_page">
            <div><b>名簿リストを作成</b></div>
            <div class="subtitle">データ追加、読み込み、更新、削除、リアルタイム取得、検索クエリ</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="./user_health_list_page">
            <div><b>ユーザーヘルスリストを作成</b></div>
            <div class="subtitle">バッチ処理による一括処理</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="shop_item_buy_page">
            <div><b>商品登録と購入フォームを作成</b></div>
            <div class="subtitle">トランザクション</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="">
            <div><b>便利！Firestoreモデルクラスを作る</b></div>
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