import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as router from './router'
import * as authRouter from './auth_router'
import UserController from './controller/UserController'
import Result from './Result'

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send('Hello World')
})

export const requestTest = functions.https.onRequest((request, response) => {
  console.log('method', request.method, 'content-type', request.headers['content-type'])
  const resultParam: any = { message: '' }
  let responseCode: number = 200
  try {
    const data = request.body
    const id: string = data !== undefined && 'id' in data ? data.id : undefined
    if (request.method === 'GET') {
      resultParam.message = 'Request method is GET'
    } else if (request.method === 'POST') {
      resultParam.message = `Request method is POST. body is ${id}`
    } else if (request.method === 'PUT') {
      resultParam.message = 'Request method is PUT'
    } else if (request.method === 'DELETE') {
      resultParam.message = 'Request method is DELETE'
    }
  } catch (error) {
    responseCode = 500
    resultParam.message = error.message
  }
  response.status(responseCode).send({ code: responseCode, result: resultParam })
})

/** 
 * express API 
 * */
export const api = router.api


/** 
 * trigger API 
 * */
/** ドキュメント作成時に発火 */
export const createUser = functions.region('asia-northeast1').firestore
  .document(UserController.wildPath)
  .onCreate((snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
    console.log('onCreate context', context)
    console.log('snapshot', snapshot)
    return true
  })

/** ドキュメント更新時に発火 */
export const updateUser = functions.region('asia-northeast1').firestore
  .document(UserController.wildPath)
  .onUpdate((change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {
    console.log('onUpdate context', context)
    console.log('change before', change.before)
    console.log('change after', change.after)
    return true
  })

/** ドキュメント削除時に発火 */
export const deleteUser = functions.region('asia-northeast1').firestore
  .document(UserController.wildPath)
  .onDelete((snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
    console.log('onDelete context', context)
    console.log('snapshot', snapshot)
    return true
  })

/** 
 * secure API 
 * */
export const authHelloWorld = functions.https.onCall((data: any, context: functions.https.CallableContext) => {
  console.log('context')
  const response: Result = {
    code: 200,
    message: 'Hello World',
    data: {
      data: data,
      context: context
    }
  }
  return response
})

export const authApi = authRouter.authApi