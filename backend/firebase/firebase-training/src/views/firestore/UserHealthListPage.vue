<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>ユーザーヘルスリスト</h2>
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
            <v-flex style="margin-top: 8px;">
              <h3>ヘルスデータ</h3>
              <v-flex style="margin: 24px;">
                <v-text-field
                  v-model="height"
                  label="身長"
                  outline
                  type="number"
                  placeholder="身長"/>
                <v-text-field
                  v-model="weight"
                  label="体重"
                  outline
                  type="number"
                  placeholder="体重"/>
                </v-flex>
            </v-flex>
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
            <h3>登録したユーザーヘルス</h3>
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
                    <td>{{ props.item.height }}</td>
                    <td>{{ props.item.weight }}</td>
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
  name: 'UserHealthListPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class UserHealthListPage extends Vue {
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
  height: number = 160
  weight: number = 40

  /**
   * 登録一覧
   */
  items: any[] = []

  /**
   * select
   */

  /**
   * v-data-table
   */
  headers: any[] = [
    { text: 'uid', value: 'uid' },
    { text: 'name', value: 'name' },
    { text: 'age', value: 'age' },
    { text: 'sex', value: 'sex' },
    { text: 'height', value: 'height' },
    { text: 'weight', value: 'weight' },
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

  async mounted() {
    await this.getItems()
  }

  /**
   * 登録・更新
   */
  async onRegist() {
    this.isLoading = true
    if (this.isUpdate === true) {
      await this.updateFirestore(this.selectItem)
    } else {
      await this.writeFirestore()
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
    await this.deleteFirestore(this.selectItem)
    await this.getItems()
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
    this.height = item.height
    this.weight = item.weight
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = 'ゲスト'
    this.age = 20
    this.sex = '男性'
    this.isPublished = true
    this.height = 160
    this.weight = 40
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
   * Firestoreへデータを書き込む（バッチ処理）
   */
  async writeFirestore() {
    try {
      /**
       * バッチ処理で書き込む。
       * ユーザーコレクションとヘルスコレクションを設定
       * ヘルスコレクションはユーザーコレクションの中のコレクションとして作成する（NestedCollection）
       */
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()

      // ユーザーコレクション
      const userCollection: firebase.firestore.CollectionReference = db.collection('version/2/user')
      const userId: string = userCollection.doc().id
      const userRef: firebase.firestore.DocumentReference = userCollection.doc(userId)

      // ヘルスコレクション
      const healthCollocetion: firebase.firestore.CollectionReference = userRef.collection('health')
      const healthId: string = healthCollocetion.doc().id
      const healthRef: firebase.firestore.DocumentReference = healthCollocetion.doc(healthId)

      /**
       * バッチ処理で書き込み
       */
      // ユーザーコレクションをセット
      batch.set(userRef, {
        uid: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: this.name,
        age: Number(this.age),        // v-text-fieldで入力するとString型になるためNumber型へ変換
        sex: this.sex,
        isPublished: this.isPublished,
        healthUid: healthId,          // ヘルスコレクションを参照するためのドキュメントID
      })

      // ユーザーコレクションをセット
      batch.set(healthRef, {
        uid: healthId,
        createdAt: new Date(),
        updatedAt: new Date(),
        height: Number(this.height),  // v-text-fieldで入力するとString型になるためNumber型へ変換
        weight: Number(this.weight),  // v-text-fieldで入力するとString型になるためNumber型へ変換
      })

      // 一括書き込み
      await batch.commit()
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
      const userCollection: firebase.firestore.CollectionReference = db.collection('version/2/users')
      const items: firebase.firestore.QuerySnapshot = await userCollection.get()
      await items.docs.forEach(async (item: firebase.firestore.QueryDocumentSnapshot) => {
        /**
         * ヘルスコレクションを取得
         */
        const userData: any = item.data()
        const health: firebase.firestore.DocumentSnapshot = await item.ref.collection('health').doc(userData.healthUid).get()
        if (health.data() !== undefined) {
          userData.height = health.data()!.height
          userData.weight = health.data()!.weight
        }
        console.log('getUserData', userData)
        this.items.push(userData)
      })
      console.log(this.items)
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを更新（バッチ処理）
   */
  async updateFirestore(item: any) {
    try {
      /**
       * バッチ処理で書き込む。
       * ユーザーコレクションとヘルスコレクションを設定
       * ヘルスコレクションはユーザーコレクションの中のコレクションとして作成する（NestedCollection）
       */
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()

      // ユーザーコレクション
      const userCollection: firebase.firestore.CollectionReference = db.collection('version/2/users')
      const userRef: firebase.firestore.DocumentReference = userCollection.doc(item.uid)
      batch.update(userRef, {
        updatedAt: new Date(),
        name: this.name,
        age: Number(this.age),  // v-text-fieldで入力するとString型になるためNumber型へ変換
        sex: this.sex,
        isPublished: this.isPublished,
      })

      // ヘルスコレクション
      const healthRef: firebase.firestore.DocumentReference = userCollection.doc(`${item.uid}/health/${item.healthUid}`)
      batch.update(healthRef, {
        updatedAt: new Date(),
        height: Number(this.height),  // v-text-fieldで入力するとString型になるためNumber型へ変換
        weight: Number(this.weight),  // v-text-fieldで入力するとString型になるためNumber型へ変換
      })

      // 一括更新
      await batch.commit()
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを削除（バッチ処理）
   */
  async deleteFirestore(item: any) {
    try {
      /**
       * バッチ処理で削除する。
       * ユーザーコレクションとヘルスコレクションを設定
       * コレクションの中のコレクションは一括削除できないため、指定して削除する。
       */
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()

      // ユーザーコレクション
      const userCollection: firebase.firestore.CollectionReference = db.collection('version/2/users')
      const userRef: firebase.firestore.DocumentReference = userCollection.doc(item.uid)
      batch.delete(userRef)

      // ヘルスコレクション
      const healthRef: firebase.firestore.DocumentReference = userCollection.doc(`${item.uid}/health/${item.healthUid}`)
      batch.delete(healthRef)

      // 一括削除
      await batch.commit()
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