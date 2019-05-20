<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>ユーザリスト</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-text-field
              v-model="name"
              label="名前"
              outline
              placeholder="名前"/>
            <v-btn
              @click="onRegist"
              :loading="isLoading"
              color="blue"
              class="white--text">
              {{ getRegistLabel }}            
            </v-btn>
            <v-btn
              v-if="isUpdate===true"
              @click="onDelete"
              :loading="isLoading"
              color="red"
              class="white--text">
              削除
            </v-btn>
          </v-flex>
        </v-flex>
        <v-card class="container">
          <v-flex>
            <h3>登録したデータ</h3>
            <v-flex style="margin: 24px;">
              <v-btn
                @click="getItems"
                :loading="isLoading"
                color="blue"
                class="white--text">
                読み込み
              </v-btn>
              <div style="margin: 8px;">
                <p style="color: gray;">リスト内のデータを選択するとそのデータを更新できます。</p>
              </div>
              <v-data-table
                :headers="headers"
                :items="items"
                :pagination.sync="pagination"
                no-data-text="">
                <template 
                  slot="items"
                  slot-scope="props">
                  <tr @click="onClick(props.item)">
                    <td>{{ props.item.uid }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.createdAt.toDate() | dateFormat }}</td>
                    <td>{{ props.item.updatedAt.toDate() | dateFormat }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-flex>
        </v-card>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase, { firestore } from 'firebase/app'
import { format } from 'date-fns'
import axios from 'axios'

@Component({
  name: 'UserListPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class UserListPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false

  /**
   * 登録データ
   */
  name: string = 'ゲスト'

  /**
   * 登録一覧
   */
  items: any[] = []

  /**
   * select
   */
  pages: number[] = [5, 10, 20, 50, 100]

  /**
   * v-data-table
   */
  headers: Array<{ text: string, value: string }> = [
    { text: 'uid', value: 'uid' },
    { text: 'name', value: 'name' },
    { text: 'createdAt', value: 'createdAt' },
    { text: 'updatedAt', value: 'updatedAt' },
  ]

  /**
   * data
   */
  selectItem: any = undefined
  isUpdate: boolean = false
  selectRowsPerPage: number = 5

  pagination: any = {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: this.selectRowsPerPage,
  }

  /**
   * baseUrl for Request API.
   * axios create for Request API.
   */
  baseUrl: string = 'https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/'
  axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: this.baseUrl,
  })

  @Watch('selectRowsPerPage')
  onChangeSelectRowsPerPage(newVal: number) {
    this.pagination.rowsPerPage = newVal
  }

  async mounted() {
    await this.getItems()
  }

  /**
   * 登録・更新
   */
  async onRegist() {
    this.isLoading = true
    if (this.isUpdate === true) {
      await this.updateFirestore(this.selectItem.uid)
    } else {
      await this.writeFirestore()
    }
    Promise.all([
      this.readFirestore(),
    ]).then((results) => {
      this.clear()
      this.isLoading = false
    }).catch((error) => {
      this.isLoading = false
    })
  }

  /**
   * 取得
   */
  async getItems() {
    console.log('getItems')
    this.isLoading = true
    await this.readFirestore()
    this.isLoading = false
  }


  /**
   * 削除
   */
  async onDelete() {
    this.isLoading = true
    await this.deleteFirestore(this.selectItem.uid)
    this.clear()
    this.isLoading = false
  }

  /**
   * データリストを要素をクリック処理
   */
  onClick(item: any) {
    console.log(item)
    this.selectItem = item
    this.isUpdate = true
    this.setFormData(item)
  }

  /**
   * フォームにセット
   */
  setFormData(item: any) {
    this.name = item.name
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = 'ゲスト'
    this.selectItem = undefined
    this.isUpdate = false
  }

  /**
   * 登録ラベルを取得
   */
  get getRegistLabel(): string {
    return this.isUpdate === true ? '更新' : '登録'
  }

  /**
   * Firestoreへデータを書き込む
   */
  async writeFirestore() {
    try {
      // FunctionsのAPIへリクエスト
      const result = await this.axios.post('/v1/user', {
        name: this.name,
      })
      console.log(result)
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreからデータを取得
   */
  async readFirestore() {
    try {
      // FunctionsのAPIへリクエスト
      const result = await this.axios.get('/v1/user')
      console.log(result)
      result.data.data.forEach((item: any) => {
        // console.log(item)
        // const updatedAt = item.updatedAt as firebase.firestore.Timestamp
        // console.log(updatedAt.toDate())
        // this.items.push(item)
      })
      // console.log(this.items)
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを更新
   */
  async updateFirestore(id: string) {
    try {
       // FunctionsのAPIへリクエスト
      const result = await this.axios.put('/v1/user', {
        id,
        name: this.name,
      })
      console.log(result)
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを削除
   */
  async deleteFirestore(id: string) {
    try {
       // FunctionsのAPIへリクエスト
      const result = await this.axios.delete('/v1/user', { data: { id } })
      console.log(result)
    } catch (error) {
      console.error('firebase error', error)
    }
  }
}
</script>
<style lang="stylus">

.top
  margin 10px

.container
  text-align left 
  margin-top 20px

.subtitle
  padding-left 12px


</style>