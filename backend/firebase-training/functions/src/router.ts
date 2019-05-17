import * as functions from 'firebase-functions'
import * as express from 'express'
import * as corsLib from 'cors'

const app = express()
const cors = corsLib()
const router = express.Router()
router.use((request, response, next) => {
	return cors(request, response, () => {
    /** 
     * middleware 
     * ここでクロスドメイン制約や認証処理を行う
     * */
    console.log('request', request.body)
    next()
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

app.use('/v1', router)

const api = functions.https.onRequest(app)

export { api }