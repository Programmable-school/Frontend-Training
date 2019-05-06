import firebase from 'firebase/app'
import 'firebase/storage'
import StorageFile from './StorageFile'
import { Base } from './Base'

export class User extends Base {
  name?: string
  image?: StorageFile
  createdAt?: Date
  updatedAt?: Date

  constructor(id: string | null = null) {
    /**
     * 本来であればclass名とコレクション名は同じにすることを推奨するが
     * レッスン用としてコレクション名はuserpracticeにする
     */
    super('userpractice', id)
  }

  /** Firestore 保存 */
  async save() {
    try {
      const item = this.pack()
      this.batch.set(this.ref, item, { merge: true })
      await this.batch.commit()
    } catch (error) {
      throw error
    }
  }

  /** Firestore 更新 */
  async update() {
    try {
      const item = this.pack(true)
      this.batch.set(this.ref, item, { merge: true })
      await this.batch.commit()
    } catch (error) {
      throw error
    }
  }

  /** Firestore 取得 */
  async get() {
    try {
      const item: firebase.firestore.DocumentSnapshot  = await this.ref.get()
      if (item.exists) {
        const data = item.data()
        console.log(data)
        this.uid = item.id
        if (data !== undefined) {
          this.name = 'name' in data ? data.name : undefined
          this.image = 'image' in data ? data.image : undefined
          this.createdAt = 'createdAt' in data ? data.createdAt : undefined
          this.updatedAt = 'updatedAt' in data ? data.updatedAt : undefined
        }
      }
    } catch (error) {
      throw error
    }
  }

  /** Firestore 削除 */
  async delete() {
    try {
      this.batch.delete(this.ref)
      await this.batch.commit()
      this.clear()
    } catch (error) {
      throw error
    }
  }

  /** Cloud Storage 保存 */
  async uploadFile(file: File, filename: string = 'filename') {
    try {
      const storagePath: string = `${this.path}/${this.uid}/${filename}`
      const ref = this.storage.ref().child(storagePath)
      const result = await ref.put(file)
      const downloadUrl = await ref.getDownloadURL()
      const meta = result.metadata
      console.log(result, meta)
      this.image = {
        name: filename,
        url: downloadUrl,
        fileType: meta.contentType !== null && meta.contentType !== undefined ? meta.contentType : '',
      }
      this.batch.set(this.ref, {
        image: this.image,
        updatedAt: new Date(),
      }, { merge: true })
      await this.batch.commit()
    } catch (error) {
      throw error
    }
  }

  /** Cloud Storage 削除 */
  async deleteFile(filename: string = 'filename') {
    try {
      const storagePath: string = this.path + filename
      const ref = this.storage.ref().child(storagePath)
      await ref.delete()
      this.batch.set(this.ref, {
        image: firebase.firestore.FieldValue.delete(),
        updatedAt: new Date(),
      }, { merge: true })
      await this.batch.commit()
      this.image = undefined
    } catch (error) {
      throw error
    }
  }

  /** 保存するデータをまとめる */
  private pack(isUpdate: boolean = false): any {
    const item: any = {}

    // データ
    item.uid = this.uid
    if (this.name !== undefined) {
      item.name = this.name
    }
    if (this.image !== undefined) {
      item.image = this.image
    }

    // 作成日と更新日
    const date = new Date()
    if (isUpdate) {
      this.updatedAt = date
      if (this.updatedAt !== undefined) {
        item.updatedAt = this.updatedAt
      }
    } else {
      this.createdAt = date
      this.updatedAt = date
      if (this.createdAt !== undefined) {
        item.createdAt = this.createdAt
      }
      if (this.updatedAt !== undefined) {
        item.updatedAt = this.updatedAt
      }
    }
    return item
  }

  /** 内部プロパティを初期化する */
  private clear() {
    this.name = undefined
    this.image = undefined
    this.createdAt = undefined
    this.updatedAt = undefined
  }

}
