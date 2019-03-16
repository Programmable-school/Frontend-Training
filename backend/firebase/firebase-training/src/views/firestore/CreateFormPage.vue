<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>メモフォームを作成</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-textarea
              v-model="memo"
              outline
              label="メモ"/>
            <v-btn
              @click="onRegist"
              :loading="isLoading"
              color="blue"
              class="white--text">
              登録
            </v-btn>
          </v-flex>
        </v-flex>
        <v-card class="container">
          <v-flex>
            <h3>登録したメモ</h3>
            <v-flex style="margin: 24px;">
              <v-btn
                @click="getItems"
                :loading="isLoading"
                color="blue"
                class="white--text">
                読み込み
              </v-btn>
              <v-data-table
                :headers="headers"
                :items="items"
                :pagination.sync="pagination"
                no-data-text="">
                <template 
                  slot="items"
                  slot-scope="props">
                  <tr>
                    <td>{{ props.item.uid }}</td>
                    <td><span v-html="props.item.memo"/></td>
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
import firebase from 'firebase/app'
import { format } from 'date-fns'

@Component({
  name: 'CreateFormPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class CreateFormPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false

  /**
   * 登録データ
   */
  memo: string = ''

  /**
   * 登録一覧
   */
  items: any[] = []

  /**
   * v-data-table
   */
  headers: any[] = [
    { text: 'uid', value: 'uid' },
    { text: 'memo', value: 'memo' },
    { text: 'createdAt', value: 'createdAt' },
    { text: 'updatedAt', value: 'updatedAt' },
  ]

  /**
   * data
   */
  selectRowsPerPage: number = 5

  pagination: any = {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: this.selectRowsPerPage,
  }

  @Watch('selectRowsPerPage')
  onChangeSelectRowsPerPage(newVal: number) {
    this.pagination.rowsPerPage = newVal
  }

  mounted() {
    this.getItems()
  }

  /**
   * 登録
   */
  async onRegist() {
    this.isLoading = true
    await this.writeFirestore()
    await this.getItems()
    this.clear()
    this.isLoading = false
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
   * フォームをクリア
   */
  clear() {
    this.memo = ''
  }

  /**
   * Firestoreへデータを書き込む
   */
  async writeFirestore() {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const collection: firebase.firestore.CollectionReference = db.collection('version/1/memo')
      const id: string = collection.doc().id
      const result = await collection.doc(id).set({
        uid: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        memo: this.memo,
      })
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreからデータを取得
   */
  async readFirestore() {
    try {
      this.items = []
      const db: firebase.firestore.Firestore = firebase.firestore()
      const items: firebase.firestore.QuerySnapshot = await db.collection('version/1/memo').get()
      items.docs.forEach((item: firebase.firestore.QueryDocumentSnapshot) => {
        if (item.exists) {
          const data = item.data()
          if ('memo' in data) {
            data.memo = data.memo.replace(/\n/g, '<br>')
          }
          this.items.push(data)
        }
      })
      console.log(this.items)
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