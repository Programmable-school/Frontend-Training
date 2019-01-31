<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="container">
        <v-flex>
          <h2>メモフォームを作成</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-text-field
              v-model="name"
              single-line
              outline
              placeholder="名前"/>
            <v-textarea
              v-model="memo"
              outline
              placeholder="メモ"/>
            <v-btn
              @click="regist"
              :loading="isLoading"
              color="blue"
              class="white--text">
              登録
            </v-btn>
          </v-flex>
        </v-flex>
        <v-card class="container">
          <v-flex>
            <h3>登録した名簿リスト</h3>
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
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.memo }}</td>
                    <td>{{ props.item.createdAt.toDate() }}</td>
                    <td>{{ props.item.updatedAt.toDate() }}</td>
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

@Component
export default class CreateFormPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false

  /**
   * 登録データ
   */
  name: string = ''
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
    { text: 'name', value: 'name' },
    { text: 'memo', value: 'memo' },
    { text: 'createdAt', value: 'createdAt' },
    { text: 'updatedAt', value: 'updatedAt' },
  ]

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

  async regist() {
    console.log(this.name, this.memo)
    this.isLoading = true
    await this.writeFirestore()
    await this.getItems()
    this.clear()
    this.isLoading = false
  }

  async getItems() {
    console.log('getItems')
    this.isLoading = true
    await this.readFirestore()
    this.isLoading = false
  }

  clear() {
    this.name = ''
    this.memo = ''
  }

  /**
   * Firestoreへデータを書き込む
   */
  async writeFirestore() {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const collection = db.collection('version/1/users')
      const id: string = collection.doc().id
      const result = await collection.doc(id).set({
        uid: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: this.name,
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
      const items: firebase.firestore.QuerySnapshot = await db.collection('version/1/users').get()
      items.docs.forEach((item: firebase.firestore.QueryDocumentSnapshot) => {
        this.items.push(item.data())
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