import * as functions from 'firebase-functions'
import * as express from 'express'
import * as corsLib from 'cors'
import UserController from './controller/UserController'
import Result from './Result'
import * as admin from 'firebase-admin'

const app = express()
const cors = corsLib()
const router = express.Router()
router.use(async (request, response, next) => {
	return await cors(request, response, async () => {
    /** 
     * クライアントから送られてきたアクセストークンとFirebase Authorizationのアクセストークンを比較する
     * 誤ったアクセストークンであればエラーで返す。
     *  */
    try {
      const verify = await admin.auth().verifyIdToken(request.headers.authorization!)
      console.log('auth ok', verify.uid)
      next()
    } catch (error) {
      const result: Result = { code: 400, message: 'Bad authorization', error: error }
      response.status(result.code).send(result)
    }
	})
})

/** /v1/helloWorld を指定して利用できる */
router.use('/helloWorld', (request, response) => {
  console.log(request.method)
  response.status(200).send('HelloWorld')
})

/** /v1/item を指定して利用できる */
router.use('/item', (request, response) => {
  const item: { id: number, message: string, postData: any } = {
    id: 0, message: 'item', postData: undefined
  }
  if (request.method === 'POST') {
    item.postData = request.body !== undefined && 'data' in request.body ? request.body['data'] : undefined
  }
  response.status(200).send(item)
})

/** /v1/page/1 を指定して利用できる */
router.use('/page/:id', (request, response) => {
  const item: { id: number | undefined, message: string } = {
    id: undefined, message: 'page'
  }
  if (request.method === 'GET') {
    item.id = Number(request.params.id)
  }
  response.status(200).send(item)
})

/** /v1/user を指定して利用できる */
router.use('/user', async (request, response) => {
  let result: Result = { code: 200, message: '' }
  try {
    if (request.method === 'GET') {
      result = await new UserController().getUsers()
    } else if (request.method === 'POST') {
      result = await new UserController().createUser(request.body)
    } else if (request.method === 'PUT') {
      result = await new UserController().updateUser(request.body)
    } else if (request.method === 'DELETE') {
      result = await new UserController().deleteUser(request.body)
    }
  } catch (error) {
    result = { code: 400, message: error.message, error: error }
  }
  response.status(result.code).send(result)
})

app.use('/v1', router)

const authApi = functions.https.onRequest(app)

export { authApi }