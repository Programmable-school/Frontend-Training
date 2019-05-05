<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>画像の保存、取得、削除</h2>
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

/** ファイル操作で扱うデータをinterfaceで定義して扱いやすくする */
import { FileInfo } from './FileInfo'

@Component({
  name: 'ImageOperationPage',
})

export default class ImageOperationPage extends Vue {
  /** ローディングフラグ */
  isLoading: boolean = false

  /**
   * ファイル
   * data: 画像のバイナリデータ
   * file: Cloud Storageへのアップロードするデータ
   * url: Cloud StorageからダウンロードしたデータのURL
   */
  fileInfo: FileInfo = { data: null, file: null, url: null, isDownloaded: false }

  /** CloudStorageの保存先パス */
  storagePath: string = '/version/1/folder/'

  mounted() {
    this.getItems()
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
      await this.downloadFile()
    } else {
      console.log('imageUrl is not data:image')
    }
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

  /** 取得 */
  async getItems() {
    this.isLoading = true
    this.fileInfo.url = await this.downloadFile()
    if (this.fileInfo.url !== undefined) {
      this.fileInfo.isDownloaded = true
    }
    this.isLoading = false
  }

  /** ファイルのアップロード */
  async uploadFile(file: File) {
    try {
      console.log('uploadFile', file)
      const filename: string = 'filename'
      const path: string = this.storagePath + filename
      const storage: firebase.storage.Storage = firebase.storage()
      const ref = storage.ref().child(path)
      /** BlobまたはFile型でアップロードする */
      return await ref.put(file)
    } catch (error) {
      console.error(error)
    }
  }

  /** ファイルのダウンロード */
  async downloadFile() {
    try {
      const filename: string = 'filename'
      const path: string = this.storagePath + filename
      const storage: firebase.storage.Storage = firebase.storage()
      const ref = storage.ref(path)
      /** ファイルが無い場合は404のエラーになるが、今は気にしなくて良い */
      const url = await ref.getDownloadURL()
      console.log('download finish.')
      return url
    } catch (error) {
      console.error(error)
    }
  }

  /** ファイルの削除 */
  async deleteFile() {
     try {
      const filename: string = 'filename'
      const path: string = this.storagePath + filename
      const storage: firebase.storage.Storage = firebase.storage()
      const ref = storage.ref().child(path)
      await ref.delete()
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