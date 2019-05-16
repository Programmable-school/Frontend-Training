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

/** /v1/test を指定して利用できる */
router.use('/test', async (request, response) => {
  response.status(200).send('Test')
})

app.use('/v1', router)

const api = functions.https.onRequest(app)

export { api }