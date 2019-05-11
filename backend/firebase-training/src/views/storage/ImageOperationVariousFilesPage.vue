<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>様々な形式のファイルを扱う</h2>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-flex>
              <v-flex style="margin-top: 8px;">
                <input type="file" @change="onFileChange" />
              </v-flex>
              <v-flex>
                <p style="color: red;">{{ message }}</p>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
        <v-flex>
          <v-btn
            @click="onRegist"
            :loading="isLoading"
            color="blue"
            class="white--text">
            アップロード
          </v-btn>
          <v-btn
            @click="onReload"
            :loading="isLoading"
            color="green"
            class="white--text">
            読み込み
          </v-btn>
          <v-btn
            @click="onDelete"
            :loading="isLoading"
            color="red"
            class="white--text">
            全てを削除
          </v-btn>
          <v-flex style="margin: 24px;">
            <h3>ファイル一覧</h3>
            <v-data-table
              :headers="headers"
              :items="items"
              :pagination.sync="pagination"
              no-data-text="">
              <template 
                slot="items"
                slot-scope="props">
                <tr @click="onClick(props.item)">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.size | sizeFormat }}</td>
                  <td>{{ props.item.fileType }}</td>
                </tr>
              </template>
            </v-data-table>
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
import { UserStorage } from '@/ts/firebase/model/UserStorage'
import StorageDetailFile from '@/ts/firebase/model/StorageDetailFile'

/** ファイル操作で扱うデータをinterfaceで定義して扱いやすくする */
import { FileInfo } from '@/ts/interface/FileInfo'
import { format } from 'date-fns'

@Component({
  name: 'ImageOperationVariousFilesPage',
  filters: {
    sizeFormat(size: number) {
      const byte: number = 1024
      const mByte: number = Math.pow(byte, 2)
      const gByte: number = Math.pow(byte, 3)
      let target: number = 0
      let unit: string = ''
      if (size >= gByte) {
        target = gByte
        unit = 'GB'
      } else if (size >= mByte) {
        target = mByte
        unit = 'MB'
      } else {
        target = byte
        unit = 'KB'
      }
      const newSize = Math.round((size / target) * 100) / 100
      return `${String(newSize).replace(/(\d)(?=(\d\d\d)+$)/g, '$1,')} ${unit}`
    },
  },
})

export default class ImageOperationVariousFilesPage extends Vue {

  isLoading: boolean = false
  message: string = ''

  /** モデルクラス */
  userStorage: UserStorage | null = null

  /** リスト */
  selectRowsPerPage: number = 5
  selectItem: any = undefined
  headers: any[] = [
    { text: 'filename', value: 'name' },
    { text: 'size', value: 'size' },
    { text: 'fileType', value: 'fileType' },
  ]
  pagination: any = {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: this.selectRowsPerPage,
  }
  items: StorageDetailFile[] = []

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
      this.userStorage = new UserStorage('userstorage', 'user1')
      await this.getItems()
    } catch (error) {
      console.error(error)
    }
  }

  async getItems() {
    if (this.userStorage !== null) {
      this.items = await this.userStorage.downloadFiles()
      console.log(this.items)
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
      await this.getItems()
    } else {
      this.message = '新しいファイルを選択してください。'
    }
    this.isLoading = false
  }

  /** リストを読み込む */
  async onReload() {
    this.isLoading = true
    await this.getItems()
    this.isLoading = false
  }

  /** 削除 */
  async onDelete() {
    this.isLoading = true
    this.message = ''
    await this.deleteFile()
    await this.getItems()
    this.isLoading = false
  }

  /** ファイルのアップロード */
  async uploadFile(file: File) {
    try {
      if (this.userStorage !== null) {
        await this.userStorage.uploadFile(file, file.name)
      } else {
        console.log('user is null')
      }
    } catch (error) {
      console.error(error)
    }
  }

  /** ファイルのダウンロード */
  async downloadFile(item: StorageDetailFile) {
    try {
      if (item.name !== null && item.url !== null) {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = (event) => {
          console.log(event)
          const blob = xhr.response
          const a = document.createElement('a')
          a.download = item.name!
          a.href = URL.createObjectURL(blob)
          a.click()
        }
        xhr.open('GET', item.url)
        xhr.send()
      }
    } catch (error) {
      console.error(error)
    }
  }

  /** ファイルの削除 */
  async deleteFile() {
     try {
      if (this.userStorage !== null) {
        await this.userStorage.deleteAllFiles()
      } else {
        console.log('userStorage is null')
      }
    } catch (error) {
      console.error(error)
    }
  }

  /** データリストを要素をクリック処理 */
  onClick(item: StorageDetailFile) {
    console.log(item)
    this.downloadFile(item)
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

</style>