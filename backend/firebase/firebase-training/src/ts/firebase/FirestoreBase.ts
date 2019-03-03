import firebase from 'firebase/app'
import 'reflect-metadata'

/**
 * Reflect
 */
const propertyMetadataKey = Symbol('property')

/**
 * Type
 */
type DocumentData = { createdAt: firebase.firestore.Timestamp, updatedAt: firebase.firestore.Timestamp } | { [key: string]: any } | firebase.firestore.DocumentData
type DateType = 'createdAt' | 'updatedAt'

const property = <T extends FirebaseBase>(target: T, propertyKey: string) => {
  const properties = Reflect.getMetadata(propertyMetadataKey, target) || []
  properties.push(propertyKey)
  Reflect.defineMetadata(propertyMetadataKey, properties, target)
}

class FirebaseBase {
  /**
   * static
   */
  public static logTag: string = 'FirebaseBase'

  /**
   * request to firestore static methods
   */
  public static async getDataSource(modelName: string, version: number = 1) {
    console.log('getDataSource')
    const firestore = firebase.firestore()
  }

  /**
   * public
   */
  /** コレクションドキュメント情報 */
  public version: number = 1
  public modelName: string
  public path: string

  /** 必須フィールド */
  public id?: string = undefined
  public createdAt!: firebase.firestore.Timestamp
  public updatedAt!: firebase.firestore.Timestamp

  /** firestore */
  public firestore: firebase.firestore.Firestore = firebase.firestore()
  public batch: firebase.firestore.WriteBatch = this.firestore.batch()
  public collection?: firebase.firestore.CollectionReference

  /**
   * private
   */
  private prop: { [key: string]: any } = {}

  constructor(modelName: string) {
    this.modelName = modelName
    this.path = `version/${this.version}/${this.modelName}`
  }

  /**
   * set methods
   */
  public setPath() {
    this.path = `version/${this.version}/${this.modelName}`
  }

  public setModelName(modelName: string) {
    this.modelName = modelName
  }

  /**
   * get methods
   */
  public getPath(): string {
    return `version/${this.version}/${this.modelName}`
  }

  public getCollection(): firebase.firestore.CollectionReference {
    return this.firestore.collection(this.getPath())
  }

  public getDocument(id: string): firebase.firestore.DocumentReference {
    return this.firestore.collection(this.getPath()).doc(id)
  }

  /**
   * request to firestore methods
   */
  public async get(id: string) {
    console.log('get', id, this.getDocument(id).path)
    try {
      const item: firebase.firestore.DocumentSnapshot = await this.getDocument(id).get()
      this.scrapingModelField(item)
    } catch (error) {
      throw error
    }
  }

  public async save() {
    console.log('save')
  }

  public async update() {
    console.log('update')
  }

  public async delete() {
    console.log('delete')
  }

  /**
   * private methods
   */
  private scrapingModelField(snapshot: firebase.firestore.DocumentSnapshot) {
    if (snapshot.exists) {
      const data: firebase.firestore.DocumentData = snapshot.data()!
      console.log('data', data)
      /**
       * 継承している子クラスのプロパティを取得してデータをセットする
       */

      /** property修飾子を付与したパラメータへデータセット */
      const properties: string[] = Reflect.getMetadata(propertyMetadataKey, this) || []
      properties.forEach((prop) => {
        console.log(prop)
        const key: (keyof DocumentData) = prop as (keyof DocumentData)
        const value = data.key
        this.defineProperty(key, value)
      })

      /** 日付 */
      const keys = Object.keys(data)
      if (keys.includes('createdAt')) {
        const value = data.createdAt
        this.defineProperty('createdAt', value)
      }
      if (keys.includes('updatedAt')) {
        const value = data.updatedAt
        this.defineProperty('updatedAt', value)
      }

    } else {
      console.log(FirebaseBase.logTag, `item is not exist. id: ${snapshot.id}`)
      return undefined
    }
  }

  private defineProperty<T extends keyof ThisType<this>>(key: T | DateType, value?: any) {
    const descriptor: PropertyDescriptor = {
      enumerable: true,
      configurable: true,
      get: () => {
          return this.prop[key]
      },
      set: (newValue) => {
          this.prop[key] = newValue
      },
    }
    Object.defineProperty(this, key, descriptor)
}

}

export { FirebaseBase, property }
