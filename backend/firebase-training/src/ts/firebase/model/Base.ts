import firebase from 'firebase/app'
import 'firebase/storage'

export class Base {
  /** ドキュメントフィールド */
  uid: string                               // ドキュメントID
  createdAt?: firebase.firestore.Timestamp  // 作成日
  updatedAt?: firebase.firestore.Timestamp  // 更新日

  /** property */
  isSaved: boolean = false

  /** Firestore */
  path: string
  collectionName: string
  version: string = '4'
  db: firebase.firestore.Firestore
  collectionRef: firebase.firestore.CollectionReference
  documentRef: firebase.firestore.DocumentReference
  storage: firebase.storage.Storage

  constructor(collectionName: string, id: string | null = null) {
    this.db = firebase.firestore()
    this.collectionName = collectionName
    this.path = `version/${this.version}/${this.collectionName}`
    this.collectionRef = this.db.collection(this.path)
    this.storage = firebase.storage()
    if (id !== null) {
      this.uid = id
    } else {
      this.uid = this.collectionRef.doc().id
    }
    console.log(this.uid)
    this.documentRef = this.collectionRef.doc(this.uid)
  }

  /** Firestore 取得 */
  async get() {
    try {
      const snapshot: firebase.firestore.DocumentSnapshot = await this.documentRef.get()
      this.setProperty(snapshot)
    } catch (error) {
      throw error
    }
  }

  /** Firestore 削除 */
  async delete() {
    try {
      const batch: firebase.firestore.WriteBatch = this.db.batch()
      batch.delete(this.documentRef)
      await batch.commit()
      this.clear()
    } catch (error) {
      throw error
    }
  }

  /** モデルクラスの内部プロパティへセットする */
  protected setProperty(snapshot: firebase.firestore.DocumentSnapshot) {
    this.uid = snapshot.id
    if (snapshot.exists) {
      const data = snapshot.data()
      if (data !== undefined) {
        this.createdAt = 'createdAt' in data ? data.createdAt : undefined
        this.updatedAt = 'updatedAt' in data ? data.updatedAt : undefined
        this.isSaved = true
      }
    }
  }

  /** 保存するデータをまとめる */
  protected pack(isUpdate: boolean = false): any {
    const item: any = {}
    // 作成日と更新日
    const date = firebase.firestore.Timestamp.fromDate(new Date())
    if (isUpdate) {
      this.updatedAt = date
      if (this.updatedAt !== undefined) {
        item.updatedAt = date
      }
    } else {
      this.createdAt = date
      this.updatedAt = date
      if (this.isSaved !== true) {
        if (this.createdAt !== undefined) {
          item.createdAt = date
        }
      }
      if (this.updatedAt !== undefined) {
        item.updatedAt = date
      }
    }
    return item
  }

  /** モデルクラスの内部プロパティを初期化する */
  protected clear() {
    this.isSaved = false
    this.createdAt = undefined
    this.updatedAt = undefined
  }
}
