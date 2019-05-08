<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>Firestoreとの連携</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-flex v-if="user!==null">
              <h3>ファイル名</h3>
              <v-flex style="margin: 8px">
                <p v-if="user.image!==undefined">{{ user.image.name }}</p>
              </v-flex>
            </v-flex>
            <v-flex>
              <v-flex class="upload-img-container">
                <img class="uploaded-img" :src="imageData" />
              </v-flex>
              <v-flex style="margin-top: 8px;">
                <input type="file" @change="onFileChange" />
              </v-flex>
              <v-flex>
                <p style="color: red;">{{ message }}</p>
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
import firebase from 'firebase/app'
import 'firebase/storage'
import { User } from '@/ts/firebase/model/User'

/** ファイル操作で扱うデータをinterfaceで定義して扱いやすくする */
import { FileInfo } from '@/ts/interface/FileInfo'

@Component({
  name: 'ImageOperationFirestorePage',
})

export default class ImageOperationFirestorePage extends Vue {

  isLoading: boolean = false
  message: string = ''

  /** モデルクラス */
  user: User | null = null

  /**
   * ファイル
   * data: 画像のバイナリデータ
   * file: Cloud Storageへのアップロードするデータ
   * url: Cloud StorageからダウンロードしたデータのURL
   */
  fileInfo: FileInfo = { data: null, file: null, url: null, isDownloaded: false }

  async mounted() {
    await this.configure()
  }

  /** 初期処理 */
  async configure() {
    try {
      /**
       * 本来であればclass名とコレクション名は同じにすることを推奨するが
       * レッスン用としてコレクション名はuserpracticeにする
       */
      this.user = new User('userpractice', 'storage_lesson_user')
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