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
                  <td>{{ props.item.uid }}</td>
                  <td>{{ props.item.filename }}</td>
                  <td>{{ props.item.fileType }}</td>
                  <td>{{ props.item.createdAt.toDate() | dateFormat }}</td>
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

/** ファイル操作で扱うデータをinterfaceで定義して扱いやすくする */
import { FileInfo } from '@/ts/interface/FileInfo'
import { format } from 'date-fns'

@Component({
  name: 'ImageOperationVariousFilesPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
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
    { text: 'filename', value: 'filename' },
    { text: 'fileType', value: 'fileType' },
    { text: 'createdAt', value: 'createdAt' },
  ]
  pagination: any = {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: this.selectRowsPerPage,
  }
  items: any[] = []

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
      const files = await this.userStorage.downloadFiles()
      console.log(files)
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

  /** リストを読み込む */
  async onReload() {
    this.isLoading = true
    await this.getItems()
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
    await this.deleteFile()
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
  async downloadFile() {
    try {
      if (this.userStorage !== null) {
        await this.userStorage.downloadFiles()
      } else {
        console.log('userStorage is null')
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
  onClick(item: any) {
    console.log(item)
    this.selectItem = item
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