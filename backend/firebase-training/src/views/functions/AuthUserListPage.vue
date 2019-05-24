<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h3>ログイン状態</h3>
          <v-flex style="margin: 8px">
            <p>{{ loginStatusText}}</p>
          </v-flex>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-card class="container">
              <v-flex style="margin: 20px 0px;">
                <h3>ログイン</h3>
                <v-text-field
                  v-model="loginEmail"
                  type="text"
                  required
                  label="メールアドレス"
                  placeholder=""/>
                <v-text-field
                  v-model="loginPassword"
                  label="パスワード（6文字以上）"
                  min="6"
                  maxlength="32"
                  :append-icon ="isLoginShowPassword ? 'visibility' : 'visibility_off'"
                  @click:append="() => (isLoginShowPassword = !isLoginShowPassword)"
                  :type="isLoginShowPassword ? 'text' : 'password'"
                  required
                  placeholder=""
                  pattern="[a-zA-Z0-9]*"/>
                <v-flex>
                  <v-btn
                    color="blue"
                    class="white--text"
                    :loading="isLoading"
                    :disabled="isLoading"
                    @click="onLogin">ログイン</v-btn>
                  <v-btn
                    :loading="isLoading"
                    :disabled="!isLoginStatus"
                    color="red"
                    class="white--text"
                    @click="onLogout">ログアウト</v-btn>
                </v-flex>
                <v-flex style="margin: 20px 0px;">
                  <h3>ログインメッセージ</h3>
                  <p style="margin: 10px;" v-html="loginResultMessage"/>
                </v-flex>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- <h2>Callableデータ</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <p>{{ resultCallable }}</p>
          </v-flex> -->
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
                    <td>{{ props.item.createdAt | dateFormat }}</td>
                    <td>{{ props.item.updatedAt | dateFormat }}</td>
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
import 'firebase/functions'
import { format } from 'date-fns'
import axios from 'axios'

@Component({
  name: 'AuthUserListPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class AuthUserListPage extends Vue {

  isLoading: boolean = false
  message: string = ''
  isLoginStatus: boolean | null = null
  resultCallable: string = ''

  /**
   * [ログイン用]
   * メールとパスワードとログイン結果
   */
  loginEmail: string = ''
  loginPassword: string = ''
  loginResultMessage: string = ''
  isLoginShowPassword: boolean = false
  accessToken: string = ''

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
  baseUrl: string = 'https://us-central1-fir-training-ae8b1.cloudfunctions.net/authApi/'
  axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: this.baseUrl,
  })

  @Watch('selectRowsPerPage')
  onChangeSelectRowsPerPage(newVal: number) {
    this.pagination.rowsPerPage = newVal
  }

  async mounted() {
    this.onAuthState()
  }

  /** 認証状態を監視する */
  onAuthState() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user !== null) {
        this.isLoginStatus = true
        this.accessToken = await user!.getIdToken()
      } else {
        this.isLoginStatus = false
      }
      await this.getItems()
      // await this.onLoadCallable()
    })
  }

  get loginStatusText() {
    return this.isLoginStatus === true ? 'ログイン中' : 'ログアウト中'
  }

  /** ログイン */
  async onLogin() {
    this.isLoading = true
    await this.login()
    this.isLoading = false
  }

  /** ログアウト */
  async onLogout() {
    this.isLoading = true
    await this.signOut()
    this.isLoading = false
  }

  /** メール認証でログインする */
  async login() {
    try {
      this.loginResultMessage = ''
      const result = await firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
      console.log(result)
      this.loginResultMessage = 'ログインしました'
    } catch (error) {
      console.error('firebase error', error)
      this.loginResultMessage = error.message
    }
  }

  /** ログアウトする */
  async signOut() {
    try {
      const result = await firebase.auth().signOut()
      console.log(result)
      this.clear()
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  async onLoadCallable() {
    try {
      /**
       * localhostからのリクエストは弾かれるため、
       * 確認する場合は、Firebase hosting等でdeployしたホスティングサービス上からリクエストして確認してください。
       */
      const api = firebase.functions().httpsCallable('authHelloWorld')
      const result = await api('clientMessage')
      this.resultCallable = result.data
    } catch (error) {
      console.error('firebase error', error)
    }
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
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = 'ゲスト'
    this.selectItem = undefined
    this.isUpdate = false
    this.items = []
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
      const params = { name: this.name }
      const result = await this.axios.post('/v1/user', {
        params,
        headers: { authorization: this.accessToken },
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
      const result = await this.axios.get('/v1/user', {
        headers: { authorization: this.accessToken },
      })
      console.log(result)
      const items: any[] = result.data.data.map((item: any) => {
        if ('createdAt' in item) {
          item.createdAt = new Date(item.createdAt)
        }
        if ('updatedAt' in item) {
          item.updatedAt = new Date(item.updatedAt)
        }
        return item
      })
      this.items = items
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
      const params = { id, name: this.name }
      const result = await this.axios.put('/v1/user', {
        params,
        headers: { authorization: this.accessToken },
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
      const params = { id }
      const result = await this.axios.delete('/v1/user', {
        params,
        headers: { authorization: this.accessToken },
      })
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