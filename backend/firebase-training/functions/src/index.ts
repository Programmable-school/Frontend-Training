import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

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
    responseCode = 400
    resultParam.message = error.message
  }
  response.status(responseCode).send({ code: responseCode, result: resultParam })
})