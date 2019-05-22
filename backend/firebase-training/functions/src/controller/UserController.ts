import Result from '../Result'
import { firestore } from 'firebase-admin'

export default class UserController {

  static path: string = 'version/5/user'
  static wildPath: string = `${UserController.path}/{userId}`

  async getUsers(): Promise<Result> {
    console.log('getUsers')
    const result: Result = { code: 200, message: 'Success' }
    try {
      const collection = firestore().collection(UserController.path)
      const snapshot = await collection.get()
      result.data = snapshot.docs.map((doc: any) => {
        const data = doc.data()
        if ('createdAt' in data) {
          data.createdAt = (data.createdAt as firestore.Timestamp).toDate()
        }
        if ('updatedAt' in data) {
          data.updatedAt = (data.updatedAt as firestore.Timestamp).toDate()
        }
        return data
      })
    } catch (error) {
      throw error
    }
    return result
  }

  async createUser(body: any): Promise<Result> {
    console.log('createUser')
    const result: Result = { code: 200, message: 'Success' }
    try {
      /** バリデーション */
      if (!('name' in body)) {
        throw new Error('Bad request body parameters.')
      }
      const name = body.name
      
      /** Firestore */
      const collection = firestore().collection(UserController.path)
      const id = collection.doc().id
      const document = collection.doc(id)
      const batch = firestore().batch()
      const dateAt = firestore.Timestamp.fromDate(new Date())
      const data = {
        uid: id,
        name: name,
        createdAt: dateAt,
        updatedAt: dateAt
      }
      batch.set(document, data, { merge: true })
      await batch.commit()
      result.data = data
    } catch (error) {
      throw error
    }
    return result
  }

  async updateUser(body: any): Promise<Result> {
    console.log('updateUser')
    const result: Result = { code: 200, message: 'Success' }
    try {
      /** バリデーション */
      if (!('name' in body && 'id' in body)) {
        throw new Error('Bad request body parameters.')
      }
      const name = body.name
      const id = body.id
      
      /** Firestore */
      const collection = firestore().collection(UserController.path)
      const document = collection.doc(id)
      const batch = firestore().batch()
      const dateAt = firestore.Timestamp.fromDate(new Date())
      const data = {
        name: name,
        updatedAt: dateAt
      }
      batch.update(document, data)
      await batch.commit()
      result.data = data
    } catch (error) {
      throw error
    }
    return result
  }

  async deleteUser(body: any): Promise<Result> {
    console.log('updateUser')
    const result: Result = { code: 200, message: 'Success' }
    try {
      /** バリデーション */
      if (!('id' in body)) {
        throw new Error('Bad request body parameters.')
      }
      const id = body.id
      
      /** Firestore */
      const collection = firestore().collection(UserController.path)
      const document = collection.doc(id)
      const batch = firestore().batch()
      batch.delete(document)
      await batch.commit()
      result.data = { uid: id }
    } catch (error) {
      throw error
    }
    return result
  }
}