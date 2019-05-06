<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>Firestoreとの連携</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-flex>
              <v-flex class="upload-img-container">
                <img class="uploaded-img" :src="getImage" />
              </v-flex>
              <v-flex style="margin-top: 8px;">
                <input type="file" @change="onFileChange" />
              </v-flex>
            </v-flex>
            <v-flex style="margin-top: 52px;">
              <v-btn
                @click="onRegist"
                :loading="isLoading"
                color="blue"
                class="white--text">
                保存
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
import { User } from './model/User'

/** ファイル操作で扱うデータをinterfaceで定義して扱いやすくする */
import { FileInfo } from './FileInfo'

@Component({
  name: 'ImageOperationFirestorePage',
})

export default class ImageOperationFirestorePage extends Vue {
  /** ローディングフラグ */
  isLoading: boolean = false

  user: User | null = null
  /**
   * ファイル
   * data: 画像のバイナリデータ
   * file: Cloud Storageへのアップロードするデータ
   * url: Cloud StorageからダウンロードしたデータのURL
   */
  fileInfo: FileInfo = { data: null, file: null, url: null, isDownloaded: false }

  /** CloudStorageの保存先パス */
  storagePath: string = '/version/1/folder/'

  async mounted() {
    await this.configure()
  }

  /** 初期処理 */
  async configure() {
    try {
      this.user = new User('storage_lesson_user')
      await this.user.get()
      if (this.user.image !== undefined && this.user.image.url !== null) {
        this.fileInfo.url = this.user.image.url
        this.fileInfo.isDownloaded = true
      }
    } catch (error) {
      console.error(error)
    }
  }

  get getImage() {
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

  /** 登録 */
  async onRegist() {
    this.isLoading = true
    if (this.fileInfo.file !== null) {
      await this.uploadFile(this.fileInfo.file)
    } else {
      console.log('imageUrl is not data:image')
    }
    const user = new User()
    user.name = 'aiueo'
    await user.save()
    this.isLoading = false
  }

  /** 削除 */
  async onDelete() {
    this.isLoading = true
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