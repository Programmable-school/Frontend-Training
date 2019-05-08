<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="container">
        <!-- Firestore -->
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
              <div><b>商品登録と購入機能を作成</b></div>
              <div class="subtitle">トランザクション</div>
            </router-link>
          </v-flex>
          <!-- <v-flex style="margin: 24px;">
            <router-link to="shop_item_buy_page_original_model">
              <div><b>便利！Firestoreモデルクラスを作る</b></div>
            </router-link>
          </v-flex> -->
        </v-flex>
        <!-- Firebase Authantication  -->
        <v-flex>
          <h2>Firebase Authanticationトレーニング</h2>
          <v-flex style="margin: 24px;">
            <router-link to="./anonymously_page">
              <div><b>匿名認証</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./email_auth_page">
              <div><b>メール認証</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./email_auth_with_create_user_page">
              <div><b>認証情報を利用してFirestoreへユーザーデータを保存</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./security_rule_lesson_page">
              <div><b>Firestoreセキュリティルールを利用</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./social_login_page">
              <div><b>SNS認証</b></div>
            </router-link>
          </v-flex>
        </v-flex>
        <!-- Cloud Storage  -->
        <v-flex>
          <h2>Cloud Storageトレーニング</h2>
          <v-flex style="margin: 24px;">
            <router-link to="./image_operation_page">
              <div><b>画像の保存、取得、削除</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./image_operation_firestore_page">
              <div><b>Firestoreとの連携</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./image_operation_secure_page">
              <div><b>セキュリティルールの利用（操作、ファイル容量、拡張子の許容制御）</b></div>
            </router-link>
          </v-flex>
          <v-flex style="margin: 24px;">
            <router-link to="./image_operation_various_files_page">
              <div><b>様々な形式のファイルを扱う</b></div>
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