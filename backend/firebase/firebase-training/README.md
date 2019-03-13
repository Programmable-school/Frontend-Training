# firebase-training

## 目次
### Firestoreデータベース
- [メモフォームを作成（データの追加、読み込み）](#Lesson1)
- [名簿リストを作成（データ追加、読み込み、更新、削除、リアルタイム取得、 検索クエリ）](#Lesson2)
- [ユーザーヘルスリストを作成（バッチ処理による一括処理）](#Lesson3)
- [商品登録と購入機能を作成（トランザクション）](#Lesson4)
- [便利！Firestoreモデルクラスを作る](#Lesson5)

### Firebase Authantication 
- [匿名認証](#Lesson6)
- [メール認証](#Lesson7)
- [認証情報を利用してFirestoreへユーザーデータを保存](#Lesson8)
- [Firestoreセキュリティルールを利用](#Lesson9)
- [SNS認証](#Lesson10)

## Firebase 公式ページ
[https://firebase.google.com/docs/web/setup?hl=ja](https://firebase.google.com/docs/web/setup?hl=ja)

- [Firestore](https://firebase.google.com/docs/firestore/quickstart?hl=ja)
- [Firebase Authantication](https://firebase.google.com/docs/auth/?hl=ja)

## 環境構築
### トレーニング用Vueテンプレートを作成
```sh
$ vue create firebase-training
```
<a href="https://imgur.com/5JOfmpS"><img src="https://i.imgur.com/5JOfmpS.png" width="30%" height="30%" /></a><br>
<br>
<br>
設定項目は以下の通りです。<br>
<a href="https://imgur.com/n6EfWaO"><img src="https://i.imgur.com/n6EfWaO.png" width="50%" height="50%" /></a>

### Firebaseプロジェクトを作成
※Googleアカウントを取得してください。<br>
[Firebaseコンソール](https://console.firebase.google.com/u/0/?hl=ja)より「プロジェクトの追加」でプロジェクトを作成します。<br>
<br>
<a href="https://imgur.com/gRb3yJg"><img src="https://i.imgur.com/gRb3yJg.png" width="50%" height="50%" /></a>
<br>
<br>
作成後、「ウェブアプリにFirebaseを追加する」を選択してFirebaseの設定値を保存してください。<br>
<br>
<a href="https://imgur.com/dxNKASf"><img src="https://i.imgur.com/dxNKASf.png" width="50%" height="50%" /></a>
<br>
<br>
左メニューのDatabaseを選択してFirestoreの設定をします。<br>
Firestoreトレーニングではテストモードでトレーニングをします（Firebase Authanticationでロックモードを利用したトレーニングを行います）。<br>
<br>
<a href="https://imgur.com/AgbcnC4"><img src="https://i.imgur.com/AgbcnC4.png"  width="50%" height="50%" /></a>

### トレーニングで利用するライブラリを導入
```sh
$ yarn add firebase vuetify axios date-fns
```

### Firebaseの設定
src内にrepositoryフォルダを作成し、firebaseConfig.tsを作成して[Firebaseの設定値](###Firebaseプロジェクトを作成)を追加します。<br>
プロジェクトの設定値はFirebaseコンソールから確認できます。<br>

#### ./src/repository/firebaseConfig.ts
```ts
/* ここにFirebaseの設定値を追加する */
export const firebaseConfig = {
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  databaseURL: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  projectId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  storageBucket: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  messagingSenderId: 'XXXXXXXX',
}
```

設定後、main.tsにFirebaseの初期化コードを追加します。

#### ./src/main.ts
```ts
import { firebaseConfig } from '@/repository/firebaseConfig'
import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp(firebaseConfig)
firebase.firestore.FieldValue.serverTimestamp()
```

### Vuetifyの設定
index.htmlとmain.tsにVuetifyの初期化コードを追加します。

#### ./public/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
  〜〜〜〜 省略 〜〜〜〜
    <!-- 追加 -->
    <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">
    <link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet" type="text/css">
    <!--------->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>firebase-training</title>
  </head>
  〜〜〜〜 省略 〜〜〜〜
</html>
```

#### ./src/main.ts
```ts
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

// themeはお好みでどうぞ。
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base,
    theme: '#5982EE',
    twitter: '#00aced',
    facebook: '#305097',
    line: '#5ae628',
    error: '#F26964',
    succcess: '#698FF0',
  },
  options: {
    themeVariations: ['original', 'secondary'],
  },
})
```

## レッスン
本プロジェクトをcloneして以下のレッスンのサンプルコードを写経してください。

## Lesson1
### メモフォームを作成（データの追加、読み込み）
#### スクリーンショット
<a href="https://imgur.com/hPqE06I"><img src="https://i.imgur.com/hPqE06I.png" width="50%" height="50%" /></a>

[こちらのコード](./src/views/firestore/CreateFormPage.vue)を写経してページを作成してください。
<br>

## Lesson2
### 名簿リストを作成（データ追加、読み込み、更新、削除、リアルタイム取得, 検索クエリ）
#### スクリーンショット
<a href="https://imgur.com/3lWAZwK"><img src="https://i.imgur.com/3lWAZwK.png" width="50%" height="50%" /></a>

[こちらのコード](./src/views/firestore/RosterListPage.vue)を写経してページを作成してください。
<br>

## Lesson3
### ユーザーヘルスリストを作成（バッチ処理による一括処理）
#### スクリーンショット
<a href="https://imgur.com/DzKiGOW"><img src="https://i.imgur.com/DzKiGOW.png" width="50%" height="50%" /></a>

[こちらのコード](./src/views/firestore/UserHealthListPage.vue)を写経してページを作成してください。
<br>

## Lesson4
### 商品登録と購入機能を作成（トランザクション）
#### スクリーンショット
<a href="https://imgur.com/EOXr36b"><img src="https://i.imgur.com/EOXr36b.png" width="50%" height="50%" /></a>

[こちらのコード](./src/views/firestore/ShopItemBuyPage.vue)を写経してページを作成してください。
<br>

## Lesson5
### 便利！Firestoreモデルクラスを作る
<br>


## Lesson6
### 匿名認証
#### スクリーンショット
<a href="https://imgur.com/oVFEFwn"><img src="https://i.imgur.com/oVFEFwn.png" width="50%" height="50%" /></a>


<a href="https://imgur.com/cr8xVhT"><img src="https://i.imgur.com/cr8xVhT.png" width="50%" height="50%" /></a>

#### 匿名認証を許可する
Firebaseコンソールで認証設定より匿名認証を許可してください。

<a href="https://imgur.com/NpxKdkj"><img src="https://i.imgur.com/NpxKdkj.png" width="50%" height="50%" /></a>


<a href="https://imgur.com/x6c01dN"><img src="https://i.imgur.com/x6c01dN.png" width="50%" height="50%" /></a>


#### 実装
firebase/auth を使ってログインとログアウトを実装します。

```ts
/** 匿名認証でログインする */
async signInAnonymously() {
  try {
    const result = await firebase.auth().signInAnonymously()
    console.log(result)
  } catch (error) {
    console.error('firebase error', error)
  }
}

/** ログアウトする */
async signOut() {
  try {
    const result = await firebase.auth().signOut()
    console.log(result)
  } catch (error) {
    console.error('firebase error', error)
  }
}
```

匿名認証が完了するとユーザ情報が登録されます。以下のようにFirebaseコンソール上で作成されたユーザ情報が確認できます。

<a href="https://imgur.com/b8BBIEC"><img src="https://i.imgur.com/b8BBIEC.png" width="50%" height="50%" /></a>


[AnonymouslyPage](./src/views/authentication/AnonymouslyPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。


## Lesson7
### メール認証
#### スクリーンショット
<a href="https://imgur.com/Zc6BP7z"><img src="https://i.imgur.com/Zc6BP7z.png" width="50%" height="50%" /></a>


#### メール認証を許可する
Firebaseコンソールで認証設定よりメール認証を許可してください。


<a href="https://imgur.com/nBZf2rC"><img src="https://i.imgur.com/nBZf2rC.png" width="50%" height="50%" /></a>


本人確認メールのテンプレートの変更できます。変更する場合はFirebaseコンソールより変更してください。


<a href="https://imgur.com/te0JsfD"><img src="https://i.imgur.com/te0JsfD.png" width="50%" height="50%" /></a>

#### 実装
メール認証を行う場合は「サインアップ」「ログイン」機能を実装します。
```ts
/** サインアップする */
async signUp(email: string, password: string) {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    console.log(result)
    const user = firebase.auth().currentUser
    if (user !== null) {
      /** 本人確認メールを送信 */
      await user.sendEmailVerification()
    }
  } catch (error) {
    console.error('firebase error', error)
  }
}

/** ログインする */
async login(email: string, password: string)) {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password)
    console.log(result)
  } catch (error) {
    console.error('firebase error', error)
  }
}
```

サインアップが完了するとユーザ情報が登録されます。


<a href="https://imgur.com/AlGZSv4"><img src="https://i.imgur.com/AlGZSv4.png" width="50%" height="50%" /></a>


[EmailAuthPage](./src/views/authentication/EmailAuthPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。

## Lesson8
### 認証情報を利用してFirestoreへユーザーデータを保存

#### 実装

[Lesson7](#Lesson7)の機能に対して、Firestoreへユーザーデータを保存する機能を実装します。


サインアップ完了後、userコレクションへユーザーデータを保存します。

認証情報とユーザーデータを紐づけるために、ユーザーデータのドキュメントIDを認証情報のuidにします（user.uid）。


```ts
/** サインアップする */
async signUp(email: string, password: string) {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    console.log(result)
    const user = firebase.auth().currentUser
    if (user !== null) {
      /** 本人確認メールを送信 */
      await user.sendEmailVerification()
      /** Firestoreへユーザーデータを保存 */
      await this.createUser(user.uid)
    }
  } catch (error) {
    console.error('firebase error', error)
  }
}

/**
 * ユーザーデータを作成する。
 */
async createUser(userId: string) {
  try {
    const db: firebase.firestore.Firestore = firebase.firestore()
    const batch: firebase.firestore.WriteBatch = db.batch()
    const ref: firebase.firestore.DocumentReference = db.collection('version/3/user').doc(userId)
    batch.set(ref, {
      uid: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'ゲスト',
    }, { merge: true} )
    await batch.commit()
  } catch (error) {
    console.error('firebase error', error)
  }
}
```


以下のようにユーザーデータが保存されます。


<a href="https://imgur.com/eYyWgMy"><img src="https://i.imgur.com/eYyWgMy.png" width="50%" height="50%" /></a>



[EmailAuthWithCreateUserPage](./src/views/authentication/EmailAuthWithCreateUserPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。

## Lesson9
### Firestoreセキュリティルールを利用
#### スクリーンショット
#### 実装


## Lesson10
### SNS認証
#### スクリーンショット
#### 実装


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
