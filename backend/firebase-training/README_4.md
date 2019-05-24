# firebase-training

## 目次
### Cloud Functions
- [Hello Worldを表示](#Lesson15)
- [GET、POST、PUT、DELETEリクエスト](#Lesson16)
- [expressの導入（router、middleware）](#Lesson17)
- [Firestoreを操作、トリガー実行](#Lesson18)
- [Vue.jsと連携](#Lesson19)
- [セキュアなリクエスト](#Lesson20)

### 課題
準備中

## Firebase公式ページ
[https://firebase.google.com/docs/web/setup?hl=ja](https://firebase.google.com/docs/web/setup?hl=ja)

- [Cloud Functions](https://firebase.google.com/docs/functions?hl=JA)

## 準備
[環境構築](./README_1.md#環境構築)を行ってから作業してください。

Cloud Functionsの環境構築します。<br>

```sh
$ firebase init

? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, then Enter to confirm your choi
ces. 
 ◯ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
❯◉ Functions: Configure and deploy Cloud Functions
 ◯ Hosting: Configure and deploy Firebase Hosting sites
 ◯ Storage: Deploy Cloud Storage security rules

? What language would you like to use to write Cloud Functions? TypeScript
? Do you want to use TSLint to catch probable bugs and enforce style? Yes
✔  Wrote functions/package.json
✔  Wrote functions/tslint.json
✔  Wrote functions/tsconfig.json
✔  Wrote functions/src/index.ts
✔  Wrote functions/.gitignore
? Do you want to install dependencies with npm now? No
```


構築が完了するとカレントディレクトリに functions ディレクトリが作成されます。

ディレクトリ構成は以下の通りです。

```
.
├── package.json
├── src
│   └── index.ts
├── tsconfig.json
└── tslint.json
```

今後、Cloud Functionsの作業する場合は functions ディレクトリ内で作業を行います。<br>
また、index.tsがエンドポイントです。ここで設定したAPIが外部公開されます。


package.jsonの中を確認します。<br>
yarn等でライブラリをインストールする際に、ローカルのnodeバージョンと一致していない場合はエラーになるため、ライブラリをインストールする際は以下の設定を削除します。

```json
  "engines": {
    "node" : "8"
  },
```

yarnでライブラリを入れ直します。

```sh
$ yarn install
```

インストール完了後、先ほど削除したenginesを戻してください。

ローカルサーバーでテストするため、firebase-functions-test をインストールします。

```sh
$ yarn add firebase-functions-test --dev
```

※注意<br>
バージョンの古いfirebase-toolsでfunctionsを構築した場合、バージョンが古いTypeScriptがインストールされます。

TypeScriptのバージョンが2.8.Xの場合はビルドエラーが発生するため、最新のバージョンを入れ直します。

```sh
$ yarn remove typescript
$ yarn add typescript --dev
```




## レッスン
本プロジェクトをcloneして以下のレッスンのサンプルコードを写経してください。

## Lesson15
### Hello Worldを表示
#### 実装

index.tsを以下のように実装してください。

```TypeScript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send('Hello World')
})
```

ローカルサーバーを立ち上げます。
```sh
$ yarn serve

⚠  Default "firebase-admin" instance created!
i  functions: HTTP trigger initialized at http://localhost:5000/fir-training-ae8b1/us-central1/helloWorld
```

別のターミナルから、curlを使ってリクエストすると Hello World が返ってきます。

```sh
$ curl http://localhost:5000/fir-training-ae8b1/us-central1/helloWorld
Hello World
```

サーバーへdeployします。

```sh
$ yarn deploy 

✔  functions: Finished running predeploy script.
i  functions: ensuring necessary APIs are enabled...
✔  functions: all necessary APIs are enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (25.3 KB) for uploading
✔  functions: functions folder uploaded successfully
i  functions: updating Node.js 8 function helloWorld(us-central1)...
✔  functions[helloWorld(us-central1)]: Successful update operation. 

✔  Deploy complete!
```

deployしたAPIをcurlでリクエストすると Hello World が返ってきます。

実行例は以下の通りです（URLはご自身のサーバーのURLを指定してください）。

```sh
$ curl https://us-central1-fir-training-ae8b1.cloudfunctions.net/helloWorld
Hello World
```

## Lesson16
### GET、POST、PUT、DELETEリクエスト
#### 実装

index.tsに以下のコードを実装します。

```typescript
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
```

yarn serveでローカルサーバーを立ち上げて以下のコマンドを実行し、期待するレスポンスが返ってくるか確認してください。

```sh
# GET request
$ curl -X GET http://localhost:5000/fir-training-ae8b1/us-central1/requestTest
{"code":200,"result":{"message":"Request method is GET"}}

# POST request
$ curl -X POST http://localhost:5000/fir-training-ae8b1/us-central1/requestTest  -H "Content-Type: application/json" -d '{"id":"100"}' 
{"code":200,"result":{"message":"Request method is POST. body is 100"}}

# PUTとDELETEはなぜかローカルサーバーだと動かない...
```

今回作成したAPIのみをdeployします。以下のコマンドを実行してください。

```sh
$ firebase deploy --only functions:requestTest
```

deployしたAPIを実行して確認します。

実行例は以下の通りです（URLはご自身のサーバーのURLを指定してください）。

```sh
# GET request
$ curl -X GET https://us-central1-fir-training-ae8b1.cloudfunctions.net/requestTest
{"code":200,"result":{"message":"Request method is GET"}}

# POST request
$ curl -X POST https://us-central1-fir-training-ae8b1.cloudfunctions.net/requestTest  -H "Content-Type: application/json" -d '{"id":"100"}' 
{"code":200,"result":{"message":"Request method is POST. body is 100"}}

# PUT request
$ curl -X PUT https://us-central1-fir-training-ae8b1.cloudfunctions.net/requestTest
{"code":200,"result":{"message":"Request method is PUT"}}

# DELETE request
$ curl -X DELETE https://us-central1-fir-training-ae8b1.cloudfunctions.net/requestTest
{"code":200,"result":{"message":"Request method is DELETE"}}
```

## Lesson17
### expressの導入（router、middleware）

[https://firebase.google.com/docs/functions/http-events?hl=ja](https://firebase.google.com/docs/functions/http-events?hl=ja)

#### 実装

Functionsにexpressを導入します。

```sh
$ yarn add express cors

$ yarn add @types/express @types/cors --dev
```

router.tsを作成します。

```typescript
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
```

index.ts に router.ts を追加します。

```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
/** 追加 */
import * as router from './router'

〜〜〜〜〜〜〜〜

/** 追加 */
export const api = router.api
```

ローカルサーバーを立ち上げ実行します。

```sh
# Rquest to helloWorld API
$ curl http://localhost:5000/fir-training-ae8b1/untral1/api/v1/helloWorld
HelloWorld

# Request to item API by GET
$ curl -X GET http://localhost:5000/fir-training-ae8b1/us-central1/api/v1/item
{"id":0,"message":"item"}

# Request to item API by POST
$ curl -X POST http://localhost:5000/fir-training-ae8b1/us-central1/api/v1/item -H "Content-Type: application/json" -d '{"data":"ITEM_DATA"}'
{"id":0,"message":"item","postData":"ITEM_DATA"}

# Request to page API by GET
$ curl -X GET http://localhost:5000/fir-training-ae8b1/us-central1/api/v1/page/1
{"id":1,"message":"page"}
```

## Lesson18
### Firestoreを操作、トリガー実行
#### 実装

##### Firestoreを操作

Firestoreを操作する処理を実装します。

srcにcontrollerディレクトリを作成して以下のコードを実装してください。<br>
[UserContoroller.ts](./functions/src/controller/UserController.ts)


リクエスト結果のインターフェースを実装します。src配下に以下のコードを実装してください。<br>
[Result.ts](./functions/src/Result.ts)

router.tsにUserContoroller.tsをつなぎます。

```typescript
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as corsLib from 'cors'

/** 追加 */
import UserController from './controller/UserController'
import Result from './Result'

〜〜〜〜〜

/** 追加 */
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

```

実装が完了したらサーバーへdeployして確認します。

実行例は以下の通りです（URLはご自身のサーバーのURLを指定してください）。

```sh
# userのリストを取得
# Firestoreのuserコレクション内のドキュメントを全て取得する
$ curl -X GET https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user
{"code":200,"message":"Success","data":[{"uid":"WH5fF5y5wDhisHWurDpD","updatedAt":{"_seconds":1558228783,"_nanoseconds":0},"createdAt":{"_seconds":1558228783,"_nanoseconds":0},"name":"taro"},{"name":"taro","uid":"Y9kta7mRMerm6qFAm6Ep","updatedAt":{"_seconds":1558229150,"_nanoseconds":418000000},"createdAt":{"_seconds":1558229150,"_nanoseconds":418000000}}]}

# userを新規作成
# FirebaseコンソールからFirestoreを見るとversion/5/userにドキュメントが作成される。
$ curl -X POST https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user -H "Content-Type: application/json" -d '{"name":"taro"}'
{"code":200,"message":"Success","data":{"uid":"Y9kta7mRMerm6qFAm6Ep","name":"taro","createdAt":{"_seconds":1558229150,"_nanoseconds":418000000},"updatedAt":{"_seconds":1558229150,"_nanoseconds":418000000}}}

# 指定したdocumentIDのuserを更新
$ curl -X PUT https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user -H "Content-Type: application/json" -d '{"id":"Y9kta7mRMerm6qFAm6Ep", "name":"hanako"}'

# 指定したdocumentIDのuserを削除
$ curl -X DELETE https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user -H "Content-Type: application/json" -d '{"id":"Y9kta7mRMerm6qFAm6Ep"}'
```

※なぜかローカルサーバーだとexpressのPUTとDELETEのリクエストが404で応答されるため、cloudfunctionsのサーバー上で確認しています（firebase-toolsのバグ？）

##### トリガー実行

[https://firebase.google.com/docs/functions/firestore-events?hl=ja](https://firebase.google.com/docs/functions/firestore-events?hl=ja)


Firestore内のデータの状況（作成、更新、削除）に応じて処理を行うよう実装します。

先ほど実装したAPIのリクエスト後に処理が発火する処理を実装します。

index.tsに以下のコードを追加します。

```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as router from './router'

/** 追加 */
import UserController from './controller/UserController'

〜〜〜〜〜〜〜〜

/** 追加 */
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
```

※ regionを指定すると利用したいロケーションを選択できる。東京リージョンにすると日本からのアクセスの速度が向上する。



実装後、サーバーへdeployしてください。


Firestoreのデータ操作（作成、更新、削除）すると、実装したトリガーが処理されます。

新規作成で発火（URLはご自身のサーバーのURLを指定してください）。

```sh
# userを新規作成
$ curl -X POST https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user -H "Content-Type: application/json" -d '{"name":"hanako"}'
```

Firebase functionsのコンソール画面のログから処理されていることが確認できます。

<a href="https://imgur.com/s1JOP8V"><img src="https://i.imgur.com/s1JOP8V.png" width="70%" height="70%" /></a>


更新で発火（URLはご自身のサーバーのURLを指定してください）。

```sh
# 指定したdocumentIDのuserを更新
$ curl -X PUT https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user -H "Content-Type: application/json" -d '{"id":"Y9kta7mRMerm6qFAm6Ep", "name":"hanako"}'
```

<a href="https://imgur.com/YpoN0HB"><img src="https://i.imgur.com/YpoN0HB.png" width="70%" height="70%" /></a>


削除で発火（URLはご自身のサーバーのURLを指定してください）。

```sh
# 指定したdocumentIDのuserを削除
$ curl -X DELETE https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/v1/user -H "Content-Type: application/json" -d '{"id":"Y9kta7mRMerm6qFAm6Ep"}'
```
<a href="https://imgur.com/QL5koD4"><img src="https://i.imgur.com/QL5koD4.png" width="70%" height="70%" /></a>


## Lesson19
### Vue.jsと連携

#### スクリーンショット
<a href="https://imgur.com/CLQzi8h"><img src="https://i.imgur.com/CLQzi8h.png" width="70%" height="70%" /></a>

#### 実装

Vue.jsでユーザリストの作成、更新、削除フォームを作成し、Lesson18でdeployしたAPIを操作します。

APIの操作はaxiosを利用します。

axios.createでAPIのurlとheadersにパラメータを設定します（URLはご自身のサーバーのURLを指定してください）。


```typescript
import axios from 'axios'

〜〜〜

/**
 * baseUrl for Request API.
 * axios create for Request API.
 */
baseUrl: string = 'https://us-central1-fir-training-ae8b1.cloudfunctions.net/api/'
axios = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: this.baseUrl,
})
```

以下のコードを実装し、Vue.jsのページとして利用できるようにしてください。<br>
[UserListPage.vue](./src/views/functions/UserListPage.vue)



## Lesson20
### セキュアなリクエスト

[https://firebase.google.com/docs/functions/callable?hl=ja](https://firebase.google.com/docs/functions/callable?hl=ja)

#### スクリーンショット

<a href="https://imgur.com/3n5spTS"><img src="https://i.imgur.com/3n5spTS.png" width="70%" height="70%" /></a>

#### 実装

functions.https.onCall を用いると認証ユーザからのリクエストのみを許容することができます。<br>
認証していないユーザからのリクエストは全て拒否されます。

index.tsに以下のコードを実装してください。

```typescript
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
```

また onRequest でも アクセストークンを検証することで onCall と同等の処理を行うことができます。

expressのmiddlewareを利用して、Clientから送られてきたアクセストークンを検証し、一致していれば処理を続行するようにしています。

```typescript
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
```

Clientからはrequestのheaders部にアクセストークンを付与してリクエストします。

アクセストークンはfirebase authanticationから取得できます（ログインしている状態のみ）。

```typescript
accessToken: string = ''

/** ログイン時にアクセストークンを設定 */
onAuthState() {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user !== null) {
      this.accessToken = await user!.getIdToken()
    }
  })
}

/** headersにaccessTokenを設定してrequestする */
async post() {
  try {
    const params = { name: 'guest' }
    const result = await this.axios.post('/v1/user', {
      params,
      headers: { authorization: this.accessToken },
    })
  } catch (error) {
    console.error('firebase error', error)
  }
}
```


それでは、router.tsに認証処理を追加した auth_router.ts を実装します。

router.tsの同じディレクトリ内に以下のコードを実装してください。<br>
[auth_router.ts](./functions/src/auth_router.ts)


index.tsにauth_router.tsを追加します。

```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as router from './router'

/** 追加 */
import * as authRouter from './auth_router'

〜〜〜〜〜〜〜〜

/** 追加 */
export const authApi = authRouter.authApi
```



全て実装後、サーバーへdeployします。

```sh
$ firebase deploy --only functions:authHelloWorld,functions:authApi
```


Vue.jsでフォームを作ります。

以下のコードを実装し、Vue.jsのページとして利用できるようにしてください。<br>
[AuthUserListPage.vue](./src/views/functions/AuthUserListPage.vue)


ログインしている状態であればリクエストによりデータ操作が可能、ログインしていない状態であればエラー（ステータスコードが400）になることが確認できます。


## 課題
準備中

