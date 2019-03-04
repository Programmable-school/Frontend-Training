import firebase from 'firebase/app'
import 'reflect-metadata'

/**
 * reflect
 */
const propertyMetadataKey = Symbol('property')

/**
 * type
 */
type DocumentData = { createdAt: firebase.firestore.Timestamp, updatedAt: firebase.firestore.Timestamp } | { [key: string]: any } | firebase.firestore.DocumentData
type DateType = 'createdAt' | 'updatedAt'

const property = <T extends FirebaseBase>(target: T, propertyKey: string) => {
  const properties = Reflect.getMetadata(propertyMetadataKey, target) || []
  properties.push(propertyKey)
  Reflect.defineMetadata(propertyMetadataKey, properties, target)
}

/**
 * log
 */
const LOG_TAG: string = 'FirebaseBase'

/**
 * enum
 */
enum BatchType {
  save,
  update,
  delete,
}

class FirebaseBase {
  /**
   * static
   */

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
  public id: string
  public createdAt!: firebase.firestore.Timestamp
  public updatedAt!: firebase.firestore.Timestamp

  /** firestore */
  public firestore: firebase.firestore.Firestore = firebase.firestore()
  public batch: firebase.firestore.WriteBatch = this.firestore.batch()
  public collection?: firebase.firestore.CollectionReference

  /** 状態 */
  public isSaved: boolean = false

  /**
   * private
   */
  private prop: { [key: string]: any } = {}

  constructor(modelName: string) {
    this.modelName = modelName
    this.path = `version/${this.version}/${this.modelName}`
    this.id = this.firestore.collection(this.path).doc().id
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

  public getProperties(): string[] {
    return Reflect.getMetadata(propertyMetadataKey, this) || []
  }

  /**
   * Firestoreからデータを取得する
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

  /**
   * Firestoreへデータを書き込む
   */
  public async save() {
    console.log('save')
    try {
      const bacth = this.pack(BatchType.save)
      await bacth.commit()
    } catch (error) {
      console.error(LOG_TAG, error)
    }
  }

  /**
   * Firestoreへデータを更新する
   */
  public async update() {
    console.log('update')
    try {
      const bacth = this.pack(BatchType.update)
      await bacth.commit()
    } catch (error) {
      console.error(LOG_TAG, error)
    }
  }

  public async delete() {
    console.log('delete')
    try {
      const bacth = this.pack(BatchType.delete)
      await bacth.commit()
    } catch (error) {
      console.error(LOG_TAG, error)
    }
  }

  /**
   * 継承しているモデルクラスのvalueを取得して{key: value}形式のデータを取得する
   * key: プロパティ名
   * value: プロパティのデータ
   */
  public rawValue(): any {
    /**
     * getPropertiesを用いてpropery修飾子が付与されているプロパティ名を取得し、
     * getOwnPropertyDescriptorを用いて該当するプロパティ名のvalueを取得して{ key: value }形式のデータにする
     */
    const properties = this.getProperties()
    const values: any = {}
    for (const key of properties) {
        const descriptor = Object.getOwnPropertyDescriptor(this, key)
        if (descriptor) {
            if (descriptor.value) {
                const value = descriptor.value
                console.log(LOG_TAG, 'descriptor.value', value)
                if (!this.isUndefined(value)) {
                    if (value instanceof Date) {
                        console.log(LOG_TAG, 'Date type is not support.')
                    } else {
                        values[key] = value
                    }
                }
            }
        }
    }
    return values
  }


  /**
   * Batchにリクエストするデータをセットする
   */
  private pack(type: BatchType): firebase.firestore.WriteBatch {
    const writeBatch = this.firestore.batch()
    const documentRef = this.getDocument(this.id)
    switch (type) {
      case BatchType.save:
        const value = this._value()
        console.log(LOG_TAG, 'value', value)
        writeBatch.set(documentRef, value, { merge: true })
        return writeBatch
      case BatchType.update:
        /**
         * updateではなくsetのoptionにMergeをつけて変更のあるフィールドだけ更新するようにする
         */
        writeBatch.set(documentRef, this._value(), { merge: true })
        return writeBatch
      case BatchType.delete:
        writeBatch.delete(documentRef)
        return writeBatch
    }
  }

  /**
   * private methods
   */
  private _value(): DocumentData {
    const values: DocumentData = this.rawValue()
    if (this.isSaved) {
        const updatedAt: (keyof DocumentData) = 'updatedAt'
        values[updatedAt] = firebase.firestore.FieldValue.serverTimestamp()
    } else {
        const updatedAt: (keyof DocumentData) = 'updatedAt'
        const createdAt: (keyof DocumentData) = 'createdAt'
        values[updatedAt] = this.updatedAt || firebase.firestore.FieldValue.serverTimestamp()
        values[createdAt] = this.updatedAt || firebase.firestore.FieldValue.serverTimestamp()
    }
    return values
  }

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
      /**
       * Object.keysを使ってdataからkeyを取得する
       */
      const keys = Object.keys(data)
      console.log(LOG_TAG, 'keys', keys)
      if (keys.includes('createdAt')) {
        const value = data.createdAt
        this.defineProperty('createdAt', value)
      }
      if (keys.includes('updatedAt')) {
        const value = data.updatedAt
        this.defineProperty('updatedAt', value)
      }
      console.log(LOG_TAG, 'prop', this.prop)

    } else {
      console.log(LOG_TAG, `item is not exist. id: ${snapshot.id}`)
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

  private isUndefined(value: any): boolean {
    return (value === null || value === undefined)
  }

}

export { FirebaseBase, property }
