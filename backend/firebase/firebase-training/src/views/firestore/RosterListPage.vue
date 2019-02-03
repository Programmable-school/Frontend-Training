<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>名簿リスト</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-text-field
              v-model="name"
              label="名前"
              outline
              placeholder="名前"/>
            <v-text-field
              v-model="age"
              label="年齢"
              outline
              type="number"
              placeholder="年齢"/>
            <v-radio-group 
              v-model="sex"
              row>
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
        <v-card class="container">
          <v-flex>
            <h3>登録した名簿（検索クエリ）</h3>
            <v-flex style="margin: 24px;">
              <p>条件を指定して検索する</p>
              <v-flex>
                <v-text-field
                  v-model="queryAge"
                  label="年齢"
                  outline
                  type="number"
                  placeholder="年齢"/>
                <v-radio-group 
                  v-model="querySex" 
                  row>
                  <v-radio label="男性" value="男性" color="blue"></v-radio>
                  <v-radio label="女性" value="女性" color="blue"></v-radio>
                </v-radio-group>
                <v-switch
                  v-model="queryIsPublished"
                  :label="queryPublishedLabel"
                  color="blue"/>
                <v-flex style="margin: 8px;">
                  <p>検索件数</p>
                  <div style="margin-top: -10px;">
                    <select v-model="selectRowsPerPage">
                      <option v-for="(item, index) in pages" :key="index" :value="item">
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </v-flex>
              </v-flex>
              <v-flex style="margin-top: 24px;">
                <v-btn
                  @click="getQueryItems"
                  :loading="isLoading"
                  color="blue"
                  class="white--text">
                  読み込み
                </v-btn>
              </v-flex>
              <v-data-table
                :headers="headers"
                :items="queryItems"
                :pagination.sync="pagination"
                no-data-text="">
                <template 
                  slot="items"
                  slot-scope="props">
                  <tr>
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
  name: string = 'ゲスト'
  age: number = 20
  sex: string = '男性'
  isPublished: boolean = true

  /**
   * クエリ用データ
   */
  queryAge: number = 20
  querySex: string = '男性'
  queryIsPublished: boolean = true

  /**
   * 登録一覧
   */
  items: any[] = []
  queryItems: any[] = []

  /**
   * select
   */
  pages: number[] = [5, 10, 20, 50, 100]

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
  selectItem: any = undefined
  isUpdate: boolean = false
  selectRowsPerPage: number = 5
  publishedLabel: string = '公開する'
  queryPublishedLabel: string = '公開する'

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

  @Watch('queryIsPublished')
  onChangeQueryIsPublished(val: boolean) {
    this.queryPublishedLabel = val === true ? '公開する' : '公開しない'
  }

  async mounted() {
    await this.getItems()
    await this.getQueryItems()
    this.observeFirestore()
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
    await this.readQueryFirestore()
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
   * 取得（検索クエリ）
   */
  async getQueryItems() {
    console.log('getQueryItems')
    this.isLoading = true
    await this.readQueryFirestore()
    this.isLoading = false
  }

  /**
   * 削除
   */
  async onDelete() {
    this.isLoading = true
    await this.deleteFirestore(this.selectItem.uid)
    await this.readQueryFirestore()
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
    this.age = item.age
    this.sex = item.sex
    this.isPublished = item.isPublished
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = 'ゲスト'
    this.age = 20
    this.sex = '男性'
    this.isPublished = true
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
      const db: firebase.firestore.Firestore = firebase.firestore()
      const collection: firebase.firestore.CollectionReference = db.collection('version/1/users')
      const id: string = collection.doc().id
      await collection.doc(id).set({
        uid: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: this.name,
        age: Number(this.age),  // v-text-fieldで入力するとString型になるためNumber型へ変換
        sex: this.sex,
        isPublished: this.isPublished,
      })
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreからデータを取得, 検索クエリ
   */
  async readFirestore() {
    try {
      this.items = []
      const db: firebase.firestore.Firestore = firebase.firestore()
      const collection: firebase.firestore.CollectionReference = db.collection('version/1/users')
      const items: firebase.firestore.QuerySnapshot = await collection.get()
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
      const collection: firebase.firestore.CollectionReference = db.collection('version/1/users')
      await collection.doc(id).update({
        updatedAt: new Date(),
        name: this.name,
        age: Number(this.age),  // v-text-fieldで入力するとString型になるためNumber型へ変換
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
      const collection: firebase.firestore.CollectionReference = db.collection('version/1/users')
      await collection.doc(id).delete()
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータをリアルタイムに取得
   */
  async observeFirestore() {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      db.collection('version/1/users').onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot.docChanges().forEach((change: firebase.firestore.DocumentChange) => {
            /**
             * onSnapshotの種別がmodifiedの場合はデータを追加する。
             */
            if (change.type === 'added') {
              console.log('added', change.doc.data(), this.items)
              const data = change.doc.data()
              const filters = this.items.filter((item: any) => {
                if (item.uid === data.uid) {
                  return true
                } else {
                  return false
                }
              })
              if (filters.length === 0) {
                this.items.push(data)
              }
            }

            /**
             * onSnapshotの種別がmodifiedの場合はデータを更新する。
             */
            if (change.type === 'modified') {
              console.log('modified', change.doc.data())
              const data = change.doc.data()
              this.items = this.items.map((item: any) => {
                if (item.uid === data.uid) {
                  return data
                } else {
                  return item
                }
              })
            }

            /**
             * onSnapshotの種別がremovedの場合はデータを削除する。
             */
            if (change.type === 'removed') {
              console.log('removed', change.doc.data())
              const data = change.doc.data()
              this.items = this.items.filter((item: any) => {
                if (item.uid === data.uid) {
                  return false
                } else {
                  return true
                }
              })
            }
        })
      })
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを検索クエリを用いて取得
   */
  async readQueryFirestore() {
    try {
      this.queryItems = []
      const db: firebase.firestore.Firestore = firebase.firestore()
      /**
       * 検索クエリ
       * whereを用いて該当するage, sex, isPublishedのデータを検索する。
       * limitを用いて指定された数のデータを取得する。
       * orderByで並べ替えて取得（descを指定して降順で取得）
       *
       * ※注意
       * 複合クエリのインデックスがないためエラーがでるので、
       * エラー文の従いFirebase Firestoreコンソールより複合インデックスを追加する
       */
      const query: firebase.firestore.Query = db.collection('version/1/users')
                      .where('age', '==', Number(this.queryAge))  // v-text-fieldで入力するとString型になるためNumber型へ変換
                      .where('sex', '==', this.querySex)
                      .where('isPublished', '==', this.queryIsPublished)
                      .orderBy('createdAt', 'desc')
                      .limit(Number(this.selectRowsPerPage))

      const items: firebase.firestore.QuerySnapshot = await query.get()
      items.docs.forEach((item: firebase.firestore.QueryDocumentSnapshot) => {
        this.queryItems.push(item.data())
      })
      console.log(this.queryItems)
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

select
  outline none
  -moz-appearance none
  text-indent 0.01px
  text-overflow ''
  background none transparent
  vertical-align middle
  font-size 1.0em
  appearance none
  -webkit-appearance none
  -moz-appearance none
  height: 40px
  padding: 8px 12px
  border 2px solid black
  color black
  width 100px
  border-radius 16px

</style>