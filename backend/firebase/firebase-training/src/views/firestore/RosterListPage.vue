<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="container">
        <v-flex>
          <h2>名簿リスト</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-text-field
              v-model="name"
              single-line
              outline
              placeholder="名前"/>
            <v-text-field
              v-model="age"
              single-line
              outline
              type="number"
              placeholder="年齢"/>
            <v-radio-group 
              v-model="sex" row>
              <v-radio label="男性" value="男性" color="blue"></v-radio>
              <v-radio label="女性" value="女性" color="blue"></v-radio>
            </v-radio-group>
            <v-switch
                v-model="isPublished"
                :label="publishedLabel"
                color="blue"/>
            <v-btn
              @click="onRegist"
              :loading="isLoading"
              color="blue"
              class="white--text">
              {{ getRegistLabel }}            
            </v-btn>
            <v-btn
              v-if="selectId!==''"
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
            <h3>登録した名簿</h3>
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
                    <td>{{ props.item.age }}</td>
                    <td>{{ props.item.sex }}</td>
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
  name: 'RosterListPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class RosterListPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false

  /**
   * 登録データ
   */
  name: string = ''
  age: number = 20
  sex: string = '男性'
  isPublished: boolean = true

  /**
   * 登録一覧
   */
  items: any[] = []

  /**
   * select
   */
  ages: number[] = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

  /**
   * v-data-table
   */
  headers: any[] = [
    { text: 'uid', value: 'uid' },
    { text: 'name', value: 'name' },
    { text: 'age', value: 'age' },
    { text: 'sex', value: 'sex' },
    { text: 'createdAt', value: 'createdAt' },
    { text: 'updatedAt', value: 'updatedAt' },
  ]

  /**
   * data
   */
  selectId: string = ''
  selectRowsPerPage: number = 5
  publishedLabel: string = '公開する'

  pagination: any = {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: this.selectRowsPerPage,
  }

  @Watch('selectRowsPerPage')
  onChangeSelectRowsPerPage(newVal: number) {
    this.pagination.rowsPerPage = newVal
  }

  @Watch('isPublished')
  onChangeIsPublished(val: boolean) {
    this.publishedLabel = val === true ? '公開する' : '公開しない'
  }

  mounted() {
    this.getItems()
  }

  /**
   * 登録
   */
  async onRegist() {
    this.isLoading = true
    if (this.selectId === '') {
      await this.writeFirestore()
    } else {
      await this.updateFirestore(this.selectId)
    }
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
   * 削除
   */
  async onDelete() {
    this.isLoading = true
    await this.deleteFirestore(this.selectId)
    await this.getItems()
    this.clear()
    this.isLoading = false
  }

  /**
   * データリストを要素をクリック処理
   */
  onClick(item: any) {
    console.log(item)
    this.selectId = item.uid
    const data = this.items.filter((element: any) => element.uid === item.uid)[0]
    if (data) {
      this.setFormData(item)
    }
  }

  /**
   * フォームにセット
   */
  setFormData(item: any) {
    this.name = item.name
    this.age = item.age
    this.sex = item.sex
    this.isPublished = item.isPublished
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = ''
    this.age = 20
    this.sex = '男性'
    this.isPublished = true
    this.selectId = ''
  }

  /**
   * 登録ラベルを取得
   */
  get getRegistLabel(): string {
    return this.selectId === '' ? '登録' : '更新'
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
        age: this.age,
        sex: this.sex,
        isPublished: this.isPublished,
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
  
  /**
   * Firestoreのデータを更新
   */
  async updateFirestore(id: string) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const collection = db.collection('version/1/users')
      const result = await collection.doc(id).update({
        updatedAt: new Date(),
        name: this.name,
        age: this.age,
        sex: this.sex,
        isPublished: this.isPublished,
      })
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを削除
   */
  async deleteFirestore(id: string) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const collection = db.collection('version/1/users')
      const result = await collection.doc(id).delete()
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