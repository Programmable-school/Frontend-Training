# firebase-training

## 目次
### Firestoreデータベース
- [メモフォームを作成（データの追加、読み込み）](./src/views/firestore/CreateFormPage.vue)
- [名簿リストを作成（データ追加、読み込み、更新、削除、リアルタイム取得、 検索クエリ）](./src/views/firestore/RosterListPage.vue)
- [ユーザーヘルスリストを作成（バッチ処理による一括処理）](./src/views/firestore/UserHealthListPage.vue)
- [商品登録と購入フォームを作成（トランザクション）]()
- [便利！Firestoreモデルクラスを作る]()

## Firebase 公式ページ
[https://firebase.google.com/docs/firestore/quickstart?hl=ja](https://firebase.google.com/docs/firestore/quickstart?hl=ja)

## 環境構築
### トレーニング用のVueテンプレートを作成
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
firebaseConfigSample.tsをfirebaseConfig.tsにリネームして、作成した[Firebaseの設定値](###Firebaseプロジェクトを作成)を追加します。<br>
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
    background: '#ffffff',
    whiteCloud: '#F8F9FB',
    grayTheme: '#79838C',
    blueTheme: '#5982EE',
    sky: '#A2DCED',
    sea: '#698FF0',
    blackFlat: '#202223',
    twitter: '#00aced',
    facebook: '#305097',
    line: '#5ae628',
    gold: '#FFD700',
    goldenrod: '#DAA520',
    red: '#F26964',
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
- [メモフォームを作成（データの追加、読み込み）](./src/views/firestore/CreateFormPage.vue)<br>
<br>
<a href="https://imgur.com/hPqE06I"><img src="https://i.imgur.com/hPqE06I.png" width="50%" height="50%" /></a>
<br>

- [名簿リストを作成（データ追加、読み込み、更新、削除、リアルタイム取得, 検索クエリ）](./src/views/firestore/RosterListPage.vue)<br>
<br>
<a href="https://imgur.com/3lWAZwK"><img src="https://i.imgur.com/3lWAZwK.png" width="50%" height="50%" /></a>
<br>

- [ユーザーヘルスリストを作成（バッチ処理による一括処理](./src/views/firestore/UserHealthListPage.vue)<br>
<br>
<a href="https://imgur.com/DzKiGOW"><img src="https://i.imgur.com/DzKiGOW.png" width="50%" height="50%" /></a>
<br>
- [商品登録と購入フォームを作成（トランザクション）]()<br>
<br>
- [便利！Firestoreモデルクラスを作る]()<br>
<br>

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
