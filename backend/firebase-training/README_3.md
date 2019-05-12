# firebase-training

## 目次
### Cloud Functions
- [Hello Worldを表示](#Lesson15)
- GET、POST、PUT、DELETE
- expressの導入（router、middleware）
- Firestoreトリガーで実行
- セキュアなリクエスト

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
 response.send("Hello World")
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

```sh
$ curl https://us-central1-fir-training-ae8b1.cloudfunctions.net/helloWorld
Hello World
```

## Lesson16
### GET、POST、PUT、DELETE
#### 実装

## Lesson17
### expressの導入（router、middleware）
#### 実装

## Lesson18
### Firestoreトリガーで実行
#### 実装

## Lesson19
### セキュアなリクエスト
#### 実装

## 課題
### タイトル
#### 答え

