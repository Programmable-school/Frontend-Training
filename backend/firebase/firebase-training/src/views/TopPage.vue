<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="container">
      <v-flex>
        <h2>Firestoreトレーニング</h2>
        <v-flex style="margin: 24px;">
          <router-link to="./create_form_page">
            <div><b>メモフォームを作成</b></div>
            <div class="subtitle">データの追加と読み込み</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="">
            <div><b>名簿リストを作成</b></div>
            <div class="subtitle">データ追加、読み込み、更新、削除、リアルタイム取得</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="">
            <div><b>名簿リストから指定したデータを取得してみよう！</b></div>
            <div class="subtitle">検索クエリ</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="">
            <div><b>名簿リストを充実させる（身長と体重と1日の目標を追記する）</b></div>
            <div class="subtitle">バッジ処理による一括書き込み</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="">
            <div><b>商品登録と購入ページを作成</b></div>
            <div class="subtitle">トランザクション</div>
          </router-link>
        </v-flex>
        <v-flex style="margin: 24px;">
          <router-link to="">
            <div><b>開発効率！ちょー便利、Firestoreモデルクラスを作ろう</b></div>
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