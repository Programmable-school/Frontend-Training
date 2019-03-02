<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>商品を追加</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
              <v-text-field
                v-model="name"
                label="商品名"
                outline
                placeholder="ガリガリ君"/>
              <v-text-field
                v-model="price"
                label="料金"
                outline
                type="number"
                placeholder="料金"/>
              <v-text-field
                v-model="remainCount"
                label="数量"
                outline
                type="number"
                placeholder="数量"/>
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
          <h3>商品の購入</h3>
          <v-flex v-if="isUpdate">
            <v-btn
              @click="onBuy(1)"
              :loading="isLoading"
              color="red"
              class="white--text">
              1人が購入
            </v-btn>
            <v-btn
              @click="onBuy(2)"
              :loading="isLoading"
              color="red"
              class="white--text">
              2人が購入
            </v-btn>
            <v-btn
              @click="onBuy(3)"
              :loading="isLoading"
              color="red"
              class="white--text">
              3人が購入
            </v-btn>
            <v-btn
              @click="onBuy(5)"
              :loading="isLoading"
              color="red"
              class="white--text">
              5人が購入
            </v-btn>
          </v-flex>
        </v-card>
        <v-card class="container">
          <v-flex>
            <h3>商品一覧</h3>
            <v-flex style="margin: 24px;">
              <v-btn
                @click="getItems"
                :loading="isLoading"
                color="blue"
                class="white--text">
                読み込み
              </v-btn>
              <div style="margin: 8px;">
                <p style="color: gray;">リスト内のデータを選択するとその商品を購入できます。</p>
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
                    <td>{{ props.item.price }}</td>
                    <td>{{ props.item.remainCount }}</td>
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
  name: 'ShopItemBuyPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class ShopItemBuyPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false

  /**
   * 登録データ
   */
  name: string = ''
  price: number = 50
  remainCount: number = 10

  /**
   * 登録一覧
   */
  items: any[] = []

  /**
   * 商品トランザクション結果
   */
  trItemResultInfo: any[] = [
    { status: 0, message: 'SUCCESS' },
    { status: 1, message: 'ERROR' },
    { status: 2, message: 'NOT_WRITE_FOR_COUNT_NOTTHING' },
    { status: 3, message: 'NOT_WRITE_FOR_DATA_NOT_EXIST' },
  ]

  /**
   * v-data-table
   */
  headers: any[] = [
    { text: 'uid', value: 'uid' },
    { text: 'name', value: 'name' },
    { text: 'price', value: 'age' },
    { text: 'remainCount', value: 'remainCount' },
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

  async mounted() {
    await this.getItems()
  }

  /**
   * 登録
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
   * 購入
   */
  async onBuy(memberNums: number) {
    this.isLoading = true
    /**
     * 購入者数に応じてリクエスト数を追加する
     */
    const requestList: any[] = []
    for (let i = 0; i < memberNums; i++) {
      requestList.push(this.transactionFirestore(this.selectItem))
    }

    /**
     * 後処理コールバック関数
     */
    const terminateCallback = (async () => {
      await this.getItems()
      const item = await this.readFirestoreItem(this.selectItem.uid)
      if (item) {
        this.selectItem = item
        this.setFormData(item)
      }
      this.isLoading = false
    })

    /**
     * Promise.allで同時リクエスト
     */
    Promise.all(requestList).then(async (results: any[]) => {
      console.log('onBuy', results)
      await terminateCallback()
    }).catch(async (error: Error) => {
      console.error('onBuy', error)
      await terminateCallback()
    })
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
    this.price = item.price
    this.remainCount = item.remainCount
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = ''
    this.price = 50
    this.remainCount = 10
    this.selectItem = undefined
    this.isUpdate = false
  }

  /**
   * 登録ラベルを取得
   */
  get getRegistLabel(): string {
    return this.isUpdate === true ? '更新' : '追加'
  }

  /**
   * Firestoreへデータを書き込む
   */
  async writeFirestore() {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()
      const itemCollection: firebase.firestore.CollectionReference = db.collection('version/1/shopitems')
      const itemUid: string = itemCollection.doc().id
      const itemRef: firebase.firestore.DocumentReference = itemCollection.doc(itemUid)
      batch.set(itemRef, {
        uid: itemUid,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: this.name,
        price: this.price,
        remainCount: this.remainCount,
      })
      await batch.commit()
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを更新
   */
  async updateFirestore(item: any) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()
      const itemCollection: firebase.firestore.CollectionReference = db.collection('version/1/shopitems')
      const itemRef: firebase.firestore.DocumentReference = itemCollection.doc(item.uid)
      batch.update(itemRef, {
        updatedAt: new Date(),
        name: this.name,
        price: this.price,
        remainCount: this.remainCount,
      })
      // 一括更新
      await batch.commit()
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreへデータを書き込む（トランザクション）
   */
  async transactionFirestore(item: any): Promise<any> {
    let result: any
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      /**
       * トランザクションを実行することで処理の制御排他ができる。
       * 複数人が同時にアクセスしても順番に処理される。
       * 1トランザクションあたり約1秒かかる、
       * トランザクションは失敗すると6回繰り返して行われる。
       * https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja
       */
      return db.runTransaction(async (tr: firebase.firestore.Transaction) => {
        const collection: firebase.firestore.CollectionReference = db.collection('version/1/shopitems')
        const ref: firebase.firestore.DocumentReference = collection.doc(item.uid)
        const doc = await tr.get(ref)
        /**
         * remainCountの回数を１カウント減らす。
         * 取得したremainCountが0の場合は何もしない。
         */
        if (doc.exists) {
          const data = doc.data()!
          if (data.remainCount <= 0) {
            result = this.trItemResultInfo[2]
          } else {
            const count: number = data.remainCount - 1 >= 0 ? data.remainCount - 1 : 0
            await tr.update(ref, { remainCount: count, updatedAt: new Date() })
            result = this.trItemResultInfo[0]
          }
        } else {
          result = this.trItemResultInfo[3]
        }
        console.log('runTransaction', result)
        return result
      })
    } catch (error) {
      console.error('firebase error', error)
      result = this.trItemResultInfo[1]
      return result
    }
  }

  /**
   * Firestoreからデータを取得
   */
  async readFirestore() {
    try {
      this.items = []
      const db: firebase.firestore.Firestore = firebase.firestore()
      const itemCollection: firebase.firestore.CollectionReference = db.collection('version/1/shopitems')
      const items: firebase.firestore.QuerySnapshot = await itemCollection.get()
      await items.docs.forEach(async (item: firebase.firestore.QueryDocumentSnapshot) => {
        const itemData: any = item.data()
        console.log('getItemData', itemData)
        this.items.push(itemData)
      })
      console.log(this.items)
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreからデータを取得（uid指定）
   */
  async readFirestoreItem(uid: string): Promise<any> {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const itemCollection: firebase.firestore.CollectionReference = db.collection('version/1/shopitems')
      const item: firebase.firestore.DocumentSnapshot = await itemCollection.doc(uid).get()
      console.log(item)
      if (item.exists) {
        return item.data()
      } else {
        return undefined
      }
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Firestoreのデータを削除
   */
  async deleteFirestore(item: any) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()
      const itemCollection: firebase.firestore.CollectionReference = db.collection('version/1/shopitems')
      const itemRef: firebase.firestore.DocumentReference = itemCollection.doc(item.uid)
      batch.delete(itemRef)
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