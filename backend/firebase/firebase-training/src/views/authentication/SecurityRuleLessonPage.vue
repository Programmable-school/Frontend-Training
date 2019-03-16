<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <h2>Firestoreセキュリティルールを利用</h2>
      <!-- ステータス -->
      <v-card class="container">
        <h3>ステータス</h3>
        <v-flex style="margin: 20px 0px;">
          <p>メール認証ユーザーと匿名認証ユーザーを用いて、セキュリティルールを設定したFirestoreのアクセス挙動を確認します。</p>
          <p>※メール認証ユーザーのアカウントは予め Lesson8 で作成してください。</p>
          <table border="1" class="table__list">
            <tr>
              <td width="20%" class="table__key">認証タイプ</td>
              <td width="80%" class="table__value">{{ authStatusText }}</td>
            </tr>
            <tr>
              <td width="20%" class="table__key">ログイン状態</td>
              <td width="80%" class="table__value"> {{ loginStatusText }}</td>
            </tr>
          </table>
          <v-flex style="margin: 20px 0px;">
            <v-btn
              @click="onLogout"
              :loading="isLoading"
              :disabled="!isLoginStatus"
              color="red"
              class="white--text">
              ログアウトする
            </v-btn>
          </v-flex>
          <v-flex style="margin: 20px 0px;">
            <h3>処理メッセージ</h3>
            <p style="margin: 10px;" v-html="resultMessage"/>
          </v-flex>
        </v-flex>
      </v-card>
      <!-- メール認証ログインフォーム -->
      <v-card class="container">
        <v-flex style="margin: 20px 0px;">
          <h3>メール認証ユーザー</h3>
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
              @click="onEmailLogin">ログイン</v-btn>
          </v-flex>
          <!-- データ登録フォーム -->
          <v-card
            v-if="authType!==null&&authType==0" 
            class="container">
            <v-flex style="margin-top: 10px;">
              <h3>ユーザーデータ</h3>
              <v-flex style="margin-top: 20px;">
                <v-text-field
                  v-model="userName"
                  label="名前"
                  outline
                  placeholder=""/>
                <v-btn
                  color="blue"
                  class="white--text"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="onUpdateUser">更新</v-btn>
              </v-flex>
            </v-flex>
            <v-flex style="margin-top: 20px;">
              <h3>ユーザー秘密データ</h3>
              <v-flex style="margin-top: 20px;">
                <v-text-field
                  v-model="userSecretMemo"
                  label="秘密のメモ"
                  outline
                  placeholder=""/>
                <v-btn
                  color="blue"
                  class="white--text"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="onUpdateSecret">更新</v-btn>
              </v-flex>
            </v-flex>
          </v-card>
        </v-flex>
      </v-card>
      <!-- 匿名認証ログインフォーム -->
      <v-card class="container">     
        <v-flex style="margin: 30px 0px;">
          <h3>匿名認証ユーザー</h3>
          <v-flex style="margin: 20px 0px;" xs12 sm6 offset-sm3>
            <v-btn
              @click="onAnoLogin"
              :loading="isLoading"
              :disabled="isLoading"
              color="blue"
              class="white--text">
              ログインする
            </v-btn>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'

@Component({
  name: 'SecurityRuleLessonPage',
})
export default class SecurityRuleLessonPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false
  isLoginStatus: boolean | null = null

  /**
   * [ログイン用]
   * メールとパスワードとログイン結果
   */
  loginEmail: string = ''
  loginPassword: string = ''
  resultMessage: string = ''
  isLoginShowPassword: boolean = false
  authType: number | null = null      // 0: メール認証, 1: 匿名認証, null: ログアウト状態
  user: firebase.User | null = null

  /**
   * フォームデータ
   */
  userName: string = ''
  userSecretMemo: string = ''

  mounted() {
    this.getItems()
  }

  async getItems() {
    console.log('getItems')
    /**
     * 認証状態を監視する。
     * 認証状態が変わると処理される
     */
    firebase.auth().onAuthStateChanged(async (user) => {
      this.user = user
      this.authType = null
      this.isLoginStatus = false
      this.userFormClear()

      if (user !== null) {
        this.isLoginStatus = true
        console.log('user', user.uid)
        await this.getUserData(user.uid)
        if (user.isAnonymous) {
          this.authType = 1
        } else {
          user.providerData.forEach((item) => {
            if (item !== null) {
              if (item.email !== null && item.providerId === 'password') {
                this.authType = 0
              }
            }
          })
        }
      }
    })
  }

  userFormClear() {
    this.userName = ''
    this.userSecretMemo = ''
  }

  /**
   * ログイン（メール）
   */
  async onEmailLogin() {
    this.isLoading = true
    await this.emailLogin()
    this.isLoading = false
  }

  /**
   * ログイン（匿名）
   */
  async onAnoLogin() {
    this.isLoading = true
    await this.signInAnonymously()
    this.isLoading = false
  }

  /**
   * ログアウト
   */
  async onLogout() {
    this.isLoading = true
    await this.signOut()
    this.isLoading = false
  }

  /**
   * ユーザーデータを更新
   */
  async onUpdateUser() {
    this.isLoading = true
    try {
      this.resultMessage = ''
      if (this.user !== null) {
        await this.updateUser(this.user.uid, this.userName)
      } else {
        this.resultMessage = 'ログインしてください。'
      }
    } catch (error) {
      console.error('firebase error', error)
      /***
       * Missing or insufficient permissions. のメッセージの場合は
       * セキュリティールールによりアクセスできないという意味
       */
      if (this.isSecureBlock(error.message)) {
        this.resultMessage = 'セキュリティルールによりアクセスできませんでした。'
      } else {
        this.resultMessage = error.message
      }
      this.resultMessage = error.message
    }
    this.isLoading = false
  }

  /**
   * ユーザー秘密データを更新
   */
  async onUpdateSecret() {
    this.isLoading = true
    try {
      this.resultMessage = ''
      if (this.user !== null) {
        await this.postSecret(this.user.uid, this.userSecretMemo)
      } else {
        this.resultMessage = 'ログインしてください。'
      }
    } catch (error) {
      console.error('firebase error', error)
      /***
       * Missing or insufficient permissions. のメッセージの場合は
       * セキュリティールールによりアクセスできないという意味
       */
      if (this.isSecureBlock(error.message)) {
        this.resultMessage = 'セキュリティルールによりアクセスできませんでした。'
      } else {
        this.resultMessage = error.message
      }
    }
    this.isLoading = false
  }

  /**
   * メール認証でログインする
   */
  async emailLogin() {
    try {
      this.resultMessage = ''
      const result = await firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
      console.log(result)
      const user = firebase.auth().currentUser
      if (user !== null) {
        console.log('user', user.uid)
        /** Firestoreのユーザーデータを更新 */
        await this.updateUser(user.uid)
      }
    } catch (error) {
      console.error('firebase error', error)
      this.resultMessage = error.message
    }
  }

  /**
   * 匿名認証でログインする
   */
  async signInAnonymously() {
    try {
      const result = await firebase.auth().signInAnonymously()
      console.log(result)
      const user = firebase.auth().currentUser
      if (user !== null) {
        console.log('user', user.uid)
      }
    } catch (error) {
      console.error('firebase error', error)
      this.resultMessage = error.message
    }
  }

  /**
   * ユーザーデータを取得する。
   */
  async getUserData(userId: string) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()

      /** ユーザーデータを取得 */
      const userRef: firebase.firestore.DocumentReference = db.collection('version/3/user').doc(userId)
      const userItem = await userRef.get()
      if (userItem.exists) {
        if (userItem.data() !== undefined) {
          const data = userItem.data()!
          if ('name' in data) {
            this.userName = data.name
          }
        }
      }

      /** ユーザー秘密データを取得 */
      const secretRef: firebase.firestore.DocumentReference = db.collection(`version/3/user/${userId}/secret`).doc('1')
      const secretItem = await secretRef.get()
      if (secretItem.exists) {
        if (secretItem.data() !== undefined) {
          const data = secretItem.data()!
          if ('memo' in data) {
            this.userSecretMemo = data.memo
          }
        }
      }
    } catch (error) {
      throw error
    }
  }
  /**
   * ユーザーデータを更新する。
   */
  async updateUser(userId: string, userName?: string) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()
      const ref: firebase.firestore.DocumentReference = db.collection('version/3/user').doc(userId)
      const item = await ref.get()
      const data: any = {
        updatedAt: new Date(),
      }
      if (this.isNotUndefiend(userName)) {
        data.name = userName
      }
      if (item.exists) {
        batch.set(ref, data, { merge: true } )
        await batch.commit()
        this.resultMessage = 'ユーザーデータを更新しました。'
      } else {
        throw new Error('ユーザ情報がありません。新しいアカウントでサインアップしてください。')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * ユーザー秘密データを更新・作成する。
   */
  async postSecret(userId: string, secretMemo: string) {
    try {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const batch: firebase.firestore.WriteBatch = db.batch()
      const ref: firebase.firestore.DocumentReference = db.collection(`version/3/user/${userId}/secret`).doc('1')
      const item = await ref.get()
      const createdDate = new Date()
      const updatedDate = new Date()
      const data: any = {
        memo: secretMemo,
        updatedAt: updatedDate,
      }
      if (item.exists) {
        batch.set(ref, data, { merge: true } )
        await batch.commit()
        this.resultMessage = 'ユーザー秘密データを更新しました。'
      } else {
        data.createdAt = createdDate
        batch.set(ref, data, { merge: true } )
        await batch.commit()
        this.resultMessage = 'ユーザー秘密データを作成しました。'
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * ログアウトする
   */
  async signOut() {
    try {
      const result = await firebase.auth().signOut()
      console.log(result)
      this.isLoginStatus = false
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  get authStatusText() {
    if (this.authType !== null) {
      switch (this.authType) {
        case 0:
          return 'メール認証'
        case 1:
          return '匿名認証'
        default:
          return '不明'
      }
    } else {
      return '-'
    }
  }

  get loginStatusText() {
    return this.isLoginStatus === true ? 'ログイン中' : 'ログアウト中'
  }

  isNotUndefiend(value: any) {
    return (value !== null && value !== undefined) ? true : false
  }

  isSecureBlock(message: string) {
    return message === 'Missing or insufficient permissions.' ? true : false
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

.table
  &__list
    margin 0 auto
  &__key
    font-size 16px
    text-align center
    padding 8px
    word-break break-all

  &__value
    font-size 16px
    text-align right
    padding 8px
    word-break break-all

</style>