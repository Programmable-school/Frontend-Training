<template>
  <div class="container">
    <v-flex class="container__body">
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <!--  v-toolbar -->
            <v-toolbar color="orange" dark>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-tabs
              slot="extension"
              v-model="menuTab.model"
              centered
              color="white"
              slider-color="blue">
              <v-tab v-for="(content, index) in menuTab.contents" :key="index" :href="`#tab-${index}`" class="blue--text">
                {{ content.title }}
              </v-tab>
            </v-tabs>
            <!--MenuTabの内容 -->
            <v-tabs-items v-model="menuTab.model">
              <!-- menuTab.modelに応じて内容を変える -->
              <v-tab-item v-for="(content, index) in menuTab.contents" :key="index" :value="`tab-${index}`">
                <!-- Users -->
                <v-flex v-show="menuTab.model === `tab-0`">
                  <v-list two-line>
                    <template v-for="(item, index) in users">
                      <!-- header -->
                      <v-subheader
                        v-if="item.header"
                        :key="item.header">
                        {{ item.header }}
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
                <!-- 記事 -->
                <v-flex v-show="menuTab.model === `tab-1`">
                  <v-list two-line>
                    <template v-for="(item, index) in items">
                      <!-- header -->
                      <v-subheader
                        v-if="item.header"
                        :key="item.header">
                        {{ item.header }}
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
                        @click="onClickListItems(item)">
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
              </v-tab-item>
            </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog
      v-model="isDialog"
      width="500">
      <v-card class="dialog-container">
        <v-card-title
          class="headline grey lighten-2"
          primary-title>
          {{ selectedItem.title }}
        </v-card-title>
        <v-flex style="margin: 16px;">
          <img :src="selectedItem.avatar" class="avatar">
        </v-flex>
        <a :href="selectedItem.url" target="_blank">{{ selectedItem.url }}</a>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="isDialog = false">
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class AxiosLesson extends Vue {
  title: string = 'AxiosLesson'

  /**
   * axiosを初期化する
   * 予めリクエストを送るAPIをbaseURLとして設定することができる
   */
  axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: 'https://qiita.com/api/v2',
  })

  /**
   * menu-tab
   */
  menuTab: any = {
    model: 'tab-0',
    contents: [
      { id: 0, title: 'ユーザー' },
      { id: 1, title: '記事' },
    ],
  }

  /**
   * User情報
   */
  users: any[] = [
    { header: '取得中' },
  ]

  /**
   * 記事情報
   */
  items: any[] = [
    { header: '取得中' },
  ]

  /**
   * Dialog
   */
  isDialog: boolean = false
  selectedItem: any = {
    id: '',
    avatar: '',
    title: '',
    url: '',
  }

  mounted() {
    this.getUsers()
    this.getItems('NEM')
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
          { header: `${result.data.length} 件` },
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

  /**
   * axiosでuserの詳細情報を取得する
   */
  async getUserDetail(id: string) {
    try {
      const result = await this.axios.get(`/users/${id}`)
      console.log('getUserDetail', result.data)
      const data = result.data
      if (('id' in data) && ('profile_image_url' in data) && ('name' in data)) {
        this.selectedItem = {
          id: data.id,
          avatar: data.profile_image_url,
          title: data.name ? data.name : data.id,
          url: `https://qiita.com/${data.id}`,
        }
      }
    } catch (error) {
      console.log('axios error', error)
    }
  }

  /**
   * axiosで記事を検索する /api/v2/items
   */
 async getItems(searchText: string) {
    try {
      const params: any = {
        query: searchText,
      }
      const result = await this.axios.get('/items', { params })
      console.log('getItems', result.data)
      if (result.data) {
        /**
         * header追加
         */
        this.items = [
          { header: `${result.data.length} 件` },
        ]
        result.data.forEach((element: any) => {
          if (('id' in element) && ('title' in element) && ('url' in element) && ('user' in element) ) {
            if ('profile_image_url' in element.user) {
              const item = {
                id: element.id,
                avatar: element.user.profile_image_url,
                title: element.title,
                url: element.url,
              }
              /**
               * 付箋追加
               */
              this.items.push({ divider: true, inset: true })

              /**
               * データ追加
               */
              this.items.push(item)
            }
          }
        })
      }
    } catch (error) {
      console.log('axios error', error)
    }
  }

  async onClickListUsers(item: any) {
    console.log(item)
    await this.getUserDetail(item.id)
    this.isDialog = true
  }

  onClickListItems(item: any) {
    console.log(item)
    this.selectedItem = item
    this.isDialog = true
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