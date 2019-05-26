<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>セキュリティルールの利用（操作、ファイル容量、拡張子の許容制御）</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-flex>
              <h3>ログイン状態</h3>
              <v-flex style="margin: 8px">
                <p>{{ loginStatusText}}</p>
              </v-flex>
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
            <v-flex style="margin: 8px;">
              <h3>ファイル名</h3>
              <v-flex style="margin: 8px;">
                <p v-if="user!==null&&user.image!==undefined">{{ user.image.name }}</p>
              </v-flex>
              <v-flex class="upload-img-container">
                <img class="uploaded-img" :src="imageData" />
              </v-flex>
              <v-flex style="margin-top: 8px;">
                <input type="file" @change="onFileChange" />
              </v-flex>
              <v-flex style="margin: 20px 0px;">
                <h3>メッセージ</h3>
                <p style="margin: 10px;" v-html="message"/>
              </v-flex>
            </v-flex>
            <v-flex style="margin-top: 36px;">
              <v-btn
                @click="onRegist"
                :loading="isLoading"
                color="blue"
                class="white--text">
                アップロード
              </v-btn>
              <v-btn
                @click="onDownload"
                :loading="isLoading"
                color="green"
                class="white--text">
                ダウンロード
              </v-btn>
              <v-btn
                @click="onDelete"
                :loading="isLoading"
                color="red"
                class="white--text">
                削除
              </v-btn>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase, { FirebaseError } from 'firebase/app'
import 'firebase/storage'
import { User } from '@/ts/firebase/model/User'

/** ファイル操作で扱うデータをinterfaceで定義して扱いやすくする */
import { FileInfo } from '@/ts/interface/FileInfo'

@Component({
  name: 'ImageOperationSecurePage',
})

export default class ImageOperationSecurePage extends Vue {

  isLoading: boolean = false
  message: string = ''
  isLoginStatus: boolean | null = null

  /**
   * [ログイン用]
   * メールとパスワードとログイン結果
   */
  loginEmail: string = ''
  loginPassword: string = ''
  loginResultMessage: string = ''
  isLoginShowPassword: boolean = false

  /** モデルクラス */
  user: User | null = null

  /**
   * ファイル
   * data: 画像のバイナリデータ
   * file: Cloud Storageへのアップロードするデータ
   * url: Cloud StorageからダウンロードしたデータのURL
   */
  fileInfo: FileInfo = { data: null, file: null, url: null, isDownloaded: false }

  mounted() {
    this.onAuthState()
  }

  /** 認証状態を監視する */
  onAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.isLoginStatus = true
        console.log('user', user.uid)
        this.configure(user.uid)
      } else {
        this.isLoginStatus = false
      }
    })
  }

  /** 初期処理 */
  async configure(uid: string) {
    try {
      this.user = new User('user', uid)
      await this.user.get()
      if (this.user.image !== undefined && this.user.image.url !== null) {
        this.fileInfo.url = this.user.image.url
        this.fileInfo.isDownloaded = true
      }
    } catch (error) {
      console.error(error)
    }
  }

  get imageData() {
    return this.fileInfo.data !== null ? this.fileInfo.data : this.fileInfo.url
  }

  get loginStatusText() {
    return this.isLoginStatus === true ? 'ログイン中' : 'ログアウト中'
  }

  /** 画像選択時の処理 */
  onFileChange(e: Event) {
    const event = (e.target as any) as HTMLInputElement
    const files = event.files

    // キャンセルした場合
    const isCancelEvent = !files || files.length === 0
    if (isCancelEvent) {
      return
    }
    if (files != null) {
      this.createImage(files[0])
    }
  }

  createImage(file: File) {
    const reader = new FileReader()
    // FileReaderにresultが無いためany型で処理する
    reader.onload = (e: any) => {
      this.fileInfo.data = e.target.result
    }
    // fileをdataURIとしてブラウザ上へ読み込む
    reader.readAsDataURL(file)
    this.fileInfo.file = file
  }

  /** アップロード */
  async onRegist() {
    this.isLoading = true
    this.message = ''
    if (this.fileInfo.file !== null) {
      await this.uploadFile(this.fileInfo.file)
    } else {
      this.message = '新しいファイルを選択してください。'
    }
    this.isLoading = false
  }

  /** ダウンロード */
  async onDownload() {
    this.isLoading = true
    this.message = ''
    await this.downloadFile()
    this.isLoading = false
  }

  /** 削除 */
  async onDelete() {
    this.isLoading = true
    this.message = ''
    console.log(this.fileInfo)
    if (this.fileInfo.isDownloaded === true) {
      await this.deleteFile()
    }
    this.clear()
    this.isLoading = false
  }

  /** ファイルのアップロード */
  async uploadFile(file: File) {
    try {
      if (this.user !== null) {
        await this.user.uploadFile(file)
      } else {
        console.log('user is null')
      }
    } catch (error) {
      console.error(error)
      this.message = error
    }
  }

  /** ファイルのダウンロード */
  async downloadFile() {
    try {
      if (this.user !== null) {
        await this.user.downloadFile()
        if (this.user.image !== undefined && this.user.image.url !== null) {
          this.clear()
          this.fileInfo.url = this.user.image.url
          this.fileInfo.isDownloaded = true
        }
      } else {
        console.log('user is null')
      }
    } catch (error) {
      console.error(error)
      this.message = error
    }
  }

  /** ファイルの削除 */
  async deleteFile() {
     try {
      if (this.user !== null) {
        await this.user.deleteFile()
      } else {
        console.log('user is null')
      }
    } catch (error) {
      console.error(error)
      this.message = error
    }
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

  clear() {
    this.fileInfo = { data: null, file: null, url: null, isDownloaded: false }
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

.upload-img-container
  width 100%
  height 300px
  border-radius 2px
  border solid 1px #ddd
  cursor pointer

.upload-img-container.upload-img-container--dashed
  border 2px dashed #ddd

img.uploaded-img
  margin auto
  width 100%
  height 100%
  object-fit cover
  border-radius 2px
</style>