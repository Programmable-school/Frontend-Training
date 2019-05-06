import firebase from 'firebase/app'
import 'firebase/storage'
import StorageFile from './StorageFile'
import { Base } from './Base'

export class User extends Base {
  /** ドキュメントフィールド */
  name?: string
  image?: StorageFile

  constructor(collectionName: string = 'user', id: string | null = null) {
    console.log(collectionName, id)
    super(collectionName, id)
  }

  /** Firestore 保存 */
  async save() {
    try {
      const item = this.pack()
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      batch.set(this.ref, item, { merge: true })
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
      batch.set(this.ref, item, { merge: true })
      await batch.commit()
      this.isSaved = true
    } catch (error) {
      throw error
    }
  }

  /** Firestore 取得 */
  async get() {
    try {
      const snapshot: firebase.firestore.DocumentSnapshot = await this.ref.get()
      this.setProperty(snapshot)
    } catch (error) {
      throw error
    }
  }

  /** Firestore 削除 */
  async delete() {
    try {
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      batch.delete(this.ref)
      await batch.commit()
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
      await this.save()
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
      batch.set(this.ref, {
        image: firebase.firestore.FieldValue.delete(),
        updatedAt: new Date(),
      }, { merge: true })
      await batch.commit()
      this.image = undefined
    } catch (error) {
      throw error
    }
  }

  /** モデルクラスの内部プロパティを初期化する */
  protected clear() {
    super.clear()
    this.name = undefined
    this.image = undefined
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
      if (this.isSaved !== true) {
        this.createdAt = date
        if (this.createdAt !== undefined) {
          item.createdAt = this.createdAt
        }
      }
      this.updatedAt = date
      if (this.updatedAt !== undefined) {
        item.updatedAt = this.updatedAt
      }
    }
    return item
  }

  /** モデルクラスの内部プロパティへセットする */
  private setProperty(snapshot: firebase.firestore.DocumentSnapshot) {
    if (snapshot.exists) {
      const data = snapshot.data()
      console.log(data)
      this.uid = snapshot.id
      if (data !== undefined) {
        this.name = 'name' in data ? data.name : undefined
        this.image = 'image' in data ? data.image : undefined
        this.createdAt = 'createdAt' in data ? data.createdAt : undefined
        this.updatedAt = 'updatedAt' in data ? data.updatedAt : undefined
        this.isSaved = true
      }
    }
  }

}
