import firebase from 'firebase/app'
import 'firebase/storage'

export class Base {
  /** DocumentID */
  uid: string

  /** Firestore */
  path: string
  collectionName: string
  version: string = '4'
  db: firebase.firestore.Firestore
  collection: firebase.firestore.CollectionReference
  ref: firebase.firestore.DocumentReference
  batch: firebase.firestore.WriteBatch
  storage: firebase.storage.Storage

  constructor(collectionName: string, id: string | null = null) {
    this.db = firebase.firestore()
    this.collectionName = collectionName
    this.path = `version/${this.version}/${this.collectionName}`
    this.collection = this.db.collection(this.path)
    this.batch = this.db.batch()
    this.storage = firebase.storage()
    if (id !== null) {
      this.uid = id
    } else {
      this.uid = this.collection.doc().id
    }
    console.log(this.uid)
    this.ref = this.collection.doc(this.uid)
  }
}
