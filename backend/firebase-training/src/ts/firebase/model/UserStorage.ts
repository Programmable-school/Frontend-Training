import firebase from 'firebase/app'
import 'firebase/storage'
import StorageDetailFile from './StorageDetailFile'
import { Base } from './Base'

export class UserStorage extends Base {
  /** ドキュメントフィールド */
  files: StorageDetailFile[]

  constructor(collectionName: string = 'userstorage', id: string | null = null) {
    console.log(collectionName, id)
    super(collectionName, id)
    this.files = []
  }

  /** Firestore 保存 */
  async save() {
    try {
      const item = this.pack()
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      batch.set(this.documentRef, item, { merge: true })
      await batch.commit()
      this.isSaved = true
    } catch (error) {
      throw error
    }
  }

  /** Firestore 更新 */
  async update() {
    try {
      const item = this.pack(true)
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      batch.set(this.documentRef, item, { merge: true })
      await batch.commit()
      this.isSaved = true
    } catch (error) {
      throw error
    }
  }

  /**
   * Firestore 取得と削除は Base.ts で行う
   */

  /** Cloud Storage アップロード */
  async uploadFile(file: File, filename: string) {
    try {
      const storagePath: string = `${this.path}/${this.uid}/${filename}`
      const ref = this.storage.ref().child(storagePath)
      const result = await ref.put(file)
      const downloadUrl = await ref.getDownloadURL()
      const meta = result.metadata
      // console.log(result, meta)
      const fileInfo: StorageDetailFile = {
        name: filename,
        url: downloadUrl,
        fileType: meta.contentType !== null && meta.contentType !== undefined ? meta.contentType : '',
        size: meta.size,
      }
      const filters = this.files.filter((item: StorageDetailFile) => item.name === filename)
      if (filters.length === 0) {
        this.files.push(fileInfo)
      } else {
        filters[0] = fileInfo
      }
      await this.save()
    } catch (error) {
      throw error
    }
  }

  /** Cloud Storage ダウンロード */
  async downloadFiles(): Promise<StorageDetailFile[]> {
    try {
      await this.get()
      return this.files
    } catch (error) {
      throw error
    }
  }

  /** Cloud Storage 削除 */
  async deleteFile(filename: string = 'filename') {
    try {
      const storagePath: string = `${this.path}/${this.uid}/${filename}`
      const ref = this.storage.ref().child(storagePath)
      await ref.delete()
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      this.files = this.files.filter((file) => file.name !== filename)
      if (this.files.length === 0) {
        batch.set(this.documentRef, {
          files: firebase.firestore.FieldValue.delete(),
          updatedAt: new Date(),
        }, { merge: true })
      } else {
        batch.set(this.documentRef, {
          files: this.files,
          updatedAt: new Date(),
        }, { merge: true })
      }
      await batch.commit()
    } catch (error) {
      throw error
    }
  }

  async deleteAllFiles() {
    try {
      const storagePath: string = `${this.path}/${this.uid}`
      await this.files.forEach(async (file: StorageDetailFile) => {
        try {
          console.log(`${storagePath}/${file.name}`)
          await this.storage.ref().child(`${storagePath}/${file.name}`).delete()
        } catch (error) {
          throw error
        }
      })
      console.log('delete batch')
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      batch.set(this.documentRef, {
        files: firebase.firestore.FieldValue.delete(),
        updatedAt: new Date(),
      }, { merge: true })
      await batch.commit()
      this.files = []
    } catch (error) {
      throw error
    }
  }

  /** モデルクラスの内部プロパティへセットする */
  protected setProperty(snapshot: firebase.firestore.DocumentSnapshot) {
    super.setProperty(snapshot)
    if (snapshot.exists) {
      const data = snapshot.data()
      if (data !== undefined) {
        this.files = 'files' in data ? data.files : []
      }
    }
    console.log(this)
  }

  /** 保存するデータをまとめる */
  protected pack(isUpdate: boolean = false): any {
    const item: any = super.pack(isUpdate)
    // データ
    item.uid = this.uid
    if (this.files !== undefined) {
      item.files = this.files
    }
    return item
  }

  /** モデルクラスの内部プロパティを初期化する */
  protected clear() {
    super.clear()
    this.files = []
  }

}
