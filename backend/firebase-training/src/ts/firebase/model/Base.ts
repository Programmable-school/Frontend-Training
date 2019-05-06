import firebase from 'firebase/app'
import 'firebase/storage'

export class Base {
  /** ドキュメントフィールド */
  uid: string       // ドキュメントID
  createdAt?: Date  // 作成日
  updatedAt?: Date  // 更新日

  /** property */
  isSaved: boolean = false

  /** Firestore */
  path: string
  collectionName: string
  version: string = '4'
  db: firebase.firestore.Firestore
  collection: firebase.firestore.CollectionReference
  ref: firebase.firestore.DocumentReference
  storage: firebase.storage.Storage

  constructor(collectionName: string, id: string | null = null) {
    this.db = firebase.firestore()
    this.collectionName = collectionName
    this.path = `version/${this.version}/${this.collectionName}`
    this.collection = this.db.collection(this.path)
    this.storage = firebase.storage()
    if (id !== null) {
      this.uid = id
    } else {
      this.uid = this.collection.doc().id
    }
    console.log(this.uid)
    this.ref = this.collection.doc(this.uid)
  }

  protected clear() {
    this.isSaved = false
    this.createdAt = undefined
    this.updatedAt = undefined
  }
}
