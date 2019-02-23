<template>
  <div class="container">
    <v-flex class="container__body">
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <!--  v-toolbar -->
            <v-toolbar color="blue" dark>
              <v-toolbar-title>
                {{ title }} {{ version }}
              </v-toolbar-title>
            </v-toolbar>
            <v-list two-line>
              <template v-for="(item, index) in users">
                <!-- header -->
                <v-subheader
                  v-if="item.header"
                  :key="item.header">
                  お問い合わせ先: {{ item.header }}
                </v-subheader>
                <!-- リストの間の罫線 -->
                <v-divider
                  v-else-if="item.divider"
                  :key="index"
                  :inset="item.inset"/>
                <!-- リストの内容-->
                <v-list-tile
                  v-else
                  :key="index"
                  avatar
                  @click="onClickListUsers(item)">
                  <!-- リスト内の画像-->
                  <v-list-tile-avatar>
                    <img :src="item.avatar">
                  </v-list-tile-avatar>
                  <!-- リスト内ののコンテンツ-->
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.title" />
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class DotenvLesson extends Vue {
  /**
   * Dotenv
   * titleとversionに環境変数で定義した定数を設定する。
   */
  title: string = process.env.APP_TITLE
  version: string = process.env.APP_VERSION
  email: string = process.env.ADMIN_EMAIL

  /**
   * Dotenv
   * axiosの初期化
   * baseURLに環境変数で定義したURLを設定する。
   */
  axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: process.env.BASE_API_URL,
  })


  users: any[] = [
    { header: '' },
  ]

  mounted() {
    this.getUsers()
  }

  /**
   * axiosでusersを取得する
   */
  async getUsers() {
    try {
      const result = await this.axios.get('/users')
      console.log('getUsers', result.data)
      if (result.data) {
        /**
         * header追加
         */
        this.users = [
          { header: this.email },
        ]
        result.data.forEach((element: any) => {
          if (('id' in element) && ('profile_image_url' in element) && ('name' in element)) {
            const item = {
              id: element.id,
              avatar: element.profile_image_url,
              title: element.name ? element.name : element.id,
              url: `https://qiita.com/${element.id}`,
            }
            /**
             * 付箋追加
             */
            this.users.push({ divider: true, inset: true })

            /**
             * データ追加
             */
            this.users.push(item)
          }
        })
      }
    } catch (error) {
      console.log('axios error', error)
    }
  }

  async onClickListUsers(item: any) {
    open(item.url, '_blank')
  }

}
</script>
<style lang="stylus">
.container
  text-align left 
  margin 0 auto
  width 100%
  &__body
    margin-top 24px

.dialog-container
  text-align center

img.avatar
  border-radius 50px
  height 100px
  width 100px

a
  font-size 1.2em
</style>